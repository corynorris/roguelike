export interface Tile {
  type: "wall" | "floor" | "door";
  texture: string;
  orig: number;
  x: number;
  y: number;
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dungeon {
  tiles: Tile[][];
  rooms: Room[];
  width: number;
  height: number;
  get: (x: number, y: number) => Tile | false;
  check: (x: number, y: number, type: string, outOfBounds?: boolean) => boolean;
  get4BitMask: (
    x: number,
    y: number,
    type: string,
    outOfBounds?: boolean,
  ) => string;
  get8BitMask: (
    x: number,
    y: number,
    type: string,
    outOfBounds?: boolean,
  ) => string;
}

export interface SpriteData {
  id: string;
  power: number;
  health: number;
  maxHealth: number;
  level: number;
  x: number;
  y: number;
  name: string;
  experience: number;
}

export interface MapState {
  tiles: Tile[][];
  rooms: Room[];
  width: number;
  height: number;
}

export interface ScreenState {
  top: number;
  left: number;
}

export interface EffectsState {
  fogOn: boolean;
  defeat: boolean;
  victory: boolean;
  blood: boolean;
}

export interface RoguelikeState {
  sprites: SpriteData[];
  map: MapState;
  screen: ScreenState;
  effects: EffectsState;
}

export type Direction = "left" | "right" | "up" | "down";

export interface Coord {
  x: number;
  y: number;
}
