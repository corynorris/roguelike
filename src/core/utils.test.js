import { rollXDice } from './utils';

it('rolls a single die within a range of 1-6', () => {
  let rolled = {}
  for (var i = 0; i < 100; i++) {
    let result = rollXDice(1);
    rolled[result]= true;
    expect(result).toBeLessThanOrEqual(6);
    expect(result).toBeGreaterThanOrEqual(1);
  }
  console.log(rolled);
  expect(Object.keys(rolled).length).toEqual(6);
})

