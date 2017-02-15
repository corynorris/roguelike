import React from 'react';
import Tile from './Tile'
import './TileGrid.css';

export const TileGrid = ({
  tiles
}) => {
  let rows = [];
  let curRow = [];
  for (let y = 0; y < tiles[0].length; y++) {
    for (let x = 0; x < tiles.length; x++) {
      curRow.push(<Tile 
                key={x} 
                {...tiles[x][y]}
      />);  
    }
    rows.push(<tr key={y}>{curRow}</tr>);
    curRow = [];
  }
  return (
    <table>
      <tbody>
        { rows }
      </tbody>
    </table>
  )
}

export default TileGrid
