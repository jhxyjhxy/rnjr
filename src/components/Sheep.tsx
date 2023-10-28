import '../styles/Sheep.css';

interface SheepProps {
  asset: string;
}

export const Sheep = (props: SheepProps) => {
  const SHEEP_DIMS = ['4rem', '4rem'];

  const {asset} = props;
  return <>
    <img
    src={asset}
    className="sheep"
    style={{
      width: SHEEP_DIMS[0],
      height: SHEEP_DIMS[1],
      position: 'absolute',
    }}/>
  </>
};