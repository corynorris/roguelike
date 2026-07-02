import { Action } from "../actions";
import { MapState, Dungeon } from "../types";
import Const from "../core/constants";
import { generateMap } from "../core/map";

const mapInitialState: Dungeon = generateMap(Const.WIDTH, Const.HEIGHT);

export const map = (state = mapInitialState, action: Action): MapState => {
	switch (action.type) {
		case "RESET_DATA":
			return generateMap(Const.WIDTH, Const.HEIGHT);
		default:
			return state;
	}
};

export default map;
