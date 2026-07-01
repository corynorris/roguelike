import { connect } from "react-redux";
import Roguelike from "../presenters/Roguelike";
import Game from "../core";
import Const from "../core/constants";
import { getEnemyMove } from "../core/enemy-ai";
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
  advanceTurn,
  setEnemyIntent,
  executeEnemyMove,
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

  // Build telegraph map: coordinate key → enemy moveSpeed
  const telegraphs = new Map<string, number>();
  state.sprites.forEach((sprite) => {
    if (sprite.intentX != null && sprite.intentY != null) {
      telegraphs.set(`${sprite.intentX}x${sprite.intentY}`, sprite.moveSpeed);
    }
  });

  return {
    tiles: state.map.tiles,
    rooms: state.map.rooms,
    screen: state.screen,
    sprites: cachedMap as Map<string, SpriteData>,
    player: player,
    telegraphs,
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

    advanceTurn: () => {
      dispatch(
        (dispatch: AppDispatch, getState: () => RootState) => {
          const state = getState();
          const dungeon = state.map;
          const player = state.sprites.find(
            (s) => s.name === Const.PLAYER && s.health > 0,
          );
          if (!player) return;

          // Decrement cooldowns for all enemies
          dispatch(advanceTurn());

          // Get updated state after cooldown decrement
          const updatedState = getState();

          // Build occupied tiles set (all live sprites at their current positions)
          const occupied = new Set<string>();
          updatedState.sprites.forEach((s) => {
            if (s.health > 0) {
              occupied.add(`${s.x}x${s.y}`);
            }
          });

          // Also include telegraphed positions so enemies don't telegraph onto
          // a tile another enemy already claimed
          updatedState.sprites.forEach((s) => {
            if (s.intentX != null && s.intentY != null) {
              occupied.add(`${s.intentX}x${s.intentY}`);
            }
          });

          const enemies = updatedState.sprites.filter(
            (s) =>
              (s.name === Const.ENEMY || s.name === Const.BOSS) &&
              s.health > 0,
          );

          for (const enemy of enemies) {
            const hasIntent =
              enemy.intentX != null && enemy.intentY != null;

            if (enemy.cooldown === 0 && hasIntent) {
              // Execute the telegraphed move
              const targetX = enemy.intentX!;
              const targetY = enemy.intentY!;

              dispatch(executeEnemyMove(enemy.id, targetX, targetY));

              // Check if enemy landed on the player
              if (targetX === player.x && targetY === player.y) {
                // Enemy attacks player
                dispatch(attackSprite(player.id, enemy.power));
                // Player counter-attacks
                dispatch(attackSprite(enemy.id, player.power));
              }

              // Check if enemy landed on an item and destroy it
              const itemOnTile = updatedState.sprites.find(
                (s) =>
                  s.health > 0 &&
                  s.x === targetX &&
                  s.y === targetY &&
                  s.name !== Const.ENEMY &&
                  s.name !== Const.BOSS &&
                  s.name !== Const.PLAYER &&
                  s.id !== enemy.id,
              );
              if (itemOnTile) {
                dispatch(destroySprite(itemOnTile.id));
              }
            } else if (enemy.cooldown === 0 && !hasIntent) {
              // Set intent (telegraph) for next turn
              const target = getEnemyMove(
                enemy,
                player,
                dungeon,
                occupied,
              );

              if (target) {
                dispatch(
                  setEnemyIntent(enemy.id, target.x, target.y),
                );
                // Reserve this tile so other enemies don't target it
                occupied.add(`${target.x}x${target.y}`);
              }
              // If no valid target, enemy stays put (cooldown will stay at 0
              // and it'll try again next turn)
            }
          }
        },
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
