import { Action } from "../actions";
import { TurnState } from "../types";

const turnsInitialState: TurnState = { count: 0 };

export const turns = (state = turnsInitialState, action: Action): TurnState => {
	switch (action.type) {
		case "ADVANCE_TURN":
			return { count: state.count + 1 };
		case "RESET_DATA":
			return turnsInitialState;
		default:
			return state;
	}
};

export default turns;
