import { generateMap, getRandomSpawn, getSpawnFromRoom, getSpawnFromLastRoom, isTileEmpty } from './map';

it('creates a map', () => {
  const map = generateMap(21, 21);
  expect(map).toBeDefined();
  expect(map.rooms).toBeDefined();
  expect(map.tiles).toBeDefined();
});

it('generates a random spawn', () => {
  const map = generateMap(21, 21);
  const {x,y} = getRandomSpawn(map);
  expect(isTileEmpty(map, x,y)).toBe(true);
})


it('generates a spawn from a specific room', () => {
  const map = generateMap(21, 21);
  const {x,y} = getSpawnFromRoom(map.rooms[0]);
  expect(isTileEmpty(map, x,y)).toBe(true);
})

it('generates a spawn from the last room', () => {
  const map = generateMap(21, 21);
  const {x,y} = getSpawnFromLastRoom(map);
  expect(isTileEmpty(map, x,y)).toBe(true);
})