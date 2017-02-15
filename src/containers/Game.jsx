import { connect } from 'react-redux';
import Roguelike from '../presenters/Roguelike.jsx';
import { spawn, setScreenOffset, generateMap } from '../actions';


const mapStateToProps = (state, ownProps) => {
  return {
    tiles: state.map.tiles,
    rooms: state.map.rooms,
    sprites: state.sprites,
    screen: state.screen,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    spawn: (name, id, level, {x, y}) => {
      dispatch(spawn(name, id, level, x, y));
    },

    setScreen: ({top, left}) => {
      dispatch(setScreenOffset(top, left));
    },

    generateMap: () => {
      dispatch(generateMap());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
