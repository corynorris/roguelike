import { SpriteData, Dungeon } from "../types";
import Const from "./constants";

/**
 * Calculate the Manhattan distance between two points.
 */
function manhattan(x1: number, y1: number, x2: number, y2: number): number {
	return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Shuffle an array in place (Fisher-Yates) and return it.
 */
function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Determine the enemy's next move.
 *
 * In wander mode (player outside chase range): picks a random adjacent floor tile.
 * In chase mode (player within chase range): moves along the axis with the
 * largest distance toward the player, falling back to the other axis if blocked.
 *
 * Returns the target coordinates, or null if the enemy is stuck.
 */
export function getEnemyMove(
	enemy: SpriteData,
	player: SpriteData,
	dungeon: Dungeon,
	occupiedTiles: Set<string>,
): { x: number; y: number } | null {
	const isBoss = enemy.name === Const.BOSS;
	const chaseRange = isBoss ? Const.BOSS_CHASE_RANGE : Const.ENEMY_CHASE_RANGE;
	const dist = manhattan(enemy.x, enemy.y, player.x, player.y);
	const chasing = dist <= chaseRange;

	// Gather all four adjacent positions
	const candidates: { x: number; y: number }[] = [
		{ x: enemy.x, y: enemy.y - 1 }, // up
		{ x: enemy.x + 1, y: enemy.y }, // right
		{ x: enemy.x, y: enemy.y + 1 }, // down
		{ x: enemy.x - 1, y: enemy.y }, // left
	];

	// Filter to valid tiles: floor, not occupied, not a wall
	const valid = candidates.filter(({ x, y }) => {
		const key = `${x}x${y}`;
		if (occupiedTiles.has(key)) return false;
		const tile = dungeon.get(x, y);
		return tile !== false && tile.type !== "wall";
	});

	if (valid.length === 0) {
		return null; // completely stuck
	}

	if (!chasing) {
		// Wander: pick a random valid adjacent tile
		return shuffle(valid)[0];
	}

	// Chase: prefer the axis with the largest distance to the player
	const dx = player.x - enemy.x;
	const dy = player.y - enemy.y;

	// Determine primary axis (larger absolute distance)
	const primaryDir =
		Math.abs(dy) >= Math.abs(dx)
			? { x: enemy.x, y: enemy.y + Math.sign(dy) }
			: { x: enemy.x + Math.sign(dx), y: enemy.y };

	const secondaryDir =
		Math.abs(dy) >= Math.abs(dx)
			? { x: enemy.x + Math.sign(dx), y: enemy.y }
			: { x: enemy.x, y: enemy.y + Math.sign(dy) };

	// Try primary direction first
	const primaryKey = `${primaryDir.x}x${primaryDir.y}`;
	const primaryValid = valid.find(
		(v) => v.x === primaryDir.x && v.y === primaryDir.y,
	);
	if (primaryValid && !occupiedTiles.has(primaryKey)) return primaryValid;

	// Fall back to secondary direction
	const secondaryKey = `${secondaryDir.x}x${secondaryDir.y}`;
	const secondaryValid = valid.find(
		(v) => v.x === secondaryDir.x && v.y === secondaryDir.y,
	);
	if (secondaryValid && !occupiedTiles.has(secondaryKey)) return secondaryValid;

	// If neither preferred direction works, pick any valid tile
	return shuffle(valid)[0];
}
