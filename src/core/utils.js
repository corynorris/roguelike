export const range = (size, val) => {
  return Array(size).fill(val);
}

export function random(val) {
  return Math.floor(Math.random() * val);
} 


export function between(min, max) {
  return random(max-min) + min;
} 