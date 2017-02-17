import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import thunk from 'redux-thunk';
import roguelikeApp from './reducers';
import Game from './containers/Game';
import './index.css';


let store = createStore(
  roguelikeApp,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store} >
    <Game />
  </Provider>,
  document.getElementById('root')
);
