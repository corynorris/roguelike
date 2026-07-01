import { SpriteData } from "../types";
import Sprite from "./Sprite";

interface SpriteSetProps {
  sprites: SpriteData[];
}

const SpriteSet = ({ sprites }: SpriteSetProps) => {
  const spriteComponents = sprites.map((sprite, idx) => (
    <Sprite key={idx} {...sprite} />
  ));

  return <div>{spriteComponents}</div>;
};

export default SpriteSet;
