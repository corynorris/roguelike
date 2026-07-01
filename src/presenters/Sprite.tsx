import Const from "../core/constants";
import "./Sprite.css";

interface SpriteProps {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  x: number;
  y: number;
}

const Sprite = ({ name, level, health, maxHealth, x, y }: SpriteProps) => {
  const width = Const.UNIT_WIDTH;
  const height = Const.UNIT_HEIGHT;
  const style: React.CSSProperties = {
    position: "absolute",
    left: x * width,
    top: y * height,
    width: width,
    height: height,
    opacity: 0.3 + health / maxHealth,
  };

  return <div className={`sprite ${name}-${level}`} style={style}></div>;
};

export default Sprite;
