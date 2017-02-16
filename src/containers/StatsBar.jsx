import { connect } from 'react-redux';
import NavBar from '../presenters/NavBar.jsx';
import Const from '../core/constants';

const mapStateToProps = (state, ownProps) => {
  let player = state.sprites.filter(sprite =>
    (sprite.health > 0) && (sprite.name === Const.PLAYER)
  )[0];
  return {
    ...player
  }
}


export default connect(mapStateToProps)(NavBar);
