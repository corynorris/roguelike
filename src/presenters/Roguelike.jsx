import React, { Component } from 'react';
import Map from '../containers/Map';
import Enemies from '../containers/Enemies';
import Player from '../containers/Player';
import HealthPacks from '../containers/HealthPacks';
import Weapons from '../containers/Weapons';
import StatsBar from '../containers/StatsBar';
import Boss from '../containers/Boss';
import Game from '../core';
import Const from '../core/constants';

class Roguelike extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  centerOn(x, y) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      windowX = w.innerWidth || e.clientWidth || g.clientWidth,
      windowY = w.innerHeight || e.clientHeight || g.clientHeight;

    this.props.setScreen({
      left: (windowX / 2 - x * Const.UNIT_WIDTH),
      top: (windowY / 2 - y * Const.UNIT_HEIGHT),
    })
  }

  centerOnPlayer() {
    const {x, y} = this.props.player;
    this.centerOn(
      x,
      y
    );
  }

  spawn(type, maxLevel, count, spawns) {
    for (let i = 0; i < count; i++) {
      let level = i % maxLevel + 1;
      this.props.spawn(
        type, level, spawns.pop()
      );
    }
  }

  setupGame() {
    const rooms = this.props.rooms;
    const playerSpawn = Game.getSpawnFromRoom(rooms[0]);
    const spawns = Game.getMultipleSpawns(rooms.slice(1), 50);

    this.spawn(Const.ENEMY, Const.ENEMY_LEVELS, Const.ENEMY_COUNT, spawns)
    this.spawn(Const.HEALTH, Const.HEALTH_LEVELS, Const.HEALTH_COUNT, spawns)
    this.spawn(Const.WEAPON, Const.WEAPON_LEVELS, Const.WEAPON_COUNT, spawns)

    this.props.spawn(Const.BOSS, Const.BOSS_LEVELS, spawns.pop())
    this.props.spawn(Const.PLAYER, 1, playerSpawn)

    this.centerOn(
      playerSpawn.x,
      playerSpawn.y
    );
  }

  componentWillMount() {
    this.setupGame();
  }

  componentDidMount() {
    window.onresize = this.centerOnPlayer.bind(this);
  }

  handleSprites(coord) {
    const { sprites, player } = this.props;
    if (sprites.has(coord)) {
      const sprite = sprites.get(coord);
      switch (sprite.name) {
        case Const.ENEMY:
          break;
        case Const.HEALTH:
          this.props.setHealth(
            player.id,
            player.health + sprite.health
          )
          this.props.destroy(
            sprite.id
          )
          break;
        case Const.WEAPON:
          this.props.setPower(
            player.id,
            player.power + sprite.power
          )
          this.props.destroy(
            sprite.id
          )
          break;
        default:
          return;
      }
    }
  }

  movePlayer(x, y) {
    const coord = `${x}x${y}`;
    const { tiles, sprites, player } = this.props;

    if (sprites.has(coord)) {
      return this.handleSprites(coord)
    }

    if (tiles[x][y].type !== 'wall') {
      this.centerOn(x, y);
      return this.props.moveSprite(player.id, x, y);
    }
  }


  handleKeyPress(e) {
    if (e.key.indexOf('Arrow') >= 0) { e.preventDefault(); }
    let {x, y} = this.props.player;
    switch (e.key) {
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
    this.movePlayer(x, y);
  }

  render() {
    return (
      <div
        tabIndex="0"
        onKeyDown={this.handleKeyPress}>
        <StatsBar />
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          backgroundImage: 'radial-gradient(circle farthest-corner at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0.6) 40px, rgba(0,0,0,1) 80px, rgba(0,0,0,1) 100%)'
        }} />
        <div
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
      </div>
    );
  }
}

export default Roguelike;