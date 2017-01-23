import React from 'react';
import Tile from './Tile';

const TileRow = ({
  row
 }) => {
  return (
    <tr>
      { row.map((tile,id) => <Tile key={id} type={tile.type} />) }
    </tr>
  )
};

export default TileRow;


