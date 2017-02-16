import { connect } from 'react-redux';
import TileGrid from '../presenters/TileGrid.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    tiles: state.map.tiles,
  }
}


export default connect(mapStateToProps)(TileGrid);
