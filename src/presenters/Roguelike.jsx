import React, { Component } from 'react';
import Map from '../containers/Map';
import Effects from '../containers/Effects';
import Enemies from '../containers/Enemies';
import Player from '../containers/Player';
import HealthPacks from '../containers/HealthPacks';
import Weapons from '../containers/Weapons';
import StatsBar from '../containers/StatsBar';
import Boss from '../containers/Boss';
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

  resetGame() {
    let {x, y} = this.props.resetGame();
    this.centerOn(x, y);
  }



  componentDidMount() {
    window.onresize = this.centerOnPlayer.bind(this);
  }

  battleEnemy(enemy) {
    const { player } = this.props;

    const playerHealth = player.health - enemy.power;
    const enemyHealth = enemy.health - player.power;

    if (enemyHealth <= 0) {
      if (enemy.name === Const.BOSS) {
        this.props.victory();
      } else {
        this.props.destroy(enemy.id)
        this.props.addExperience(player.id, (enemy.maxHealth + enemy.power) / 2)
      }
      return;
    }

    if (playerHealth <= 0) {
      return this.props.defeat();
    }

    this.props.attackSprite(
      player.id,
      enemy.power
    )

    this.props.attackSprite(
      enemy.id,
      player.power
    )
  }

  // todo add different effects for different potions
  // ideas: line of site, power, experience
  usePotion(sprite) {
    const { player } = this.props;
    this.props.destroy(
      sprite.id
    )
    this.props.healTo(
      player.id,
      player.health + sprite.health
    )
  }

  upgradeWeapon(sprite) {
    const {player } = this.props;
    this.props.setPower(
      player.id,
      player.power + sprite.power
    )
    this.props.destroy(
      sprite.id
    )
  }

  handleSprites(coord) {
    const { sprites } = this.props;
    if (sprites.has(coord)) {
      const sprite = sprites.get(coord);
      switch (sprite.name) {
        case Const.ENEMY:
        case Const.BOSS:
          this.battleEnemy(sprite);
          break;
        case Const.HEALTH:
          this.usePotion(sprite);
          break;
        case Const.WEAPON:
          this.upgradeWeapon(sprite)
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
    const key = e.which;
    if (key >= 37 && key <= 40) { e.preventDefault(); }
    let {x, y} = this.props.player;
    switch (key) {
      case 82:
        this.resetGame();
        break;
      case 87:
      case 38:
        y -= 1;
        break;
      case 83:
      case 40:
        y += 1;
        break;
      case 65:
      case 37:
        x -= 1;
        break;
      case 68:
      case 39:
        x += 1;
        break;
      case 'h':
        this.props.toggleFog();
        break;
      default:
        return;
    }
    this.movePlayer(x, y);
  }
  
  componentWillMount() {
    const {x, y} = this.props.setupGame(this.props.rooms);
    this.centerOn(x, y);
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  render() {
    return (
      <div>
        <StatsBar />
        <Effects />
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