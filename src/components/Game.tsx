import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import { Sheep } from '../components/Sheep';
import '../styles/Game.css';

export const Game = () => {
  const sheeps = [
    { asset: SheepWhite },
    { asset: SheepBlue },
    { asset: SheepRed }
  ]

  return (
  <div className="game-screen">
    {sheeps.map((sheep, i) => {
      return <Sheep key={i} asset={sheep.asset} />
    })}
  </div>
  )
}