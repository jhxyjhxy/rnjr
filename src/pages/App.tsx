import { Game } from '../components/Game';
import '../styles/App.css'


function App() {
  

  return (
    <>
      <div className="container">
        <h1 style={{ marginTop: '3rem'}}>Sheep Game</h1>
        <Game />
      </div>
    </>
  )
}

export default App
