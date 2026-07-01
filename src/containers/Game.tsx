import { connect } from "react-redux";
import Roguelike from "../presenters/Roguelike";
import Game from "../core";
import Const from "../core/constants";
import { RootState } from "../reducers";
import { SpriteData, Coord } from "../types";
import {
  defeat,
  victory,
  spawnSprite,
  destroySprite,
  attackSprite,
  setSpritePosition,
  setSpriteHealth,
  setSpritePower,
  addExperience,
  setScreenOffset,
  resetData,
  toggleFog,
} from "../actions";
import type { ThunkDispatch } from "redux-thunk";
import type { Action } from "../actions";

export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

let prevSprites: SpriteData[] | null = null;
let cachedMap: Map<string, SpriteData> | null = null;

const mapStateToProps = (state: RootState) => {
  if (prevSprites !== state.sprites) {
    const sprites = new Map<string, SpriteData>();
    state.sprites.forEach((sprite) => {
      sprites.set(`${sprite.x}x${sprite.y}`, sprite);
    });
    cachedMap = sprites;
    prevSprites = state.sprites;
  }

  const player = state.sprites.filter(
    (sprite) => sprite.name === Const.PLAYER,
  )[0];

  return {
    tiles: state.map.tiles,
    rooms: state.map.rooms,
    screen: state.screen,
    sprites: cachedMap,
    player: player,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  const spawnSprites = (
    type: string,
    maxLevel: number,
    count: number,
    spawns: Coord[],
  ) => {
    for (let i = 0; i < count; i++) {
      const level = (i % maxLevel) + 1;
      dispatch(spawnSprite(type, level, spawns.pop()!));
    }
  };

  const setupGame = (dispatch: AppDispatch, getState: () => RootState) => {
    const { rooms } = getState().map;
    const playerSpawn = Game.getSpawnFromRoom(rooms[0]);
    const spawns = Game.getMultipleSpawns(rooms.slice(1), 100);

    spawnSprites(Const.ENEMY, Const.ENEMY_LEVELS, Const.ENEMY_COUNT, spawns);
    spawnSprites(Const.HEALTH, Const.HEALTH_LEVELS, Const.HEALTH_COUNT, spawns);
    spawnSprites(Const.WEAPON, Const.WEAPON_LEVELS, Const.WEAPON_COUNT, spawns);

    dispatch(spawnSprite(Const.BOSS, Const.BOSS_LEVELS, spawns.pop()!));
    dispatch(spawnSprite(Const.PLAYER, 1, playerSpawn));

    return playerSpawn;
  };

  return {
    destroy: (id: string) => {
      dispatch(destroySprite(id));
    },

    healTo: (id: string, health: number) => {
      dispatch(setSpriteHealth(id, health));
    },

    attackSprite: (id: string, damage: number) => {
      dispatch(attackSprite(id, damage));
    },

    setPower: (id: string, power: number) => {
      dispatch(setSpritePower(id, power));
    },

    setScreen: ({ top, left }: { top: number; left: number }) => {
      dispatch(setScreenOffset(top, left));
    },

    moveSprite: (id: string, x: number, y: number) => {
      dispatch(setSpritePosition(id, x, y));
    },

    toggleFog: () => {
      dispatch(toggleFog());
    },

    setupGame: () => {
      return dispatch(setupGame);
    },

    defeat: () => {
      dispatch(defeat());
    },

    victory: () => {
      dispatch(victory());
    },

    resetGame: () => {
      dispatch(resetData());
      return dispatch(setupGame);
    },

    addExperience: (id: string, experience: number) => {
      dispatch(addExperience(id, experience));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
