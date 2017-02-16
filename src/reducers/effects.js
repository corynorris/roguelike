const effectsInitialState = {
  fogOn: false,
}

export const effects = (state = effectsInitialState, action) => {
  switch (action.type) {
    case 'RESET_DATA':
      return effectsInitialState;
    case 'TOGGLE_FOG':
      return Object.assign({}, state, {
        fogOn: !state.fogOn
      });
    default:
      return state
  }
}

export default effects