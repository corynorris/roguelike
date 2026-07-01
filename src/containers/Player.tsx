import { connect } from "react-redux";
import { RootState } from "../reducers";
import Sprite from "../presenters/Sprite";
import Const from "../core/constants";

const mapStateToProps = (state: RootState) => {
  const sprites = state.sprites.filter(
    (sprite) => sprite.health > 0 && sprite.name === Const.PLAYER,
  );

  return {
    ...sprites[0],
  };
};

export default connect(mapStateToProps)(Sprite);
