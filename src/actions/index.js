export const resetData = () => ({
  type: 'RESET_DATA',
});

export const setSpritePosition = (id, x, y) => ({
  type: 'SET_SPRITE_POSITION',
  id,
  x,
  y,
})

export const spawnSprite = (name, level, {x, y}) => ({
  type: 'SPAWN_SPRITE',
  name,
  level,
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

export const destroySprite = (id) => ({
  type: 'DESTROY_SPRITE',
  id,
})

export const setSpriteHealth = (id, health) => ({
  type: 'SET_SPRITE_HEALTH',
  id,
  health,
})

export const setSpritePower = (id, power) => ({
  type: 'SET_SPRITE_POWER',
  id,
  power,
})

export const toggleFog = () => ({
  type: 'TOGGLE_FOG',
})

export const addExperience = (id, experience) => ({
  type: 'ADD_EXPERIENCE',
  id,
  experience,
})