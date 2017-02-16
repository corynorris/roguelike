import { connect } from 'react-redux';
import Roguelike from '../presenters/Roguelike.jsx';
import Game from '../core';
import Const from '../core/constants';
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
  toggleFog
} from '../actions';

const mapStateToProps = (state, ownProps) => {

  const sprites = new Map();
  const player = state.sprites.filter(sprite => sprite.name === Const.PLAYER)[0];
  state.sprites.forEach(sprite => {
    sprites.set(`${sprite.x}x${sprite.y}`, sprite)
  })


  return {
    tiles: state.map.tiles,
    rooms: state.map.rooms,
    screen: state.screen,
    sprites: sprites,
    player: player,
    game: state.game,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  const spawnSprites = (type, maxLevel, count, spawns) => {
    for (let i = 0; i < count; i++) {
      let level = i % maxLevel + 1;
      dispatch(spawnSprite(
        type, level, spawns.pop()
      ));
    }
  }

  const setupGame = (dispatch, getState) => {
    const { rooms } = getState().map;
    const playerSpawn = Game.getSpawnFromRoom(rooms[0]);
    const spawns = Game.getMultipleSpawns(rooms.slice(1), 100);

    spawnSprites(Const.ENEMY, Const.ENEMY_LEVELS, Const.ENEMY_COUNT, spawns, dispatch);
    spawnSprites(Const.HEALTH, Const.HEALTH_LEVELS, Const.HEALTH_COUNT, spawns, dispatch);
    spawnSprites(Const.WEAPON, Const.WEAPON_LEVELS, Const.WEAPON_COUNT, spawns, dispatch);

    dispatch(spawnSprite(Const.BOSS, Const.BOSS_LEVELS, spawns.pop()));
    dispatch(spawnSprite(Const.PLAYER, 1, playerSpawn));

    return playerSpawn;
  }

  return {
    destroy: (id) => {
      dispatch(destroySprite(id));
    },

    healTo: (id, health) => {
      dispatch(setSpriteHealth(id, health));
    },

    attackSprite: (id, damage) => {
      dispatch(attackSprite(id, damage));
    },

    setPower: (id, power) => {
      dispatch(setSpritePower(id, power));
    },

    setScreen: ({top, left}) => {
      dispatch(setScreenOffset(top, left));
    },

    moveSprite: (id, x, y) => {
      dispatch(setSpritePosition(id, x, y));
    },

    toggleFog: () => {
      dispatch(toggleFog());
    },

    setupGame: () => {
      return dispatch(setupGame)
    },

    defeat: () => {
      dispatch(defeat());
    },

    vicory: () => {
      dispatch(victory());
    },

    resetGame: () => {
      dispatch(resetData());
      return dispatch(setupGame)
    },

    addExperience: (id, experience) => {
      dispatch(addExperience(id, experience));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
