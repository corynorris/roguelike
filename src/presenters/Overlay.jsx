import React from 'react';

const Overlay = ({
  zIndex,
  style,
  children,
}) => {

  const defaultStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: zIndex,
  }

  const mergedStyle = Object.assign({}, defaultStyle, style);

  return (
    <div style={mergedStyle}>{children}</div>
  );
};

export default Overlay;