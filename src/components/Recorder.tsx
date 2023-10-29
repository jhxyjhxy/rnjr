import { useEffect, useState } from "react";

export const useRecorder = (onNewAudio: Function) => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [recordingStartTime, setRecordingStartTime] = useState(0);

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
          setAudioBlob(event.data);
          // const recordingLength = Date.now() - recordingStartTime;
          setRecordingStartTime(prev => {
            onNewAudio(event.data, prev);
            return prev;
          })
        }
      };
    };

    setup();
  }, []);

  const startAudioRecording = () => {
    if (!recorder || !mediaStream) return;

    recorder.start();
    setRecordingStartTime(Date.now());
  };

  const stopAudioRecording = () => {
    if (!recorder || !mediaStream) return;

    recorder.stop();
  };

  return { audioBlob, startAudioRecording, stopAudioRecording };
}