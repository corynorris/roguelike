export const generateMap = () => ({
  type: 'GENERATE_MAP',
});

export const spawnPlayer = () => ({
  type: 'SPAWN_PLAYER',
})

export const spawnEnemy = () => ({
  type: 'SPAWN_ENEMY',
})

export const attack = () => ({
  type: 'ATTACK',
})

export const move = (direction) => ({
  type: 'MOVE',
  direction,
})
