import { connect } from 'react-redux';
import SpriteSet from '../presenters/SpriteSet.jsx';
import Constants from '../core/constants';


const mapStateToProps = (state, ownProps) => {
  let sprites = state.sprites.filter(sprite =>
    sprite.name === Constants.WEAPON
  )

  return {
    sprites: sprites,
  }
}


export default connect(mapStateToProps)(SpriteSet);
