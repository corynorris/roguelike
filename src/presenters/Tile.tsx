import "./Tile.css";

interface TileProps {
  texture: string;
  orig: number;
}

const Tile = ({ texture, orig }: TileProps) => {
  return <td className={`tile tile-${texture} ${orig}`} />;
};

export default Tile;
