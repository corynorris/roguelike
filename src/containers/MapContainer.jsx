import React, {Component} from 'react';
import {connect} from 'react-redux';
import Map from '../presenters/Map.jsx';

class MapContainer extends Component {
  render() {
    return (
      <Map tiles={this.props.tiles} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state.map.tiles);
  return {
    tiles: state.map.tiles
  }
}

export default connect(mapStateToProps)(MapContainer);
