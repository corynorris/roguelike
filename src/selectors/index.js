import { createSelector } from 'reselect';

const playerSelector = state => state.player;

export const getGridPosition = createSelector(
  playerSelector,
  ({ x, y, width, height }) => ({
    pixelX: Math.floor(x * width),
    pixelY: Math.floor(y * height),
  })
);