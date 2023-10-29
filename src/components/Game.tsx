import { useState, useEffect, useRef } from 'react';
import { Sheep, SheepProps } from './Sheep';
import '../styles/Game.css';
import { useRecorder } from './Recorder';
import { useTranscript } from '../lib/useTranscript';
import { useHume } from '../lib/useHume';
import prompts from '../lib/prompts.json';
import groups from '../lib/groups.json';

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
  const MIN_TIME_BETWEEN_SHEEPS = 8000;
  const SHEEP_CHANCE = 0.05;

  const [intervalId, setIntervalId] = useState<any>(null); // if null, means game loop already running
  const [sheeps, setSheeps] = useState<SheepProps[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [dogImage, setDogImage] = useState("../assets/normal_dog.svg");
  const [lastSheepTime, setLastSheepTime] = useState(Date.now());
  const transcriptionRef = useRef<string>();
  const [finishedSheeps, setFinishedSheeps] = useState<SheepProps[]>([]);
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
      setSheeps(sheeps => {
        // score sheep
        console.log(groups[sheeps[0]?.type]);
        console.log(sortedEmotions[sortedEmotions.length - 1].name);
        if (sortedEmotions.slice(sortedEmotions.length - 4, sortedEmotions.length).some(emotion => {
          return groups[sheeps[0]?.type].includes(emotion.name);
        })) {
          console.log('matches')
          console.log(transcriptionRef.current);
          let cleanTrans = transcriptionRef.current?.toString();
          cleanTrans = cleanTrans?.toLowerCase().replace(/\.|,|\?|!/, '');
          console.log(cleanTrans);
          if (cleanTrans === sheeps[0].word) {
            console.log('transcription matches too')
            setSheeps(prev => {
              setFinishedSheeps(prevFinished => {
                return [...prevFinished, {...sheeps[0], y: 500}]
              })
              return [...prev.slice(1)]
            })
          } else {
            console.log('transcript doesnt match', 'trans', cleanTrans, 'word', sheeps[0].word)
          }
        }
        else
          console.log('doesnt match')
        console.log(sheeps);
        return sheeps;
      })
      testSheep();
      const currSheep = sheeps[0];
      console.log(currSheep.type)
    }).catch(error => console.log(error));
  };

  const { audioBlob, startAudioRecording, stopAudioRecording } = useRecorder(onNewAudio);

  const [showMenu, setShowMenu] = useState(true);

  //START BUTTON
  const handleStart = () => {
    setShowMenu(false); 
    startLoop();
  };

  //INSTRUCTIONS
  const handleInstructions = () => {
    
  };



  // set up testing data
  useEffect(() => {
    fetch('/env.json').then(res => res.json()).then(data => {
      (window as any).API_KEY = data.REACT_APP_API_KEY;
      // setSheeps([
      //   { asset: SheepWhite, progress: 0.5, y: 200, word:'hello'},
      //   { asset: SheepBlue, progress: 0.2, y: 300, word:'hello'},
      //   { asset: SheepRed, progress: 0.8, y: 400, word:'hello'}
      // ]);
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
    // setSheeps([
    //   { asset: SheepWhite, progress: 0, y: 200, word: 'hi'},
    //   { asset: SheepBlue, progress: -0.2, y: 300, word: 'hi' },
    //   { asset: SheepRed, progress: -0.8, y: 400, word: 'hi' },
    // ]);
    // startLoop();

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
    console.log(prompts);
    transcriptionRef.current = transcription;
  }, [transcription]);

  const addRandomSheep = () => {
    const POSSIBLE_Y: number[] = [250, 350, 450];
    console.log('spawning sheep');

    const promptsValues = Object.entries(prompts);
    const i = Math.floor(promptsValues.length * Math.random());
    const [word, type] = promptsValues[i];
    const progress = 0.0;
    const y = POSSIBLE_Y[Math.floor(Math.random() * POSSIBLE_Y.length)];
    setSheeps(prev => [...prev,
      {type, progress, y, word}
    ])
  }

  const stepGame = (): void => {
    setLastSheepTime(prev => {
      if (prev >= MIN_TIME_BETWEEN_SHEEPS && Math.random() < SHEEP_CHANCE) {
        addRandomSheep();
        return 0;
      }
      return prev + 100;
    });
    setSheeps((prev) => {
      let newSheeps = prev.map((sheep) => ({ ...sheep, progress: sheep.progress + 0.005 }));
      newSheeps = newSheeps.filter(sheep => {
        if (sheep.progress > 0.9) {
          console.log('sheep escaped!')
          return false;
        }
        return true;
      })
      return newSheeps;
    }
      
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
          <div>
            {transcription}
          </div>
          <div id="dog">
            <img src={`/src/assets/${dogImage}`} style={{ top: '50%', left: 3, position: 'absolute' }} alt="Dog" />
          </div>
          {sheeps.map((sheep, i) => {
            return <Sheep key={i} {...sheep} />;
          })}
          {
            finishedSheeps.map((sheep, i) => {
              return <Sheep key={i} {...sheep} />;
            })
          }
        </>
      )}
    </div>
    
  );
};
