import { random, between } from './utils';
import generateDungeon from './dungeon'

// Mark tiles empty if none of their neighbours
// have a floor or a door;
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

export function isWalkable(type) {
  return type === 'floor' || type === 'door';
}

function join(cur, overlap) {
  if (cur === 'double-edge' &&
    overlap === 'top-edge') {
    return 'cap'
  }

  if (cur === 'left-edge'
    && overlap === 'top-edge') {
    return 'top-left-corner'
  }

  if (cur === 'right-edge'
    && overlap === 'top-edge') {
    return 'top-right-corner'
  }

  return overlap;
}


export function generateMap(width, height) {

  const dungeon = generateDungeon(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const tile = dungeon.tiles[x][y];
      if (isEmpty(tile)) {
        tile.type = 'empty';
        tile.texture = 'empty';
      } else {
        tile.texture = tile.type;
      }
    }
  }

  // Edge Detection
  // Horizontal Edges
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      const tile = dungeon.get(x, y);
      const last = dungeon.getType(x - 1, y);
      const cur = dungeon.getType(x, y);
      const next = dungeon.getType(x + 1, y);

      if (cur === 'wall'
        && isWalkable(next)) {
        tile.texture = 'right-edge';
      }

      if (isWalkable(last)
        && cur === 'wall') {
        tile.texture = 'left-edge';
      }

      if (isWalkable(last)
        && !isWalkable(cur)
        && isWalkable(next)) {
        tile.texture = 'double-edge';
      }
    }
  }

  // Vertical Edges
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const tile = dungeon.get(x, y);
      const last = dungeon.getType(x, y - 1);
      const cur = dungeon.getType(x, y);
      const next = dungeon.getType(x, y + 1);

      if (cur === 'wall'
        && isWalkable(next)) {
        tile.texture = join(tile.texture, 'bottom-edge')
      }

      if (isWalkable(last)
        && cur === 'wall') {
        tile.texture = join(tile.texture, 'top-edge')
      }
    }
  }

  //corners
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const tile = dungeon.get(x, y);
      const up = dungeon.getTexture(x, y - 1);
      const right = dungeon.getTexture(x + 1, y);
      const down = dungeon.getTexture(x, y + 1);
      const left = dungeon.getTexture(x - 1, y);

      if (tile.texture === 'wall') {
        if (right.includes('edge')
          && down.includes('edge')) {
          tile.texture = 'right-top-edge'
        } else if (left === 'empty') {
          tile.texture = 'right-bottom-edge'
        }

        if (left.includes('edge')
          && down.includes('edge')) {
          tile.texture = 'left-top-edge'
        } else if (right === 'empty') {
          tile.texture = 'left-bottom-edge'
        }

        if ((up === 'double-edge' || up === 'cap')
          && right === 'top-edge'
          && left === 'top-edge') {
          tile.texture = 'top-edge';
        }
      }
      // else if (tile.texture.includes('corner')
      //   && down === 'double-edge') {
      //   tile.texture = 'cap';
      // }
      // else if (tile.texture === 'right-edge') {
      //   if (left === 'top-edge'
      //     && up === 'double-edge') {
      //     if (down === 'double-edge') {
      //       tile.texture = 'cap';
      //     } else {
      //       tile.texture = 'top-right-corner';
      //     }
      //   } else if (left === 'top-edge'
      //     && down === 'double-edge') {
      //     tile.texture = 'double-edge'
      //   }
      // }
      // else if (tile.texture === 'left-edge') {
      //   if (right === 'top-edge'
      //     && top === 'double-edge') {
      //     if (down === 'double-edge') {
      //       tile.texture = 'cap';
      //     } else {
      //       tile.texture = 'top-right-corner';
      //     }
      //   } else if (right === 'top-edge'
      //     && down === 'double-edge') {
      //     tile.texture = 'double-edge'
      //   }
      // }
    }
  }

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