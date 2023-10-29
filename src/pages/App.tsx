import { Game } from '../components/Game';
import '../styles/App.css'


function App() {
  

  return (
    <>
      <div className="container">
        
        <img src = '/src/assets/header.svg' alt = "title" style={{ marginBottom: '20px' , marginTop: '20px'}}></img>
        
        <Game />
      </div>
    </>
  )
}

export default App
