import { Action } from "../actions";
import { SpriteData } from "../types";
import { weightedRange } from "../core/utils";
import Const from "../core/constants";
import { v4 as uuidv4 } from "uuid";

const spriteInitialState: SpriteData | Record<string, never> = {};

export const sprite = (
	state = spriteInitialState as SpriteData,
	action: Action,
): SpriteData => {
	switch (action.type) {
		case "SPAWN_SPRITE": {
			const initialHealth =
				weightedRange(100, 150 + 100 * action.level, action.level) ?? 100;
			const initialPower =
				weightedRange(40, 50 + 20 * action.level, action.level) ?? 40;
			const isEnemy = action.name === Const.ENEMY || action.name === Const.BOSS;
			const moveSpeed = isEnemy
				? action.name === Const.BOSS
					? Const.BOSS_MOVE_SPEED
					: (Const.ENEMY_MOVE_SPEEDS[action.level - 1] ?? 4)
				: 0;
			return {
				id: uuidv4(),
				power: initialPower,
				health: initialHealth,
				maxHealth: initialHealth,
				level: action.level,
				x: action.x,
				y: action.y,
				name: action.name,
				experience: 0,
				moveSpeed,
				cooldown: moveSpeed,
			};
		}
		case "SET_SPRITE_POSITION":
			if (state.id !== action.id) {
				return state;
			}
			return Object.assign({}, state, { x: action.x, y: action.y });
		case "SET_ENEMY_INTENT":
			if (state.id !== action.id) {
				return state;
			}
			return Object.assign({}, state, {
				intentX: action.x,
				intentY: action.y,
			});
		case "CLEAR_ENEMY_INTENT":
			if (state.id !== action.id) {
				return state;
			}
			{
				const {
					intentX: _ix,
					intentY: _iy,
					...rest
				} = state as SpriteData & {
					intentX?: number;
					intentY?: number;
				};
				return rest as SpriteData;
			}
		case "EXECUTE_ENEMY_MOVE":
			if (state.id !== action.id) {
				return state;
			}
			{
				const {
					intentX: _ix,
					intentY: _iy,
					...rest
				} = state as SpriteData & {
					intentX?: number;
					intentY?: number;
				};
				return Object.assign({}, rest, {
					x: action.x,
					y: action.y,
					cooldown: state.moveSpeed,
				}) as SpriteData;
			}
		case "SET_SPRITE_HEALTH":
			if (state.id !== action.id) {
				return state;
			}
			return Object.assign({}, state, { health: action.health });
		case "SET_SPRITE_POWER":
			if (state.id !== action.id) {
				return state;
			}
			return Object.assign({}, state, { power: action.power });
		case "ATTACK_SPRITE":
			if (state.id !== action.id) {
				return state;
			}
			return Object.assign({}, state, {
				health: state.health - action.damage,
			});
		case "ADD_EXPERIENCE":
			if (state.id !== action.id) {
				return state;
			}
			{
				const exp = state.experience;
				const expGain = action.experience;
				let newExp = exp + expGain;
				let { level, power, health } = state;
				const { maxHealth } = state;
				let levelReq = 50 + level * 50;
				console.log("adding exp:", newExp);
				while (newExp > levelReq) {
					level += 1;
					power *= 1.1;
					health = Math.max(maxHealth, health);
					newExp %= levelReq;
					levelReq = 50 + level * 50;
				}
				return Object.assign({}, state, {
					experience: newExp,
					power: Math.round(power),
					health,
					level,
				});
			}
		case "ADVANCE_TURN": {
			const isEnemy = state.name === Const.ENEMY || state.name === Const.BOSS;
			if (!isEnemy || state.health <= 0) return state;
			const newCooldown = state.cooldown > 0 ? state.cooldown - 1 : 0;
			return Object.assign({}, state, { cooldown: newCooldown });
		}
		default:
			return state;
	}
};

const spritesInitialState: SpriteData[] = [];
export const sprites = (
	state = spritesInitialState,
	action: Action,
): SpriteData[] => {
	switch (action.type) {
		case "RESET_DATA":
			return spritesInitialState;
		case "SPAWN_SPRITE":
			return [...state, sprite(undefined as unknown as SpriteData, action)];
		case "DESTROY_SPRITE":
			return [...state.filter((e) => e.id !== action.id)];
		case "ATTACK_SPRITE":
			return state.map((e) => sprite(e, action));
		case "SET_SPRITE_POSITION":
			return state.map((e) => sprite(e, action));
		case "SET_SPRITE_HEALTH":
			return state.map((e) => sprite(e, action));
		case "SET_SPRITE_POWER":
			return state.map((e) => sprite(e, action));
		case "ADD_EXPERIENCE":
			return state.map((e) => sprite(e, action));
		case "ADVANCE_TURN":
			return state.map((e) => sprite(e, action));
		case "SET_ENEMY_INTENT":
			return state.map((e) => sprite(e, action));
		case "CLEAR_ENEMY_INTENT":
			return state.map((e) => sprite(e, action));
		case "EXECUTE_ENEMY_MOVE":
			return state.map((e) => sprite(e, action));
		default:
			return state;
	}
};

export default sprites;
