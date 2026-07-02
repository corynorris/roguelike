import { connect } from "react-redux";
import { RootState } from "../reducers";
import SpriteSet from "../presenters/SpriteSet";
import Const from "../core/constants";

const mapStateToProps = (state: RootState) => {
	const sprites = state.sprites.filter(
		(sprite) => sprite.name === Const.WEAPON,
	);

	return {
		sprites,
	};
};

export default connect(mapStateToProps)(SpriteSet);
