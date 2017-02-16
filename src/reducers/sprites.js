import { weightedRange } from '../core/utils'
import uuid from 'uuid';

const spriteInitialState = {};

export const sprite = (state = spriteInitialState, action) => {
  switch (action.type) {
    case 'SPAWN_SPRITE':
      const health = weightedRange(100, 150 + (100 * action.level), action.level);
      const power = weightedRange(40, 50 + (20 * action.level), action.level);
      return {
        id: uuid.v4(),
        power: power,
        health: health,
        maxHealth: health,
        level: action.level,
        x: action.x,
        y: action.y,
        name: action.name,
      }
    case 'SET_SPRITE_POSITION':
      if (state.id !== action.id) {
        return state
      }
      return Object.assign(
        {},
        state,
        { x: action.x, y: action.y }
      );
    case 'SET_SPRITE_HEALTH':
      if (state.id !== action.id) {
        return state
      }
      return Object.assign(
        {},
        state,
        { health: action.health }
      );
    case 'SET_SPRITE_POWER':
      if (state.id !== action.id) {
        return state
      }
      return Object.assign(
        {},
        state,
        { power: action.power }
      );
    default:
      return state
  }
}


const spritesInitialState = [];
export const sprites = (state = spritesInitialState, action) => {
  switch (action.type) {
    case 'SPAWN_SPRITE':
      return [
        ...state,
        sprite(undefined, action)
      ];
    case 'DESTROY_SPRITE':
      return [
        ...state.filter(e => 
            e.id !== action.id 
          ) 
      ];
    case 'SET_SPRITE_POSITION':
      return state.map(e =>
        sprite(e, action)
      );
    case 'SET_SPRITE_HEALTH':
      return state.map(e =>
        sprite(e, action)
      );
    case 'SET_SPRITE_POWER':
      return state.map(e =>
        sprite(e, action)
      );

    default:
      return state
  }
}

export default sprites