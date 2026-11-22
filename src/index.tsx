import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";

import { thunk } from "redux-thunk";
import Game from "./containers/Game";
import "./index.css";
import roguelikeApp from "./reducers";

const composeEnhancers =
	(import.meta.env.DEV &&
		(window as unknown as { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose })
			.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;

const store = createStore(
	roguelikeApp,
	composeEnhancers(applyMiddleware(thunk)),
);

const root = createRoot(document.getElementById("root")!);
root.render(
	<Provider store={store}>
		<Game />
	</Provider>,
);
