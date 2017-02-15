import React from 'react';
import Sprite from './Sprite';

const SpriteSet = ({
  sprites
}) => {

  let spriteComponents = sprites.map((sprite, idx) => (
    <Sprite
      key={idx}
      {...sprite} />
  ));

  return (
    <div>
      {spriteComponents}
    </div>
  );
};

export default SpriteSet;

