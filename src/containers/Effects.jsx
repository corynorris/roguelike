import React from 'react';
import { connect } from 'react-redux';
import { setBlood } from '../actions';
import Overlay from '../presenters/Overlay.jsx';


const Effects = (props, refs) => {

  if (props.defeat) {
    return (
      <Overlay
        zIndex={3}
        style={{
          backgroundColor: "black",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div style={{
          color: 'white',
          maxWidth: '50%',
          textAlign: 'center',
        }}>
          <h3>DEFEAT</h3>
          <h4>Press 'r' to try again</h4>
        </div>
      </Overlay>
    )
  }

  if (props.victory) {
    return (
      <Overlay
        zIndex={3}
        style={{
          backgroundColor: "black",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div style={{
          color: 'white',
          maxWidth: '50%',
          textAlign: 'center',
        }}>
          <h3>VICTORY</h3>
          <h4>Press 'r' to play again</h4>
        </div>
      </Overlay>
    )
  }

  if (props.blood) {
    setTimeout(
      props.disableBlood.bind(this),
      175
    )
    return (
      <Overlay
        zIndex={3}
        style={{
          backgroundImage: "radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(50,0,0,0.6) 40px, rgba(75,0,0,0.95) 80px, rgba(20,0,0,1) 120px, rgba(0,0,0,1) 100%)"
        }} />
    );

  }

  if (props.fogOn) {
    return (
      <Overlay
        zIndex={3}
        style={{
          transition: 'opacity 3s ease-in-out',
          backgroundImage: "radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0.6) 40px, rgba(0,0,0,0.95) 80px, rgba(0,0,0,1) 120px, rgba(0,0,0,1) 100%)"
        }} />
    );
  }

  return null;
};


const mapStateToProps = (state, ownProps) => {
  return {
    ...state.effects,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    disableBlood: () => {
      dispatch(setBlood(false))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Effects);
