import React from 'react';
import Tile from './Tile'
import './Map.css';

export const Map = ({
  tiles
}) => {
  let rows = [];
  let curRow = [];
  for (let y = 0; y < tiles[0].length; y++) {
    for (let x = 0; x < tiles.length; x++) {
      curRow.push(<Tile 
                key={x} 
                type={tiles[x][y].type}
                texture={tiles[x][y].texture}
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

export default Map
