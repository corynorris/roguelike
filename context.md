# Codebase Context: Roguelike Dungeon Crawler

## 1. What the Application Does

A browser-based roguelike dungeon crawler. The player moves through a procedurally generated dungeon (77x37 tiles) collecting health packs and weapons, battling enemies, and ultimately defeating a boss. Features a fog-of-war (line-of-sight) overlay, WASD/arrow key + touch-swipe controls, level-up experience system, and defeat/victory states.

## 2. Tech Stack and Key Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| **react** / **react-dom** | ^18.2.0 | UI framework |
| **redux** / **react-redux** / **redux-thunk** | 4.2.1 / 8.1.2 / 2.4.2 | State management |
| **vite** | ^4.4.9 | Build tool (migrated from CRA) |
| **@vitejs/plugin-react-swc** | ^3.3.2 | SWC-based React Fast Refresh |
| **dungeoneer** | ^2.1.5 | First dungeon generator (used for bitmask wall tiles) |
| **custom dungeon generator** | (inlined) | Second dungeon generator (Bob Nystrom's rooms-and-mazes algorithm) |
| **victor** | ^1.1.0 | 2D vector math (used by dungeon generator) |
| **underscore** | ^1.13.6 | General utilities (used by dungeon generator) |
| **uuid** | ^9.0.1 | Sprite ID generation |
| **gh-pages** | ^6.0.0 | Deploy to GitHub Pages |
| **node-sass** | ^9.0.0 | Listed but **never used** (all CSS is plain `.css`) |
| **vite-plugin-svgr** | ^3.2.0 | Listed but **never used** |
| **redux-devtools-extension** | ^2.13.8 | Legacy Redux DevTools integration |

### Missing Dependency
- **reselect** — imported in `src/selectors/index.js` but **not listed** in `package.json`.

## 3. File Structure Overview

```
/
├── index.html              # Entry HTML (Vite style: <script type="module" src="/src/index.jsx">)
├── vite.config.js           # Vite config; base path = '/roguelike/'
├── package.json             # Scripts: start (vite), build (vite build), serve (vite preview)
├── Procfile                 # Stale CRA/Heroku artifact (references bin/boot)
├── .buildpacks              # Stale CRA/Heroku artifact
├── .eslintcache             # Stale CRA artifact
├── .gitignore               # References 'build' not 'dist' (Vite output)
├── .github/workflows/
│   └── gh-pages.yml         # GitHub Actions deploy to Pages (path: ./dist)
├── public/
│   └── favicon.ico
└── src/
    ├── index.jsx             # App entry: creates Redux store, renders <Game/>
    ├── index.css             # Global styles
    ├── logo.svg              # Unused (CRA artifact)
    ├── actions/
    │   └── index.js          # 15 Redux action creators (string-typed)
    ├── reducers/
    │   ├── index.js          # combineReducers: sprites, map, screen, effects
    │   ├── map.js            # Map state (generateMap on init + RESET_DATA)
    │   ├── sprites.js        # Sprite CRUD + combat + level-up logic (2-level reducer: individual + array)
    │   ├── screen.js         # Screen offset state
    │   └── effects.js        # UI effects: fog, blood, defeat, victory
    ├── containers/            # Redux-connected containers
    │   ├── Game.jsx           # Main orchestrator: game logic, dispatch mapping, setupGame thunk
    │   ├── Player.jsx         # Player sprite
    │   ├── Enemies.jsx        # Enemy sprites
    │   ├── Boss.jsx           # Boss sprite
    │   ├── HealthPacks.jsx    # Health pack sprites
    │   ├── Weapons.jsx        # Weapon sprites
    │   ├── Map.jsx            # Tile grid
    │   ├── StatsBar.jsx       # HUD (level, HP, attack)
    │   └── Effects.jsx        # Overlays: fog, blood, defeat, victory
    ├── presenters/            # Presentational components
    │   ├── Roguelike.jsx      # Main game component: input handling, game mechanics
    │   ├── Sprite.jsx         # Single sprite (CSS background-position)
    │   ├── SpriteSet.jsx      # Array of sprites
    │   ├── Tile.jsx           # Single tile
    │   ├── TileGrid.jsx       # Tile grid (HTML table)
    │   ├── NavBar.jsx         # Stats display
    │   ├── Overlay.jsx        # Generic overlay with z-index
    │   ├── Sprite.css         # Sprite classes (spritesheet.png background positions)
    │   ├── Tile.css           # Tile classes (wallset.gif background positions)
    │   ├── TileGrid.css       # Table styles
    │   ├── NavBar.css         # HUD bar styles
    │   └── images/
    │       ├── spritesheet.png
    │       └── wallset.gif
    ├── core/                  # Game core logic
    │   ├── index.js           # Re-exports from map.js
    │   ├── constants.js       # Grid dimensions, entity counts
    │   ├── dungeon.js         # Wraps 'dungeoneer' lib; adds bitmask methods
    │   ├── generator.js       # Bob Nystrom rooms-and-mazes dungeon generator (~400 LOC)
    │   ├── map.js             # Combines dungeoneer output with custom bitmask → wall texture mapping
    │   ├── room.js            # Room class (bounding box, intersection)
    │   ├── tile.js            # Tile class (type, neighbours)
    │   ├── utils.js           # range, random, between, eql, randomRange, rollXDice, weightedRange
    │   ├── detectSwipe.js     # Touch swipe detection for mobile
    │   ├── map.test.js        # 4 tests for map generation and spawn functions
    │   └── utils.test.js      # 1 test for rollXDice
    └── selectors/
        └── index.js           # 1 reselect selector (getGridPosition) — unused, missing reselect dep
```

## 4. How It's Built and Deployed

**Development:**
```
npm install        # install dependencies
npm start          # runs vite dev server (default port 5173)
```

**Production Build:**
```
npm run build      # vite build → outputs to ./dist/
npm run serve      # vite preview of built output
```

**CI/CD (GitHub Actions):**
- Triggered on push to `main` branch
- Installs dependencies, runs `npm run build`
- Deploys `./dist/` to GitHub Pages at `https://corynorris.github.io/roguelike/`
- Uses `actions/checkout@v3`, `actions/setup-node@v3`, `actions/configure-pages@v3` (all have newer major versions)

## 5. Obvious Issues and Outdated Patterns

### Critical Bugs

1. **`effects.js` — `SET_BLOOD` uses wrong value** (line ~15): `blood: state.value` should be `blood: action.value`. The blood overlay is always set to `undefined` (or whatever stale state.value is), meaning it likely never activates. *(File: `src/reducers/effects.js`, line in `SET_BLOOD` case)*

2. **Missing `reselect` dependency**: `src/selectors/index.js` imports from `reselect` but it's not in `package.json`. The app would crash if anything imported from selectors. Currently the selector appears unused.

3. **`Effects.jsx` — broken `setTimeout` context**: `setTimeout(props.disableBlood.bind(this), 175)` — `this` is `undefined` in a functional component. The `.bind(this)` is a no-op, but the `disableBlood` action calls `dispatch(setBlood(false))` which hits the bug in #1 (uses `state.value` not `action.value`). *(File: `src/containers/Effects.jsx`, blood overlay section)*

### Deprecated / Outdated Patterns

4. **`componentWillMount` in `Roguelike.jsx`**: This lifecycle is deprecated since React 16.3 and will trigger warnings in React 18 strict mode. Should be moved to `componentDidMount` (or constructor for pure setup without side effects). *(File: `src/presenters/Roguelike.jsx`, `componentWillMount` method)*

5. **`node-sass` is deprecated**: The project uses only `.css` files (no `.scss`). `node-sass` is unnecessary and has been deprecated in favor of `sass` (dart-sass). Should be removed entirely. *(File: `package.json`)*

6. **`redux-devtools-extension` is legacy**: Should migrate to `@redux-devtools/extension`. The current package still works but is unmaintained. *(File: `src/index.jsx`, `package.json`)*

7. **CRA artifacts left after Vite migration**:
   - `.buildpacks` — Heroku CRA buildpack URL
   - `Procfile` — references `bin/boot` (CRA Heroku startup)
   - `.eslintcache` — CRA lint cache
   - `eslintConfig` in `package.json` — references `"extends": "react-app"` (CRA's internal config)
   - `.gitignore` ignores `build/` not `dist/` (Vite's output)
   - `.vscode/launch.json` — port 3000 (CRA) instead of 5173 (Vite)
   - `public/favicon.ico` and `src/logo.svg` — unused CRA boilerplate

8. **GH Actions uses outdated action versions**: `checkout@v3` → v4, `setup-node@v3` → v4, `configure-pages@v3` → v5, `upload-pages-artifact@v1` → v4, `deploy-pages@v1` → v4. *(File: `.github/workflows/gh-pages.yml`)*

### Design / Performance Issues

9. **New `Map` object every render in `Game.jsx`**: `mapStateToProps` creates a new `Map` on every state change, defeating `connect`'s shallow comparison memoization. *(File: `src/containers/Game.jsx`, `mapStateToProps`)*

10. **Unused dependency: `vite-plugin-svgr`**: Listed in dependencies but no SVG imports exist. *(File: `package.json`)*

11. **String-typed Redux actions**: All actions use plain strings (e.g., `'SPAWN_SPRITE'`) instead of constants or action creator factories. No typos caught at compile time, but consistent across the codebase.

12. **Key handling uses magic numbers**: `Roguelike.jsx` switch statements use raw key codes (82, 87, 38, etc.) instead of named constants like `KeyCode.R`.

13. **Two dungeon generators coexist**: `dungeon.js` wraps the `dungeoneer` npm package for bitmask wall textures, while `generator.js` implements Bob Nystrom's algorithm from scratch for room/maze generation. Only `dungeoneer` is actually used by `map.js`. `generator.js`, `room.js`, and `tile.js` are dead code. The unused files depend on `victor` and `underscore`.

14. **`vite` is in `dependencies` not `devDependencies`**: Vite should be a dev dependency. Similarly `@vitejs/plugin-react-swc` and `vite-plugin-svgr` should be dev dependencies. *(File: `package.json`)*

### Test Coverage

- Only `src/core/map.test.js` (4 tests) and `src/core/utils.test.js` (1 test)
- No reducer tests, no component tests, no integration tests
- Test runner not configured (no jest/vitest config visible in package.json)

## 6. Data Flow Summary

```
index.jsx
  └─ createStore(reducers, thunk middleware)
     └─ <Provider> → <Game/> (connected Roguelike)

Game.jsx (container)
  ├─ mapStateToProps: tiles, rooms, sprites (Map), player, screen, effects
  ├─ mapDispatchToProps: moveSprite, attackSprite, setupGame (thunk), resetGame, etc.
  └─ renders <Roguelike>

Roguelike.jsx (presenter)
  ├─ Input: keydown (WASD/arrows/R/H), touchswipe, window resize
  ├─ Game logic: movePlayer, battleEnemy, usePotion, upgradeWeapon
  └─ Renders: <StatsBar> <Effects> <Map> <Player> <HealthPacks> <Weapons> <Boss> <Enemies>

Redux State Shape:
{
  sprites: [ { id, name, level, x, y, health, maxHealth, power, experience }, ... ],
  map: {
    width, height, tiles[][], rooms[]
  },
  screen: { top, left },
  effects: { fogOn, defeat, victory, blood }
}
```

## Start Here

Begin with `src/presenters/Roguelike.jsx` — it contains the main game loop, input handling, and all game mechanics. From there, trace into `src/containers/Game.jsx` for the Redux wiring and `src/reducers/sprites.js` for the state mutation logic.
