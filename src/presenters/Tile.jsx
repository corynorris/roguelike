import React from 'react';
import './Tile.css';

export const Tile = ({
  texture,
  opacity,
}) =>  {
  return (
    <td className={ `tile tile-${texture}` } />
  );
}

export default Tile
