import { connect } from 'react-redux';
import Roguelike from '../presenters/Roguelike.jsx';
import { spawnSprite, destroySprite, setSpritePosition, setSpriteHealth, setSpritePower, setScreenOffset, generateMap } from '../actions';
import Const from '../core/constants';

const mapStateToProps = (state, ownProps) => {

  const sprites = new Map();
  const player = state.sprites.filter(sprite => sprite.name === Const.PLAYER)[0];
  state.sprites.forEach(sprite => {
    sprites.set(`${sprite.x}x${sprite.y}`, sprite)
  })


  return {
    tiles: state.map.tiles,
    rooms: state.map.rooms,
    screen: state.screen,
    sprites: sprites,
    player: player,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    spawn: (name, level, {x, y}) => {
      dispatch(spawnSprite(name, level, x, y));
    },

    destroy: (id) => {
      dispatch(destroySprite(id));
    },

    setHealth: (id, health) => {
      dispatch(setSpriteHealth(id, health));
    },

    setPower: (id, power) => {
      dispatch(setSpritePower(id, power));
    },

    setScreen: ({top, left}) => {
      dispatch(setScreenOffset(top, left));
    },

    moveSprite: (id, x, y) => {
      dispatch(setSpritePosition(id, x, y));
    },

    generateMap: () => {
      dispatch(generateMap());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
