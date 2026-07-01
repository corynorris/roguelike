interface OverlayProps {
  zIndex: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Overlay = ({ zIndex, style, children }: OverlayProps) => {
  const defaultStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: zIndex,
  };

  const mergedStyle = Object.assign({}, defaultStyle, style);

  return <div style={mergedStyle}>{children}</div>;
};

export default Overlay;
