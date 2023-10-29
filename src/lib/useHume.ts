import { useState } from "react"

export const useHume = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connectSocket = () => {
    const MAX_CONNECTION_TIME = 10000; // 10 secs;

    const apiKey = (window as any).API_KEY;    
    const socketUrl = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;
    const newSocket = new WebSocket(socketUrl);
    setSocket(newSocket);
    return new Promise((resolve, reject) => {
      newSocket.onopen = resolve;
      setTimeout(() => reject('max connection time'), MAX_CONNECTION_TIME);
    })
  };
  
  // utils
  async function blobToBase64(blob: Blob) {
    return new Promise((resolve: (value: string) => void, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  async function getEmotions(blob: Blob, streamWindowLengthMs: number) {
    const encodedBlob = await blobToBase64(blob);

    const response = JSON.stringify({
      data: encodedBlob,
      models: {
        prosody: {},
      },
      stream_window_ms: streamWindowLengthMs,
    });

    if (!socket || socket.readyState !== WebSocket.OPEN)
      await connectSocket();

    return new Promise((resolve, reject) => {
      if (socket === null) {
        // this shouldn't happen?
        return reject('socket was null');
      }

      socket.send(response);

      socket.onmessage = (event: MessageEvent) => {
        resolve(JSON.parse(event.data));
      };

      socket.onerror = (error) => {
        reject(error);
        console.log("hit error")
        // socket.close();
      };
    })
  };

  return getEmotions;
}