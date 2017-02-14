import React from 'react';
import './Tile.css';

export const Tile = ({
  type,
  texture,
  orig,
}) =>  {
  return (
    <td className={ `tile tile-${texture} orig-${orig}` } />
  );
}

export default Tile
