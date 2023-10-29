import { useState, useEffect } from 'react';
import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import { Sheep, SheepProps } from './Sheep';
import '../styles/Game.css';
import { Recorder } from './Recorder';

export const Game = () => {
  // const vars
  const GAME_CLOCK_PERIOD = 100; // ms

  const [intervalId, setIntervalId] = useState<number | null>(null); // if null, means game loop already running
  const [sheeps, setSheeps] = useState<SheepProps[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  // set up testing data
  useEffect(() => {
    setSheeps([
      { asset: SheepWhite, progress: 0.5, y: 10},
      { asset: SheepBlue, progress: 0.2, y: 50},
      { asset: SheepRed, progress: 0.8, y: 90}
    ]);
    startLoop();
  }, []);

  const stepGame = ():void => {
    setSheeps(prev => prev.map(sheep => ({...sheep, progress: sheep.progress + 0.001})));
  };

  const startLoop = (): void => {
    if (intervalId !== null) return; // loop already running
    setIntervalId(setInterval(stepGame, GAME_CLOCK_PERIOD));
  };

  const stopLoop = (): void => {
    if (intervalId === null) return; // loop already stopped
    clearInterval(intervalId);
  }

  return (
  <div className="game-screen">
    <div
      onClick={() => {
        setRecording(prev => !prev);
      }}
      style={{backgroundColor: recording ? 'red' : 'gray'}}
    >{
      recording ? 'Stop Recording' : 'Record'}
    </div>
    {sheeps.map((sheep, i) => {
      return <Sheep key={i} {...sheep} />
    })}
    <Recorder recording={recording} />
  </div>
  )
}