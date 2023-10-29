
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
  }


  export function startSocket(setSocket: Function) {
    console.log("connecitng")
    const apiKey = (window as any).API_KEY;    
    const socketUrl = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;

    const socket = new WebSocket(socketUrl);
    socket.onopen = (ev: Event) => {
      console.log("bacaw");
      console.log(ev);
    };
    socket.onmessage = () => {

    };
    socket.onclose = (ev: CloseEvent) => {
      console.log("why are you doing this");
      console.log(ev);
      startSocket(setSocket)
    };
    socket.onerror = () => {

    };

    // return socket;
    setSocket(socket);
  }

  export async function getEmotions(socket: WebSocket, blob: Blob, streamWindowLengthMs: number) {
    // change blob to b64
    const base64 = await blobToBase64(blob);
    // send to hume
    const response = JSON.stringify({
      data: base64,
      models: {
        prosody: {},
      },
      stream_window_ms: streamWindowLengthMs,
    });

    socket.send(response);
    // get emotions and return json
    const emotionPromise = new Promise((resolve, reject) => {
      socket.onmessage = (event: MessageEvent) => {
        // parse response?
        resolve(JSON.parse(event.data));
      };
      
      socket.onerror = (error) => {
        reject(error);
        console.log("hit error")
        socket.close();
      }
    });
    console.log("got emotions");
    return emotionPromise;
  }

  //return <div></div>;