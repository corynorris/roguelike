import { connect } from 'react-redux';
import Sprite from '../presenters/Sprite.jsx';
import Constants from '../core/constants';


const mapStateToProps = (state, ownProps) => {
  let sprites = state.sprites.filter(sprite =>
    (sprite.health > 0) && (sprite.name === Constants.PLAYER)
  )

  return {
    ...sprites[0],
  }
}


export default connect(mapStateToProps)(Sprite);
