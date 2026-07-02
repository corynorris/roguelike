import { Action } from "../actions";
import { ScreenState } from "../types";

const screenInitialState: ScreenState = {
	top: 0,
	left: 0,
};

export const screen = (
	state = screenInitialState,
	action: Action,
): ScreenState => {
	switch (action.type) {
		case "RESET_DATA":
			return screenInitialState;
		case "SET_SCREEN_OFFSET":
			return Object.assign({}, state, {
				top: action.top,
				left: action.left,
			});
		default:
			return state;
	}
};

export default screen;
