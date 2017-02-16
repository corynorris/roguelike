
const screenInitialState = {
  top: 0,
  left: 0,
  fog: true,
}

export const screen = (state = screenInitialState, action) => {
  switch (action.type) {
    case 'SET_SCREEN_OFFSET':
      return Object.assign(
        {}, state, {
          top: action.top,
          left: action.left
        }
      )
    default:
      return state
  }
}

export default screen