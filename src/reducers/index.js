import { combineReducers } from 'redux'
import map from './map.js';
import screen from './screen.js';
import effects from './effects.js';
import sprites from './sprites.js';

const roguelikeApp = combineReducers({
  sprites,
  map,
  screen,
  effects,
});

export default roguelikeApp;