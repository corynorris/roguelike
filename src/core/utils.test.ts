import { it, expect } from "vitest";
import { rollXDice } from "./utils";

it("rolls a single die within a range of 1-6", () => {
	const rolled: Record<number, boolean> = {};
	for (let i = 0; i < 100; i++) {
		const result = rollXDice(1);
		rolled[result] = true;
		expect(result).toBeLessThanOrEqual(6);
		expect(result).toBeGreaterThanOrEqual(1);
	}

	expect(Object.keys(rolled).length).toEqual(6);
});
