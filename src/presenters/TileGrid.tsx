import { Tile } from "../types";
import TileComponent from "./Tile";
import "./TileGrid.css";

interface TileGridProps {
  tiles: Tile[][];
  telegraphs?: Map<string, number>;
}

const TileGrid = ({ tiles, telegraphs }: TileGridProps) => {
  const rows: React.ReactNode[] = [];
  let curRow: React.ReactNode[] = [];
  for (let y = 0; y < tiles[0].length; y++) {
    for (let x = 0; x < tiles.length; x++) {
      const tile = tiles[x][y];
      const telegraphSpeed = telegraphs?.get(`${tile.x}x${tile.y}`);
      curRow.push(
        <TileComponent
          key={x}
          {...tile}
          telegraphSpeed={telegraphSpeed}
        />,
      );
    }
    rows.push(<tr key={y}>{curRow}</tr>);
    curRow = [];
  }
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TileGrid;
