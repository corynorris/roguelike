import { connect } from "react-redux";
import { RootState } from "../reducers";
import TileGrid from "../presenters/TileGrid";
import { Tile } from "../types";

const mapStateToProps = (state: RootState) => {
	// Build telegraph map from sprite intents
	const telegraphs = new Map<string, number>();
	state.sprites.forEach((sprite) => {
		if (sprite.intentX != null && sprite.intentY != null) {
			telegraphs.set(`${sprite.intentX}x${sprite.intentY}`, sprite.moveSpeed);
		}
	});

	return {
		tiles: state.map.tiles,
		telegraphs,
	};
};

export default connect(mapStateToProps)(
	TileGrid as unknown as React.ComponentType<{
		tiles: Tile[][];
		telegraphs: Map<string, number>;
	}>,
);
