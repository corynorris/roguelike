import { random, between } from './utils';
import generateDungeon  from './dungeon'

export function generateMap(width, height) {
  const dungeon = generateDungeon(
    height,
    width,
  );

  // for (let x = 0; x < dungeon.width; x++) {
  //   for (let y = 0; y < dungeon.height; y++) {
  //     console.log(dungeon[x][y])
  //   }
  // }
  
  return dungeon;
}

export function getSpawnFromRoom(room) {
  return {
    x: between(room.x, room.x + room.width),
    y: between(room.y, room.y + room.height),
  }
}

export function getRandomSpawn(map) {
  const roomCount = map.rooms.length;
  return getSpawnFromRoom(map.rooms[random(roomCount)]);
}

export function getSpawnFromFirstRoom(map) {
  return getSpawnFromRoom(map.rooms[0]);
}

export function getSpawnFromLastRoom(map) {
  return getSpawnFromRoom(map.rooms[map.rooms.length - 1]);
}