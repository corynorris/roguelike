import DungeonFactory from 'dungeon-factory';
import { random, between } from './utils';

export function generateMap(width, height) {
  return DungeonFactory.generate({
    height: width,
    width: height,
  });
}

export function checkTile(map, x,y) {
  return map.tiles[x][y].type;
}

export function isTileEmpty(map, x, y) {
  return checkTile(map, x, y) !== 'wall';
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
  return getSpawnFromRoom(map.rooms[map.rooms.length-1]);
}