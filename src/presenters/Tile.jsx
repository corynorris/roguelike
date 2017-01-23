import React from 'react';
import './Tile.css';

export const Tile = ({
  type
}) => (
  <td className={"tile " + type}></td>
)

export default Tile
