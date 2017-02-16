import { connect } from 'react-redux';
import TileGrid from '../presenters/TileGrid.jsx';
import Const from '../core/constants';

const mapStateToProps = (state, ownProps) => {
//   let player = state.sprites.filter(sprite =>
//     (sprite.health > 0) && (sprite.name === Const.PLAYER)
//   )[0]

//   const {width, height, tiles} = state.map;

//   let fogOfWar = new Array(width);

//   for (let x = 0; x < width; x++) {
//     fogOfWar[x] = new Array(height);
//     for (let y = 0; y < height; y++) {
//       const distX = Math.abs(x - player.x)
//       const distY = Math.abs(y - player.y);
//       const totalDist = distX + distY;
//       if (distX > 3 || distY > 3) {
//         fogOfWar[x][y] = { texture: 'fog' }
//       } else {
// const opacity = totalDist < 6 ? 6 / totalDist : 0;
//         fogOfWar[x][y] = tiles[x][y]
//         fogOfWar[x][y].opacity = opacity;
//       }
//     }
//   }
  return {
    tiles: state.map.tiles,
  }
}


export default connect(mapStateToProps)(TileGrid);
