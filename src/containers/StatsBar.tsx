import { connect } from "react-redux";
import { RootState } from "../reducers";
import NavBar from "../presenters/NavBar";
import Const from "../core/constants";

const mapStateToProps = (state: RootState) => {
  const player = state.sprites.filter(
    (sprite) => sprite.health > 0 && sprite.name === Const.PLAYER,
  )[0];
  return {
    ...player,
  };
};

export default connect(mapStateToProps)(NavBar);
