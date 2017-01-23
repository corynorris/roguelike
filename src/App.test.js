import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux'; 
import roguelikeGame from './reducers'; 

it('renders without crashing', () => {
  let store = createStore(roguelikeGame,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  const div = document.createElement('div');
  ReactDOM.render(  
  <Provider store={store} >
    <App />
  </Provider>, div);
});