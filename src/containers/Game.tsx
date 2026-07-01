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
        async (dispatch: AppDispatch, getState: () => RootState) => {
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

          const enemies = updatedState.sprites.filter(
            (s) =>
              (s.name === Const.ENEMY || s.name === Const.BOSS) &&
              s.health > 0,
          );

          // First pass: decide moves for all enemies whose cooldown reached 0
          interface EnemyPlan {
            enemyId: string;
            enemyPower: number;
            targetX: number;
            targetY: number;
            attackPlayer: boolean; // true if adjacent to player (attack, don't move)
          }
          const plans: EnemyPlan[] = [];

          for (const enemy of enemies) {
            if (enemy.cooldown !== 0) continue;

            // Check if enemy is adjacent to player → attack, don't move
            const distToPlayer =
              Math.abs(enemy.x - player.x) +
              Math.abs(enemy.y - player.y);

            if (distToPlayer === 1) {
              // Attack the player from current position
              plans.push({
                enemyId: enemy.id,
                enemyPower: enemy.power,
                targetX: enemy.x,
                targetY: enemy.y,
                attackPlayer: true,
              });
              continue;
            }

            // Get AI move target
            const target = getEnemyMove(
              enemy,
              player,
              dungeon,
              occupied,
            );

            if (target) {
              // Reserve this tile
              occupied.add(`${target.x}x${target.y}`);
              plans.push({
                enemyId: enemy.id,
                enemyPower: enemy.power,
                targetX: target.x,
                targetY: target.y,
                attackPlayer: false,
              });
            }
            // If no target, enemy stays put; cooldown stays at 0 until
            // a valid tile becomes available
          }

          if (plans.length === 0) return;

          // Handle attacks (no telegraph needed — direct damage)
          const attackPlans = plans.filter((p) => p.attackPlayer);
          const movePlans = plans.filter((p) => !p.attackPlayer);

          for (const plan of attackPlans) {
            dispatch(attackSprite(player.id, plan.enemyPower));
          }

          // Check if the player died from enemy attacks
          const postAttackState = getState();
          const playerAfterAttacks = postAttackState.sprites.find(
            (s) => s.name === Const.PLAYER && s.health > 0,
          );
          if (!playerAfterAttacks) {
            dispatch(defeat());
            return;
          }

          if (movePlans.length === 0) return;

          // Telegraph all moves at once
          for (const plan of movePlans) {
            dispatch(
              setEnemyIntent(plan.enemyId, plan.targetX, plan.targetY),
            );
          }

          // Brief delay so the telegraph is visible before the move
          await new Promise((r) => setTimeout(r, 80));

          // Execute all moves
          for (const plan of movePlans) {
            dispatch(
              executeEnemyMove(
                plan.enemyId,
                plan.targetX,
                plan.targetY,
              ),
            );

            // Check if enemy landed on an item and destroy it
            const currentState = getState();
            const itemOnTile = currentState.sprites.find(
              (s) =>
                s.health > 0 &&
                s.x === plan.targetX &&
                s.y === plan.targetY &&
                s.name !== Const.ENEMY &&
                s.name !== Const.BOSS &&
                s.name !== Const.PLAYER &&
                s.id !== plan.enemyId,
            );
            if (itemOnTile) {
              dispatch(destroySprite(itemOnTile.id));
            }
          }
        },
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
