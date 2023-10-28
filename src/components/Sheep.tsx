import '../styles/Sheep.css';

export interface SheepProps {
  asset: string;
  progress: number; // percentage
  y: number; // how far down the screen is the sheep
}

export const Sheep = (props: SheepProps) => {
  const SHEEP_DIMS = ['4rem', '4rem'];
  const GAME_WIDTH = 960; // todo: sync css and this width?

  const {asset, progress, y} = props;

  // function progress -> x
  const x = (1 - progress) * GAME_WIDTH;

  return <>
    <img
    src={asset}
    className="sheep"
    style={{
      width: SHEEP_DIMS[0],
      height: SHEEP_DIMS[1],
      left: x,
      top: y,
      position: 'absolute',
    }}/>
  </>
};