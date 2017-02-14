import { combineReducers } from 'redux'
import map from './map.js';
import sprites from './sprites.js';

const roguelikeApp = combineReducers({
  sprites,
  map
});

export default roguelikeApp;