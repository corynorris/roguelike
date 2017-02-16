const effectsInitialState = {
  smallAlerts: [],
  eventAlerts: [],
}

export const effects = (state = effectsInitialState, action) => {
  switch (action.type) {
    case 'RESET_DATA':
      return effectsInitialState;
    case 'ADD_EXPERIENCE':
      return Object.assign(
        {}, state,
        { smallAlerts: [...state.smallAlerts, `EXP +${action.experience}`] }
      );
    default:
      return state
  }
}

export default effects