import Constants from '../core/constants'
import { generateMap } from '../core/map'

const mapInitialState = generateMap(Constants.WIDTH, Constants.HEIGHT);
export const map = (state = mapInitialState, action) => {
  switch (action.type) {
    case 'GENERATE_MAP':
      return generateMap(Constants.WIDTH, Constants.HEIGHT);
    default:
      return state
  }
}

export default map