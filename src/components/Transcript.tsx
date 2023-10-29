// import { useEffect, useState } from "react";

// interface TranscriptProps {
//   recording: boolean;
// }

// export const Transcription = (props: TranscriptProps) => {
//   const { recording } = props;
//   const [recognition, setRecognition] = useState<any>(null);

//   // initialization
//   useEffect(() => {
//     const setup = async () => {
//       const recognition = new (window as any).webkitSpeechRecognition();
//       recognition.continuous = false; // continuous results vs single result
//       recognition.lang = "en-US";
//       recognition.interimResults = false;
//       //   recognition.maxAlternatives = 1; // do we need / allow for alternatives
//       setRecognition(recognition);

//       recognition.onstart = () => {
//         console.log("recognition has started");
//       };

//       recognition.onend = () => {
//         console.log("recognition has ended");
//       };

//       let transcript = "";
//       recognition.onresult = (event: SpeechRecognitionResult) => {
//         transcript = event.result[0][0].transcript;
//       };
//     };

//     setup();
//   }, []);

//   useEffect(() => {
//     if (recording) startTranscripting();
//     else stopTranscripting();
//   }, [recording]);

//   const startTranscripting = () => {
//     recognition.start();
//   };

//   const stopTranscripting = () => {
//     recognition.stop();
//   };

//   return <div>transcripty</div>;
// };

import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Transcription = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition</p>;
  }

  return (
    <div>
      <p>microphone: {listening ? "on" : "off"}</p>
      <button
        onClick={() => {
          SpeechRecognition.startListening();
        }}
      >
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>Final Tranny: {transcript}</p>
    </div>
  );
};
export default Transcription;
