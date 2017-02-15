import { connect } from 'react-redux';
import Roguelike from '../presenters/Roguelike.jsx';
import { spawnPlayer, spawnBoss, spawnEnemy, spawnWeapon, spawnHealth, setPlayerPosition, generateMap, setPlayerHealth, setEnemyHealth, gameOver } from '../actions';
import Game from '../core';


const mapStateToProps = (state, ownProps) => {
  return {
    rooms: state.map.rooms,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    spawnPlayer: (id, room) => {
      const { x, y } = Game.getSpawnFromRoom(room);
      dispatch(spawnPlayer(id, x, y));
    },

    spawnBoss: (id, rooms) => {
      const { x, y } = Game.getRandomSpawn(rooms);
      dispatch(spawnBoss(id, x, y));
    },
    spawnEnemy: (id, level, rooms) => {
      const { x, y } = Game.getRandomSpawn(rooms);
      dispatch(spawnEnemy(id, level, x, y));
    },
    spawnWeapon: (id, level, rooms) => {
      const { x, y } = Game.getRandomSpawn(rooms);
      dispatch(spawnWeapon(id, level, x, y));
    },
    spawnHealth: (id, level, rooms) => {
      const { x, y } = Game.getRandomSpawn(rooms);
      dispatch(spawnHealth(id, level, x, y));
    },
    movePlayer: (key, player, tiles, enemies) => {
      let {x, y} = player;
      switch (key) {
        case 'w':
        case 'ArrowUp':
          y -= 1;
          break;
        case 's':
        case 'ArrowDown':
          y += 1;
          break
        case 'a':
        case 'ArrowLeft':
          x -= 1;
          break
        case 'd':
        case 'ArrowRight':
          x += 1;
          break
        default:
          return;
      }
      // Check if tile is walkable
      if (tiles[x][y].type !== 'wall') {
        // Check if tile has enemies
        const enemiesOnTile = enemies.filter(enemy =>
          enemy.x === x && enemy.y === y && enemy.health > 0
        )

        if (enemiesOnTile.length > 0) {
          for (let i = 0; i < enemiesOnTile.length; i++) {
            // calculate player health
            const enemy = enemiesOnTile[i];
            enemy.health -= player.power;
            player.health -= enemy.power;

            if (player.health > 0) {
              console.log('set enemy health')
              dispatch(setEnemyHealth(enemy.id, enemy.health));
              dispatch(setPlayerHealth(player.health));
            } else {
              dispatch(gameOver());
            }
          }
          // calculate enemy health
        } else {
          dispatch(setPlayerPosition(x, y));
        }
      }
    },

    generateMap: () => {
      dispatch(generateMap());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roguelike);
