import React, { Component } from 'react';
import Map from '../containers/Map';
import Enemies from '../containers/Enemies';
import Player from '../containers/Player';
import HealthPacks from '../containers/HealthPacks';
import Weapons from '../containers/Weapons';
import Boss from '../containers/Boss';

class Roguelike extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  getRandomSpawn() {
    
  }

  componentWillMount() {
    this.props.spawnPlayer(
      0, this.props.rooms[0]
    );

    this.props.spawnBoss(
      0, this.props.rooms.slice(1)
    );

    for (let i = 0; i < 25; i++) {
      this.props.spawnEnemy(
        i, i%9+1, this.props.rooms.slice(1)
      );
    }
    
    for (let i = 0; i < 10; i++) {
      this.props.spawnHealth(
        i, i%6+1, this.props.rooms.slice(1)
      )
    }

    for (let i = 0; i < 3; i++) {
      this.props.spawnWeapon(
        i, i+1, this.props.rooms.slice(1)
      )
    }



  }

  handleKeyPress(e) {
    if (e.key.indexOf('Arrow') >= 0) { e.preventDefault(); }
    this.props.movePlayer(
      e.key,
      this.props.player,
      this.props.tiles,
      this.props.enemies,
    )
    // e.preventDefault();
  }

  render() {
    return (
      <div
        tabIndex="0"
        onKeyDown={this.handleKeyPress}
        style={{
          position: 'relative'
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