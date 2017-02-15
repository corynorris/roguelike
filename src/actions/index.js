export const generateMap = () => ({
  type: 'GENERATE_MAP',
});

export const spawn = (name, id, level, x, y) => ({
  type: 'SPAWN_SPRITE',
  name,
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

export const setScreenOffset = (top, left) => ({
  type: 'SET_SCREEN_OFFSET',
  top,
  left,
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
