import "./Tile.css";

interface TileProps {
	texture: string;
	orig: number;
	telegraphSpeed?: number;
}

function telegraphStyle(speed: number): React.CSSProperties {
	// Lower speed = faster enemy = brighter/more urgent highlight
	const alpha = 0.3 + (5 - speed) * 0.17;
	const r = 255;
	const g = Math.round(220 - speed * 45);
	return {
		"--telegraph-color": `rgba(${r}, ${g}, 0, ${alpha.toFixed(2)})`,
	} as React.CSSProperties;
}

const Tile = ({ texture, orig, telegraphSpeed }: TileProps) => {
	const cls = `tile tile-${texture} ${orig}${telegraphSpeed != null ? " tile-telegraph" : ""}`;
	const style =
		telegraphSpeed != null ? telegraphStyle(telegraphSpeed) : undefined;
	return <td className={cls} style={style} />;
};

export default Tile;
