import { connect } from "react-redux";
import { RootState } from "../reducers";
import { setBlood } from "../actions";
import Overlay from "../presenters/Overlay";

interface EffectsStateProps {
	fogOn: boolean;
	defeat: boolean;
	victory: boolean;
	blood: boolean;
}

interface EffectsDispatchProps {
	disableBlood: () => void;
}

const Effects = (props: EffectsStateProps & EffectsDispatchProps) => {
	if (props.defeat) {
		return (
			<Overlay
				zIndex={3}
				style={{
					backgroundColor: "black",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						color: "white",
						maxWidth: "50%",
						textAlign: "center",
					}}
				>
					<h3>DEFEAT</h3>
					<h4>Press &apos;r&apos; to try again</h4>
				</div>
			</Overlay>
		);
	}

	if (props.victory) {
		return (
			<Overlay
				zIndex={3}
				style={{
					backgroundColor: "black",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						color: "white",
						maxWidth: "50%",
						textAlign: "center",
					}}
				>
					<h3>VICTORY</h3>
					<h4>Press &apos;r&apos; to play again</h4>
				</div>
			</Overlay>
		);
	}

	if (props.blood) {
		setTimeout(props.disableBlood, 175);
		return (
			<Overlay
				zIndex={3}
				style={{
					backgroundImage:
						"radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(50,0,0,0.6) 40px, rgba(75,0,0,0.95) 80px, rgba(20,0,0,1) 120px, rgba(0,0,0,1) 100%)",
				}}
			/>
		);
	}

	if (props.fogOn) {
		return (
			<Overlay
				zIndex={3}
				style={{
					transition: "opacity 3s ease-in-out",
					backgroundImage:
						"radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0.6) 40px, rgba(0,0,0,0.95) 80px, rgba(0,0,0,1) 120px, rgba(0,0,0,1) 100%)",
				}}
			/>
		);
	}

	return null;
};

const mapStateToProps = (state: RootState) => ({
	...state.effects,
});

const mapDispatchToProps = {
	disableBlood: () => setBlood(false),
};

export default connect(mapStateToProps, mapDispatchToProps)(Effects);
