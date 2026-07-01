import { Tile } from "../types";
import TileComponent from "./Tile";
import "./TileGrid.css";

interface TileGridProps {
  tiles: Tile[][];
}

const TileGrid = ({ tiles }: TileGridProps) => {
  const rows: React.ReactNode[] = [];
  let curRow: React.ReactNode[] = [];
  for (let y = 0; y < tiles[0].length; y++) {
    for (let x = 0; x < tiles.length; x++) {
      curRow.push(<TileComponent key={x} {...tiles[x][y]} />);
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
