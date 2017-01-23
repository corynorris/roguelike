import game from '../core/index.js'

const mapInitialState = game.generateMap(game.constants.width, game.constants.height);
export const map = (state = mapInitialState, action) => {
  switch (action.type) {
    case 'GENERATE_MAP':
      return game.generateMap(game.constants.width, game.constants.height);
    default:
      return state
  }
}