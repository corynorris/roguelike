import React from 'react';
import TileRow from './TileRow'
import './Map.css';

export const Map = ({
  tiles
}) => (
  <table>
    <tbody>
      { tiles.map( (row,id) => <TileRow key={id} row={row} />) }
    </tbody>
  </table>
)

export default Map
