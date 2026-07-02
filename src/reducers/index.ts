import { combineReducers } from "redux";
import map from "./map";
import screen from "./screen";
import effects from "./effects";
import sprites from "./sprites";
import turns from "./turns";

const roguelikeApp = combineReducers({
	sprites,
	map,
	screen,
	effects,
	turns,
});

export type RootState = ReturnType<typeof roguelikeApp>;
export default roguelikeApp;
