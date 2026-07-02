import { describe, it, expect } from "vitest";
import { effects } from "./effects";
import { setBlood, attackSprite, toggleFog, defeat, victory } from "../actions";

describe("effects reducer", () => {
	const initialState = {
		fogOn: true,
		defeat: false,
		victory: false,
		blood: false,
	};

	it("toggles fog", () => {
		const state = effects(initialState, toggleFog());
		expect(state.fogOn).toBe(false);
		const state2 = effects(state, toggleFog());
		expect(state2.fogOn).toBe(true);
	});

	it("sets blood on attack", () => {
		const state = effects(initialState, attackSprite("player1", 5));
		expect(state.blood).toBe(true);
	});

	it("clears blood via setBlood action", () => {
		const state = effects({ ...initialState, blood: true }, setBlood(false));
		expect(state.blood).toBe(false);
	});

	it("sets defeat", () => {
		const state = effects(initialState, defeat());
		expect(state.defeat).toBe(true);
	});

	it("sets victory", () => {
		const state = effects(initialState, victory());
		expect(state.victory).toBe(true);
	});
});
