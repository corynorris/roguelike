import { connect } from "react-redux";
import { RootState } from "../reducers";
import TileGrid from "../presenters/TileGrid";
import { Tile } from "../types";

const mapStateToProps = (state: RootState) => {
  return {
    tiles: state.map.tiles,
  };
};

export default connect(mapStateToProps)(
  TileGrid as unknown as React.ComponentType<{ tiles: Tile[][] }>,
);
