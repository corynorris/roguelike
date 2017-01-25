import React from 'react';
import './Tile.css';

export const Tile = ({
  type,
  texture,
}) =>  {
  return (
    <td className={ 'tile ' + texture } />
  );
}

export default Tile
