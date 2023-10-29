import { useState, useRef } from "react"

export const useHume = () => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>();

  const connectSocket = (): Promise<void> => {
    const MAX_CONNECTION_TIME = 10000; // 10 secs;

    const apiKey = (window as any).API_KEY;    
    const socketUrl = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;
    const newSocket = new WebSocket(socketUrl);
    socketRef.current = newSocket;
    return new Promise((resolve, reject) => {
      newSocket.onopen = () => {
        console.log('socket opened?');
        resolve();
      };
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

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log('awaiting connection to socket');
      await connectSocket();
    }
    else {
      console.log('skipped waiting for connection to socket');
    }

    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        // this shouldn't happen?
        return reject('no socket ref');
      }

      socketRef.current.send(response);

      socketRef.current.onmessage = (event: MessageEvent) => {
        resolve(JSON.parse(event.data));
      };

      socketRef.current.onerror = (error) => {
        reject(error);
        console.log("hit error")
        // socket.close();
      };
    })
  };

  return getEmotions;
}