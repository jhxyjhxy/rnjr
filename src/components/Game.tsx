import { useState, useEffect } from 'react';
import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import { Sheep, SheepProps } from './Sheep';
import '../styles/Game.css';
import { useRecorder } from './Recorder';
import { useTranscript } from '../lib/useTranscript';
import { useHume } from '../lib/useHume';

// Create a new component for the menu
const Menu = ({ onStart, onInstructions }) => (
  <div className="menu">
    <div className="buttons">
      <button onClick={onStart}>Start</button>
      <button onClick={onInstructions}>Instructions</button>
    </div>  
  </div>
);

export const Game = () => {
  // const vars
  const GAME_CLOCK_PERIOD = 100; // ms

  const [intervalId, setIntervalId] = useState<any>(null); // if null, means game loop already running
  const [sheeps, setSheeps] = useState<SheepProps[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [dogImage, setDogImage] = useState("../assets/normal_dog.svg");
  // const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  // const [recordingLength, setRecordingLength] = useState(0);
  
  const getEmotions = useHume();
  const onNewAudio = (audioBlob: Blob, recordingStartTime: number) => {
    const recordingLength = Date.now() - recordingStartTime;
    console.log('recording length', recordingLength);
    getEmotions(audioBlob, recordingLength).then(emotions => {
      console.log(emotions);
      const sortedEmotions = (emotions as any).prosody.predictions[0].emotions.sort((a, b) => a.score - b.score);
      console.log(sortedEmotions);
    }).catch(error => console.log(error));
  };

  const { audioBlob, startAudioRecording, stopAudioRecording } = useRecorder(onNewAudio);

  const [showMenu, setShowMenu] = useState(true);

  //START BUTTON
  const handleStart = () => {
    setShowMenu(false); 
  };

  //INSTRUCTIONS
  const handleInstructions = () => {
    
  };



  // set up testing data
  useEffect(() => {
    fetch('/env.json').then(res => res.json()).then(data => {
      (window as any).API_KEY = data.REACT_APP_API_KEY;
      setSheeps([
        { asset: SheepWhite, progress: 0.5, y: 200},
        { asset: SheepBlue, progress: 0.2, y: 300},
        { asset: SheepRed, progress: 0.8, y: 400}
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
      { asset: SheepWhite, progress: 0, y: 200},
      { asset: SheepBlue, progress: -0.2, y: 300 },
      { asset: SheepRed, progress: -0.8, y: 400 },
    ]);
    startLoop();

    const dogImages = ["../assets/normal_dog.svg", "../assets/half_bark_dog.svg", "../assets/bark_dog.svg"];
    let currentIndex = 0;
    let temp = 1;

    const intervalId = setInterval(() => {
      if (recording) {
        setDogImage(dogImages[currentIndex]);
        currentIndex = (currentIndex + temp) % dogImages.length;
        if (currentIndex == 2) temp = -1;
        else if (currentIndex == 0) temp = 1;
      }
      else setDogImage(dogImages[currentIndex]);
    }, 300); 

    return () => {
      clearInterval(intervalId);
    };
  }, [recording]);

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
    startAudioRecording();
  };

  const stopRecording = (): void => {
    setRecording(false);
    stopTranscribing();
    stopAudioRecording();
  } 

  return (
    <div className="game-screen">
      {showMenu ? ( // Render the menu conditionally
        <Menu onStart={handleStart} onInstructions={handleInstructions} />
      ) : (
        <>
          <div
            onClick={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
            style={{ backgroundColor: recording ? "red" : "gray" }}
          >
            {recording ? "Stop Recording" : "Record"}
          </div>
          <div id="dog">
            <img src={`/src/assets/${dogImage}`} style={{ top: '50%', left: 3, position: 'absolute' }} alt="Dog" />
          </div>
          {sheeps.map((sheep, i) => {
            return <Sheep key={i} {...sheep} />;
          })}
        </>
      )}
    </div>
    
  );
};
