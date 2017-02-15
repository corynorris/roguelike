import React, { Component } from 'react';
import Map from '../containers/Map';
import Enemies from '../containers/Enemies';
import Player from '../containers/Player';
import HealthPacks from '../containers/HealthPacks';
import Weapons from '../containers/Weapons';
import Boss from '../containers/Boss';
import Game from '../core';
import Const from '../core/constants';

class Roguelike extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  centerOnPlayer(playerX, playerY) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      windowX = w.innerWidth || e.clientWidth || g.clientWidth,
      windowY = w.innerHeight || e.clientHeight || g.clientHeight;

    return {
      left: (windowX / 2 - playerX),
      top: (windowY / 2 - playerY),
    }
  }

  spawn(type, maxLevel, count, spriteSpawns) {
    for (let id = 0; id < count; id++) {
      let level = id % maxLevel + 1;
      this.props.spawn(
        type, id, level, spriteSpawns.pop()
      );
    }
  }

  setupGame() {
    const rooms = this.props.rooms;
    const playerSpawn = Game.getSpawnFromRoom(rooms[0]);
    const spriteSpawns = Game.getMultipleSpawns(rooms.slice(1), 50);

    this.spawn(Const.ENEMY, Const.ENEMY_LEVELS, Const.ENEMY_COUNT, spriteSpawns)
    this.spawn(Const.HEALTH, Const.HEALTH_LEVELS, Const.HEALTH_COUNT, spriteSpawns)
    this.spawn(Const.WEAPON, Const.WEAPON_LEVELS, Const.WEAPON_COUNT, spriteSpawns)

    this.props.spawn(Const.BOSS, Const.BOSS_LEVELS, Const.BOSS_COUNT, spriteSpawns.pop())
    this.props.spawn(Const.PLAYER, Const.PLAYER_LEVELS, Const.PLAYER_COUNT, playerSpawn)

    const center = this.centerOnPlayer(
      playerSpawn.x * Const.UNIT_WIDTH,
      playerSpawn.y * Const.UNIT_HEIGHT
    );

    this.props.setScreen(center);

  }

  componentWillMount() {
    this.setupGame();
  }



  handleKeyPress(e) {
    if (e.key.indexOf('Arrow') >= 0) { e.preventDefault(); }

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
  }

  render() {


    return (
      <div
        tabIndex="0"
        onKeyDown={this.handleKeyPress}
        style={{
          left: `${this.props.screen.left}px`,
          top: `${this.props.screen.top}px`,
          position: 'fixed'
        }}>
        <Map />
        <Player />
        <HealthPacks />
        <Weapons />
        <Boss />
        <Enemies />
      </div>
    );
  }
}

export default Roguelike;