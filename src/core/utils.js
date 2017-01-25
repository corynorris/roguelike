export const range = (size, val) => {
  return Array(size).fill(val);
}

export function random(val) {
  return Math.floor(Math.random() * val);
}


export function between(min, max) {
  return random(max - min) + min;
}

export function eql(a, b) {
  if (typeof a === 'undefined' &&
    typeof b === 'undefined') {
    return true;
  }
  if (typeof a === 'undefined' ||
      typeof b === 'undefined') {
    return false;
  }
  return a === b;
}