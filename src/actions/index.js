import Constants from '../core/constants';

export const generateMap = () => ({
  type: 'GENERATE_MAP',
});

export const spawnPlayer = (id, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.PLAYER,
  level: 1,
  id,
  x,
  y,
})

export const spawnEnemy = (id,level, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.ENEMY,
  level,
  id,
  x,
  y,
})

export const spawnBoss = (id, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.BOSS,
  level: 10,
  id,
  x,
  y,
})

export const spawnWeapon = (id, level, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.WEAPON,
  level,
  id,
  x,
  y,
})

export const spawnHealth = (id, level, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.HEALTH,
  level,
  id,
  x,
  y,
})


export const setPlayerPosition = (x, y) => ({
  type: 'SET_PLAYER_POSITION',
  x,
  y,
})

export const gameOver = () => ({
  type: 'GAME_OVER',
})

export const setPlayerHealth = (health) => ({
  type: 'SET_PLAYER_HEALTH',
  health,
})

export const setEnemyHealth = (id, health) => ({
  type: 'SET_ENEMY_HEALTH',
  id,
  health,
})
