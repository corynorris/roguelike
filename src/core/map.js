import DungeonFactory from 'dungeon-factory';
import { random, between } from './utils';


// Mark tiles empty if none of their neighbours
// have a floor or a door;
function isNotEmpty(tile) { return !isEmpty(tile) }
function isEmpty(tile) {
  if (tile.type === "empty") return true;
  let isEmpty = true;
  tile.neighbours.forEach((neighbour) => {
    isEmpty = isEmpty &&
      (neighbour.type !== 'floor' &&
        neighbour.type !== 'door');
  })
  return isEmpty;
}

function isNotWall(tile) { return !isWall(tile); }
function isWall(tile) {
  return !isEmpty(tile) && tile.type === 'wall';
}

function isEdge(tile) {
  if (tile.neighbours.length < 8) return true;
  return tile.neighbours.filter(tile => {
    return isEmpty(tile);
  }).length > 0;
}

function check(tile, check) {
  const north = tile.nesw.north || { type: 'empty' };
  const east = tile.nesw.east || { type: 'empty' };
  const south = tile.nesw.south || { type: 'empty' };
  const west = tile.nesw.west || { type: 'empty' };

  return check[0](north) && check[1](east) && check[2](south) && check[3](west);
}

function isLeftEdge(tile) {
  if (!isWall(tile)) return false;
  
  return check(tile, [isWall, isEmpty, isWall, isNotEmpty]) 
       || check(tile, [isWall, isEmpty, isWall, isWall]) 
    || check(tile,[isEmpty, isEmpty, isWall, isWall])

}

function isRightEdge(tile) {
  if (!isWall(tile)) return false;

  return check(tile, [isWall, isNotEmpty, isWall, isEmpty])
   || check(tile, [isWall, isWall, isWall, isEmpty]) 
   || check(tile, [isEmpty, isWall, isWall, isEmpty]);
}

function isDoubleWall(tile) {
  if (isEdge(tile)) return false;
  if (!isWall(tile)) return false;
  return (check(tile, [isWall, isNotWall, isWall, isNotWall]));
}

function isBottomWall(tile) {
  if (isEdge(tile)) return false;
  if (!isWall(tile)) return false;
  return (check(tile, [isWall, isNotWall, isNotWall, isNotWall]));
}


function isTopWall(tile) {
  if (isEdge(tile)) return false;
  if (!isWall(tile)) return false;
  return (check(tile, [isNotWall, isNotWall, isWall, isNotWall]));
}

function getTexture(tile) {
  if (tile.type === "floor") {
    return "floor";
  }

  if (tile.type === "door") {
    return "floor";
  }

  if (isEmpty(tile)) return 'empty';

  if (isDoubleWall(tile)) return "double"

  if (tile.nesw.south && (
    isDoubleWall(tile.nesw.south) ||
    isBottomWall(tile.nesw.south) ||
    isTopWall(tile))) {
    return "cap"
  }


  if (isRightEdge(tile)) return "right-edge";
  if (isLeftEdge(tile)) return "left-edge";

  
  if (check(tile, [isWall, isWall, isEmpty, isEmpty])) {
    return "right-bottom-edge"
  }

  if (check(tile, [isWall, isEmpty, isEmpty, isWall])) {
    return "left-bottom-edge"
  }

  if (check(tile, [isNotWall, isNotWall, isWall, isWall])) return "bottom-right-corner";
  if (check(tile, [isNotWall, isWall, isWall,isNotWall])) return "bottom-left-corner";

  if (tile.nesw.south && isRightEdge(tile.nesw.south)) {
        return "bottom-right-corner";
  }
  if (tile.nesw.south && isLeftEdge(tile.nesw.south)) {
    return "bottom-left-corner";
  }


  if (check(tile, [isWall, isEmpty, isWall, isWall])) return "right-bottom-edge";
  if (check(tile, [isWall, isWall, isWall, isEmpty])) return "left-bottom-edge";
 
  if (check(tile, [isWall, isNotWall, isWall, isWall])) return "right-edge";
  if (check(tile, [isWall, isWall, isWall, isNotWall])) return "left-edge";
 
  // if (check(tile, [isWall, isNotWall, isWall, isWall])) return "right-edge";
  // if (check(tile, [isWall, isWall, isWall, isNotWall])) return "left-edge";
 
 
  // check for corners
  return "horizontal";
}

export function generateMap(width, height) {
  const dungeon = DungeonFactory.generate({
    height,
    width,
  });

  // dungeon.tiles = transpose(dungeon.tiles);

  // add wall types
  dungeon.tiles = dungeon.tiles.map(tileRow => {
    return tileRow.map(tile => {
      tile.texture = getTexture(tile);
      return tile;
    });
  });

  return dungeon;

}

export function checkTile(map, x, y) {
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
  return getSpawnFromRoom(map.rooms[map.rooms.length - 1]);
}