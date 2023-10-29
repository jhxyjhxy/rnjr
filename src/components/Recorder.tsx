import { useEffect, useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

interface RecorderProps {
  
}

export const Recorder = (props: RecorderProps) => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState<boolean>(false);

  // initialization
  useEffect(() => {
    const setup = async () => {
      const mediaOptions = { video: false, audio: true };
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaOptions);
      setMediaStream(mediaStream);
      const recorder = new MediaRecorder(mediaStream);
      setRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
    };

    setup();
  }, []);

  const startRecording = () => {
    if (!recorder || !mediaStream) return;
    if (recording) return;

    // setAudioChunks([]);
    recorder.start();
  }

  const stopRecording = () => {
    if (!recorder || !mediaStream) return;
    if (!recording) return;

    recorder.stop();
  }

  // const record = (length: number): Promise<Blob> => {
  //   if (!recorder || !mediaStream) return Promise.reject('not ready');
  //   if (recording) return Promise.reject('already recording');

  //   return new Promise(async (resolve: (blob: Blob) => void, _) => {
  //     recorder.ondataavailable = (blobEvent) => {
  //       resolve(blobEvent.data);
  //     };

  //     if (recorder.state !== "recording") recorder.start();
  //     setTimeout(() => {
  //       if (recorder.state === "recording")
  //         recorder.stop();
  //     }, length);
  //   });
  // }

  return (
    <div
    style={{backgroundColor: recording ? 'red' : 'gray'}}
    onClick={() => {
      console.log(audioChunks);
      setRecording(wasRecording => {
        if (wasRecording)
          stopRecording();
        else
          startRecording();
        return !wasRecording;
      });
    }}>
      {recording ? 'Stop Recording' : 'Record'}
    </div>
  )
}