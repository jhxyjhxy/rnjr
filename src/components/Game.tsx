import { useState, useEffect } from 'react';
import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import { Sheep, SheepProps } from './Sheep';
import '../styles/Game.css';
import { Recorder } from './Recorder';
import { useTranscript } from '../lib/useTranscript';
import { useHume } from '../lib/useHume';

export const Game = () => {
  // const vars
  const GAME_CLOCK_PERIOD = 100; // ms

  const [intervalId, setIntervalId] = useState<any>(null); // if null, means game loop already running
  const [sheeps, setSheeps] = useState<SheepProps[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingLength, setRecordingLength] = useState(0);


  const getEmotions = useHume();

  // set up testing data
  useEffect(() => {
    fetch('/env.json').then(res => res.json()).then(data => {
      (window as any).API_KEY = data.REACT_APP_API_KEY;
      setSheeps([
        { asset: SheepWhite, progress: 0.5, y: 10},
        { asset: SheepBlue, progress: 0.2, y: 50},
        { asset: SheepRed, progress: 0.8, y: 90}
      ]);
      startLoop();
    })
  }, []);

  const {
    transcription,
    startTranscribing,
    stopTranscribing,
    resetTranscript,
  } = useTranscript();

  // set up testing data
  useEffect(() => {
    setSheeps([
      { asset: SheepWhite, progress: 0.5, y: 10 },
      { asset: SheepBlue, progress: 0.2, y: 50 },
      { asset: SheepRed, progress: 0.8, y: 90 },
    ]);
    startLoop();
  }, []);

  useEffect(() => {
    console.log(transcription);
  }, [transcription]);

  const stepGame = (): void => {
    setSheeps((prev) =>
      prev.map((sheep) => ({ ...sheep, progress: sheep.progress + 0.001 }))
    );
  };

  const startLoop = (): void => {
    if (intervalId !== null) return; // loop already running
    setIntervalId(setInterval(stepGame, GAME_CLOCK_PERIOD) );
  };

  const stopLoop = (): void => {
    if (intervalId === null) return; // loop already stopped
    clearInterval(intervalId);
  };

  const startRecording = (): void => {
    setRecording(true);
    startTranscribing();
  };

  const stopRecording = (): void => {
    setRecording(false);
    stopTranscribing();
    audioChunks.forEach(x => {
      getEmotions(x, recordingLength).then(emotions => {
        const sortedEmotions = emotions.prosody.predictions[0].emotions.sort((a, b) => a.score - b.score);
        console.log(emotions);
        console.log(sortedEmotions);
      });
    });
  }

  return (
    <div className="game-screen">
      <div
        onClick={() => {
          if (recording) stopRecording();
          else startRecording();
        }}
        style={{ backgroundColor: recording ? "red" : "gray" }}
      >
        {recording ? "Stop Recording" : "Record"}
      </div>
      {sheeps.map((sheep, i) => {
        return <Sheep key={i} {...sheep} />;
      })}
      <Recorder recording={recording} setAudioChunks={setAudioChunks} setRecordingLength={setRecordingLength}/>
    </div>
  );
};
