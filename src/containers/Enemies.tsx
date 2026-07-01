import { connect } from "react-redux";
import { RootState } from "../reducers";
import SpriteSet from "../presenters/SpriteSet";
import Const from "../core/constants";

const mapStateToProps = (state: RootState) => {
  const sprites = state.sprites.filter(
    (sprite) => sprite.health > 0 && sprite.name === Const.ENEMY,
  );

  return {
    sprites,
  };
};

export default connect(mapStateToProps)(SpriteSet);
