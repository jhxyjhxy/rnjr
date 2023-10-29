import { useEffect, useState } from "react";

interface RecorderProps {
  recording: boolean;
}

export const Recorder = (props: RecorderProps) => {
  const {recording} = props;

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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

  useEffect(() => {
    console.log('hello?')
    if (recording)
      startRecording();
    else
      stopRecording();
    console.log(audioChunks);
  }, [recording])

  const startRecording = () => {
    if (!recorder || !mediaStream) return;

    // setAudioChunks([]);
    recorder.start();
  }

  const stopRecording = () => {
    if (!recorder || !mediaStream) return;

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
    <div>asdf</div>
    // <div
    // style={{backgroundColor: recording ? 'red' : 'gray'}}
    // onClick={() => {
    //   console.log(audioChunks);
    //   setRecording(wasRecording => {
    //     if (wasRecording)
    //       stopRecording();
    //     else
    //       startRecording();
    //     return !wasRecording;
    //   });
    // }}>
    //   {recording ? 'Stop Recording' : 'Record'}
    // </div>
  )
}