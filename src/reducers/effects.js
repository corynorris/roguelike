const effectsInitialState = {
  fogOn: true,
  defeat: false,
  victory: false,
  blood: false,
}

export const effects = (state = effectsInitialState, action) => {
  switch (action.type) {
    case 'RESET_DATA':
      return effectsInitialState;
    case 'TOGGLE_FOG':
      return Object.assign({}, state, {
        fogOn: !state.fogOn
      });
    case 'ATTACK_SPRITE':
      return Object.assign({}, state, {
        blood: true
      });    
    case 'SET_BLOOD':
      return Object.assign({}, state, {
        blood: state.value
      });
    case 'DEFEAT':
      return Object.assign({}, state, {
        defeat: true,
      });
    case 'VICTORY':
      return Object.assign({}, state, {
        victory: true,
      });
    default:
      return state
  }
}

export default effects