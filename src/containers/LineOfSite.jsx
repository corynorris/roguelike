import React from 'react';
import { connect } from 'react-redux';
import Overlay from '../presenters/Overlay.jsx';

const LineOfSite = (props) => {
  return (
    props.fogOn ?
      <Overlay
        backgroundImage="radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0.6) 40px, rgba(0,0,0,0.95) 80px, rgba(0,0,0,1) 120px, rgba(0,0,0,1) 100%)"
        zIndex={3} />
      : null
  );
};


const mapStateToProps = (state, ownProps) => {
  return {
    fogOn: state.effects.fogOn,
  }
}


export default connect(mapStateToProps)(LineOfSite);
