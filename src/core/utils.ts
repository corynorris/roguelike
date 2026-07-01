export const range = (size: number, val: unknown): unknown[] => {
  return Array(size).fill(val);
};

export function random(val: number): number {
  return Math.floor(Math.random() * val);
}

export function between(min: number, max: number): number {
  return random(max - min) + min;
}

export function eql(a: unknown, b: unknown): boolean {
  if (typeof a === "undefined" && typeof b === "undefined") {
    return true;
  }
  if (typeof a === "undefined" || typeof b === "undefined") {
    return false;
  }
  return a === b;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function rollXDice(x: number): number {
  let sum = 0;
  for (let i = 0; i < x; i++) {
    sum += Math.round(randomRange(1, 6));
  }
  return sum;
}

export function weightedRange(
  min: number,
  max: number,
  weight: number,
): number | undefined {
  if (weight < 1) return;
  let sum: number;
  do {
    sum = rollXDice(weight);
    sum -= 3.5 * weight;
  } while (sum < 0);
  const rand = sum / 6;
  return Math.floor(rand * (max - min) + min);
}
