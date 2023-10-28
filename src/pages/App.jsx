import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import SheepWhite from '../assets/sheep_white.svg'
import SheepBlue from '../assets/sheep_blue.svg'
import SheepRed from '../assets/sheep_red.svg'
import '../styles/App.css'

function App() {
  const [count, setCount] = useState(0);
  const [a, setA] = useState(0);
  
  useEffect(() => {
    setInterval(() => {
      setA(prev => prev - 1);
    }, 100);
  }, []);

  return (
    <>
      <div>
        <img src={SheepWhite} style={{transform: `rotate(${a}deg)`}} />
        <img src={SheepBlue} style={{transform: `rotate(${a}deg)`}} />
        <img src={SheepRed} style={{transform: `rotate(${a}deg)`}} />
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
