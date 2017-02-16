import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import roguelikeApp from './reducers';
import Game from './containers/Game';
import './index.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  roguelikeApp,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store} >
    <Game />
  </Provider>,
  document.getElementById('root')
);
