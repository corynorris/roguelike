import dungeoneer from "dungeoneer";
import { Dungeon } from "../types";

interface RawDungeon {
  tiles: Record<string, unknown>[][];
  rooms: Record<string, unknown>[];
  width: number;
  height: number;
}

export default function generateDungeon(
  width: number,
  height: number,
): Dungeon {
  const raw = dungeoneer.build({ width, height }) as RawDungeon;
  const dungeon = raw as unknown as Dungeon;
  dungeon.width = width;
  dungeon.height = height;

  dungeon.get = function (x: number, y: number) {
    if (x < 0 || x >= width) return false;
    if (y < 0 || y >= height) return false;
    return this.tiles[x][y];
  };

  dungeon.check = function (
    x: number,
    y: number,
    type: string,
    outOfBounds = false,
  ) {
    if (!this.get(x, y) && outOfBounds) return true;
    return this.get(x, y) !== false && this.get(x, y).type === type;
  };

  dungeon.get4BitMask = function (
    x: number,
    y: number,
    type: string,
    outOfBounds = false,
  ) {
    const N = this.check(x, y - 1, type, outOfBounds);
    const E = this.check(x + 1, y, type, outOfBounds);
    const S = this.check(x, y + 1, type, outOfBounds);
    const W = this.check(x - 1, y, type, outOfBounds);
    return `${+N}${+E}${+S}${+W}`;
  };

  dungeon.get8BitMask = function (
    x: number,
    y: number,
    type: string,
    outOfBounds = false,
  ) {
    const NW = this.check(x - 1, y - 1, type, outOfBounds);
    const N = this.check(x, y - 1, type, outOfBounds);
    const NE = this.check(x + 1, y - 1, type, outOfBounds);
    const E = this.check(x + 1, y, type, outOfBounds);
    const SE = this.check(x + 1, y + 1, type, outOfBounds);
    const S = this.check(x, y + 1, type, outOfBounds);
    const SW = this.check(x - 1, y + 1, type, outOfBounds);
    const W = this.check(x - 1, y, type, outOfBounds);
    return `${+NW}${+N}${+NE}${+E}${+SE}${+S}${+SW}${+W}`;
  };

  return dungeon;
}
