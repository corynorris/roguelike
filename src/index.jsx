import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import thunk from 'redux-thunk';
import Game from './containers/Game';
import './index.css';
import roguelikeApp from './reducers';


let store = createStore(
  roguelikeApp,
  composeWithDevTools(applyMiddleware(thunk))
);

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store} >
    <Game />
  </Provider>
);

