import React from 'react';
import Const from '../core/constants'
import './Sprite.css';

const Sprite = ({
  name,
  level,
  health,
  maxHealth,
  x,
  y
}) => {
  const width = Const.UNIT_WIDTH;
  const height = Const.UNIT_HEIGHT;
  const style = {
    position: 'absolute',
    left: x * width,
    top: y * height,
    width: width,
    height: height,
    opacity: (health/maxHealth),
  }

  return (
    <div
      className={`sprite ${name}-${level}`}
      style={style}>
    </div>
  );
};

export default Sprite;