import React from 'react';
import './Tile.css';

export const Tile = ({
  texture,
  orig,
}) =>  {
  return (
    <td className={ `tile tile-${texture} ${orig}` } />
  );
}

export default Tile
