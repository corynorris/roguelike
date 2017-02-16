import React from 'react';

const Overlay = ({
  zIndex,
  backgroundImage,
}) => {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: zIndex,
      backgroundImage: backgroundImage,
    }} />
  );
};

export default Overlay;