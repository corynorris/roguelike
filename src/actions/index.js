import Constants from '../core/constants';

export const generateMap = () => ({
  type: 'GENERATE_MAP',
});

export const spawnPlayer = (id, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.PLAYER,
  id,
  x,
  y,
})

export const spawnEnemy = (id, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.ENEMY,
  id,
  x,
  y,
})

export const spawnBoss = (id, x, y) => ({
  type: 'SPAWN_SPRITE',
  name: Constants.BOSS,
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
