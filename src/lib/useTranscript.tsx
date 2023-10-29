import { useEffect, useState } from "react";

export const useTranscript = () => {
  const [recognition, setRecognition] = useState<any>(null);
  const [transcription, setTranscription] = useState<string>("");

  // initialization
  useEffect(() => {
    const setup = async () => {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false; // continuous results vs single result
      recognition.lang = "en-US";
      recognition.interimResults = false;
      setRecognition(recognition);

      recognition.onstart = () => {
        console.log("recognition has started");
      };

      recognition.onend = () => {
        console.log("recognition has ended");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setTranscription(event.results[0][0].transcript);
      };
    };

    setup();
  }, []);

  const startTranscribing = () => {
    recognition?.start();
  };

  const stopTranscribing = () => {
    recognition?.stop();
  };

  const resetTranscript = () => {
    setTranscription("");
  };

  return {
    transcription,
    startTranscribing,
    stopTranscribing,
    resetTranscript,
  };
};
