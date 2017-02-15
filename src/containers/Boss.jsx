import { connect } from 'react-redux';
import SpriteSet from '../presenters/SpriteSet.jsx';
import Const from '../core/constants';


const mapStateToProps = (state, ownProps) => {
  let sprites = state.sprites.filter(sprite =>
    (sprite.health > 0) && (sprite.name === Const.BOSS)
  )

  return {
    sprites: sprites,
  }
}


export default connect(mapStateToProps)(SpriteSet);
