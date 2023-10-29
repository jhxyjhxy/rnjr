import { useState, useEffect } from 'react';
import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import { Sheep, SheepProps } from './Sheep';
import '../styles/Game.css';
import { Recorder } from './Recorder';
import { getEmotions, startSocket } from '../lib/api';

export const Game = () => {
  // const vars
  const GAME_CLOCK_PERIOD = 100; // ms

  const [intervalId, setIntervalId] = useState<any>(null); // if null, means game loop already running
  const [sheeps, setSheeps] = useState<SheepProps[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingLength, setRecordingLength] = useState(0);

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
      startSocket(setSocket);
    })
  }, []);

  const stepGame = ():void => {
    setSheeps(prev => prev.map(sheep => ({...sheep, progress: sheep.progress + 0.001})));
  };

  const startLoop = (): void => {
    if (intervalId !== null) return; // loop already running
    setIntervalId(setInterval(stepGame, GAME_CLOCK_PERIOD) );
  };

  const stopLoop = (): void => {
    if (intervalId === null) return; // loop already stopped
    clearInterval(intervalId);
  }

  const startRecording = (): void => {
    // start recording
    setRecording(true);
  }

  const sendAudioWithRetries = (audioChunks: Blob[], numTriesSoFar: number) => {
    const MAX_RETRIES = 20;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      if (numTriesSoFar >= MAX_RETRIES) return;
      setTimeout(() => {
        sendAudioWithRetries(audioChunks, numTriesSoFar+1);
      }, 100);
    }

    audioChunks.forEach(x => {
      getEmotions(socket as WebSocket, x, recordingLength).then((response) => {
        console.log(response);
      })
    });
  }

  const stopRecording = (): void => {
    setRecording(false);
    sendAudioWithRetries(audioChunks, 0);
    
    }

  return (
  <div className="game-screen">
    <div
      onClick={() => {
        if (recording)
          stopRecording();
        else
          startRecording();
      }}
      style={{backgroundColor: recording ? 'red' : 'gray'}}
    >{
      recording ? 'Stop Recording' : 'Record'}
    </div>
    {sheeps.map((sheep, i) => {
      return <Sheep key={i} {...sheep} />
    })}
    <Recorder recording={recording} setAudioChunks={setAudioChunks} setRecordingLength={setRecordingLength}/>
  </div>
  )
}