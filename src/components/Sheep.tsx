import SheepWhite from '../assets/sheep_white.svg';
import SheepBlue from '../assets/sheep_blue.svg';
import SheepRed from '../assets/sheep_red.svg';
import '../styles/Sheep.css';

export interface SheepProps {
  type: string;
  progress: number; // percentage
  y: number; // how far down the screen is the sheep
  word: string;
}

export const Sheep = (props: SheepProps) => {
  const SHEEP_DIMS = ['4rem', '4rem'];
  const GAME_WIDTH = 960; // todo: sync css and this width?

  const {type, progress, y, word} = props;
  const asset = type === 'angry' ? SheepRed : type === 'sad' ? SheepBlue : SheepWhite;


  // function progress -> x
  const x = (1 - progress) * GAME_WIDTH;

  return <>
    <div className="sheep-container" style={{
      position: 'absolute',
      left: x,
      top: y,
    }}>
      <div>
        {word}
      </div>
    <img
    src={asset}
    className="sheep"
    style={{
      width: SHEEP_DIMS[0],
      height: SHEEP_DIMS[1],
    }}/>
    </div>
  </>
};