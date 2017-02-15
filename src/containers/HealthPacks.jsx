import { connect } from 'react-redux';
import SpriteSet from '../presenters/SpriteSet.jsx';
import Const from '../core/constants';


const mapStateToProps = (state, ownProps) => {
  let sprites = state.sprites.filter(sprite =>
    sprite.name === Const.HEALTH
  )

  return {
    sprites: sprites,
  }
}


export default connect(mapStateToProps)(SpriteSet);
