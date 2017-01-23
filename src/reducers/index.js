import { combineReducers } from 'redux'
import { map } from './map.js';

const roguelikeApp = combineReducers({
  map
});

export default roguelikeApp;