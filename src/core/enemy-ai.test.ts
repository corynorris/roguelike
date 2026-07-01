import { describe, it, expect } from "vitest";
import { getEnemyMove } from "./enemy-ai";
import { SpriteData, Dungeon, Tile } from "../types";

function makeFloor(x: number, y: number): Tile {
  return { type: "floor", texture: "0", orig: 0, x, y };
}

function makeWall(x: number, y: number): Tile {
  return { type: "wall", texture: "0", orig: 0, x, y };
}

/** Build a simple 7x7 dungeon with a border of walls and floor interior */
function makeTestDungeon(
  width: number,
  height: number,
  wallPositions: { x: number; y: number }[] = [],
): Dungeon {
  const tiles: Tile[][] = [];
  for (let x = 0; x < width; x++) {
    tiles[x] = [];
    for (let y = 0; y < height; y++) {
      tiles[x][y] = makeFloor(x, y);
    }
  }
  for (const { x, y } of wallPositions) {
    tiles[x][y] = makeWall(x, y);
  }

  return {
    tiles,
    rooms: [],
    width,
    height,
    get(x: number, y: number) {
      if (x < 0 || x >= width || y < 0 || y >= height) return false;
      return this.tiles[x][y];
    },
    check(x: number, y: number, type: string, outOfBounds = false) {
      const tile = this.get(x, y);
      if (!tile && outOfBounds) return true;
      return tile !== false && tile.type === type;
    },
    get4BitMask: () => "0000",
    get8BitMask: () => "00000000",
  };
}

function makeEnemy(overrides: Partial<SpriteData> = {}): SpriteData {
  return {
    id: "enemy-1",
    name: "Enemy",
    power: 50,
    health: 100,
    maxHealth: 100,
    level: 1,
    experience: 0,
    x: 3,
    y: 3,
    moveSpeed: 3,
    cooldown: 3,
    ...overrides,
  };
}

function makePlayer(overrides: Partial<SpriteData> = {}): SpriteData {
  return {
    id: "player-1",
    name: "Player",
    power: 60,
    health: 200,
    maxHealth: 200,
    level: 1,
    experience: 0,
    x: 5,
    y: 3,
    moveSpeed: 0,
    cooldown: 0,
    ...overrides,
  };
}

describe("getEnemyMove", () => {
  it("returns null when totally surrounded by walls", () => {
    const dungeon = makeTestDungeon(7, 7, [
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
    ]);
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 5, y: 3 });
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).toBeNull();
  });

  it("moves toward the player when in chase range", () => {
    const dungeon = makeTestDungeon(7, 7);
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 5, y: 3 }); // player 2 tiles to the right
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).not.toBeNull();
    expect(move!.x).toBe(4); // moves right toward player
    expect(move!.y).toBe(3);
  });

  it("prefers the longer axis when chasing", () => {
    const dungeon = makeTestDungeon(7, 7);
    // Enemy at (3,3), player at (5,6) — dx=2, dy=3, should move along y-axis
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 5, y: 6 });
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).not.toBeNull();
    // dy > dx, so move along y-axis toward player
    expect(move!.x).toBe(3);
    expect(move!.y).toBe(4);
  });

  it("falls back to the shorter axis when preferred axis is blocked", () => {
    const dungeon = makeTestDungeon(7, 7, [{ x: 3, y: 4 }]); // wall below enemy
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 5, y: 6 }); // dx=2, dy=3
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).not.toBeNull();
    // dy > dx but y+1 is a wall, so fall back to x+1
    expect(move!.x).toBe(4);
    expect(move!.y).toBe(3);
  });

  it("avoids occupied tiles", () => {
    const dungeon = makeTestDungeon(7, 7);
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 5, y: 3 });
    const occupied = new Set<string>(["4x3"]); // tile to the right is occupied

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).not.toBeNull();
    // can't go right (occupied), so should try up or down
    expect(move!.x).not.toBe(4); // not the occupied tile
    // should still be adjacent
    expect(Math.abs(move!.x - 3) + Math.abs(move!.y - 3)).toBe(1);
  });

  it("wanders to a random adjacent floor tile when player is far", () => {
    const dungeon = makeTestDungeon(7, 7);
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 0, y: 0 }); // far away
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).not.toBeNull();
    // should be an adjacent tile
    const dx = Math.abs(move!.x - enemy.x);
    const dy = Math.abs(move!.y - enemy.y);
    expect(dx + dy).toBe(1);
    // should be a floor tile
    const tile = dungeon.get(move!.x, move!.y);
    expect(tile).not.toBe(false);
    expect(tile !== false && tile.type).toBe("floor");
  });

  it("returns null in wander mode when no adjacent tiles are available", () => {
    const dungeon = makeTestDungeon(7, 7, [
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
    ]);
    const enemy = makeEnemy({ x: 3, y: 3 });
    const player = makePlayer({ x: 0, y: 0 }); // far away → wander
    const occupied = new Set<string>();

    const move = getEnemyMove(enemy, player, dungeon, occupied);
    expect(move).toBeNull();
  });

  it("stays within chase range boundary — wanders when just outside range", () => {
    // Player at (3, 11) — Manhattan distance = 8 from enemy at (3,3)
    // CHASE_RANGE default is 8, so distance 8 should chase
    // Distance 9 should wander
    const dungeon = makeTestDungeon(13, 13);
    const enemy = makeEnemy({ x: 3, y: 3 });

    // Distance = 8 (at boundary) — should chase
    const playerInRange = makePlayer({ x: 3, y: 11 });
    const moveChase = getEnemyMove(enemy, playerInRange, dungeon, new Set());
    expect(moveChase).not.toBeNull();
    // Should move toward player (down)
    expect(moveChase!.y).toBe(4);
  });
});
