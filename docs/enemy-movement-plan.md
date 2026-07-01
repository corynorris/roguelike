# Enemy Movement & Telegraphing Plan

## Overview

Enemies currently have no movement — they are static sprites placed on spawn, and the player walks into them to trigger combat. This plan adds:

1. **Move speeds** — each enemy moves every N player turns (e.g., `moveSpeed = 3` → moves every 3rd turn)
2. **Two-mode AI** — enemies wander aimlessly until the player enters chase range, then pursue
3. **Telegraphing** — enemies highlight their intended destination for one turn before moving, with brightness proportional to move speed

---

## 1. Data Model Changes (`src/types.ts`)

Extend `SpriteData`:

```ts
export interface SpriteData {
  // ... existing fields ...
  moveSpeed: number;      // turns between enemy actions (3 = moves every 3rd turn)
  cooldown: number;       // turns remaining until this enemy acts
  intentX?: number;       // telegraph target X (undefined = no intent)
  intentY?: number;       // telegraph target Y
}
```

Add `TurnState` to `RoguelikeState`:

```ts
export interface TurnState {
  count: number;
}

export interface RoguelikeState {
  sprites: SpriteData[];
  map: MapState;
  screen: ScreenState;
  effects: EffectsState;
  turns: TurnState;       // NEW
}
```

### Cooldown Lifecycle

```
Spawned:  cooldown = moveSpeed
Turn N:   cooldown-- for all enemies
Turn N:   cooldown == 0, no intent → AI runs, intent set (telegraph appears)
Turn N+1: cooldown == 0, intent set  → execute move, clear intent, cooldown = moveSpeed
```

Net effect: enemies have a 1-turn "wind-up" between deciding to move and actually moving. The telegraph is visible during that wind-up.

---

## 2. Constants (`src/core/constants.ts`)

```ts
// Move speed by enemy level (index 0 = level 1)
static ENEMY_MOVE_SPEEDS = [4, 3, 3, 2, 2, 2, 1, 1, 1];

// Manhattan distance threshold — enemy switches from wander to chase
static ENEMY_CHASE_RANGE = 8;

static BOSS_MOVE_SPEED = 2;
static BOSS_CHASE_RANGE = 12;
```

---

## 3. Enemy AI Module (NEW: `src/core/enemy-ai.ts`)

Exports a single function:

```ts
function getEnemyMove(
  enemy: SpriteData,
  player: SpriteData,
  dungeon: Dungeon,
  occupiedTiles: Set<string>
): { x: number; y: number } | null;
```

### Wander Mode (player is outside Manhattan distance ≤ `CHASE_RANGE`)

1. Gather all 4 adjacent tiles (up, down, left, right)
2. Filter to those that are floor tiles (not walls) and not occupied by another enemy
3. If any valid tiles exist, pick one at random
4. If none are valid, return `null` (enemy stays put — telegraph appears/disappears on same tile)

### Chase Mode (player within chase range)

1. Determine which axis has the larger distance (|dx| vs |dy|)
2. Try moving one step along that axis toward the player
3. If blocked (wall or occupied), try the other axis
4. If both are blocked, fall back to wander behavior
5. If fully stuck, return `null`

---

## 4. New Redux Actions (`src/actions/index.ts`)

| Action Type | Creator | Payload | Purpose |
|---|---|---|---|
| `ADVANCE_TURN` | `advanceTurn()` | — | Increment turn counter |
| `SET_ENEMY_INTENT` | `setEnemyIntent(id, x, y)` | `id, x, y` | Set telegraph position on an enemy |
| `CLEAR_ENEMY_INTENT` | `clearEnemyIntent(id)` | `id` | Remove telegraph from an enemy |
| `EXECUTE_ENEMY_MOVE` | `executeEnemyMove(id, x, y)` | `id, x, y` | Move enemy to its telegraphed tile |

All exported from `src/actions/index.ts` and added to the `Action` union type.

---

## 5. Sprite Reducer Changes (`src/reducers/sprites.ts`)

### `SPAWN_SPRITE` handler
When spawning an enemy or boss, initialize from constants:
- `moveSpeed` = `Const.ENEMY_MOVE_SPEEDS[action.level - 1]` (or `Const.BOSS_MOVE_SPEED`)
- `cooldown` = `moveSpeed`

### `SET_ENEMY_INTENT` handler
Match by `id`, set `intentX` and `intentY`.

### `CLEAR_ENEMY_INTENT` handler
Match by `id`, delete `intentX` and `intentY`.

### `EXECUTE_ENEMY_MOVE` handler
Match by `id`, update `x`/`y` to the target position, reset `cooldown` to `moveSpeed`, clear intent.

---

## 6. Turn Reducer (NEW: `src/reducers/turns.ts`)

```ts
const turns = (state = { count: 0 }, action: Action): TurnState => {
  switch (action.type) {
    case "ADVANCE_TURN":
      return { count: state.count + 1 };
    case "RESET_DATA":
      return { count: 0 };
    default:
      return state;
  }
};
```

Register in `combineReducers` in `src/reducers/index.ts` under key `turns`.

---

## 7. Enemy Turn Thunk (`src/containers/Game.tsx`)

New thunk `advanceTurn` dispatched after every player move. Flow:

```
function advanceTurn():
  1. dispatch({ type: "ADVANCE_TURN" })
  2. const state = getState()
  3. const dungeon = state.map         // has tiles, get(), check()
  4. const player = state.sprites.find(s => s.name === Const.PLAYER)
  5. Build occupiedTiles Set from all live sprites ("x,y" keys)

  6. For each enemy (name === Const.ENEMY or Const.BOSS):
     a. Decrement cooldown (dispatch to reducer or compute here)
     b. If cooldown === 0 AND intentX is NOT set:
        - target = getEnemyMove(enemy, player, dungeon, occupiedTiles)
        - If target: dispatch SET_ENEMY_INTENT(enemy.id, target.x, target.y)
          AND add target to occupiedTiles (prevent two enemies telegraphing same tile)
        - If no target: enemy skips this turn (cooldown resets to moveSpeed, no move)
     c. If cooldown === 0 AND intentX IS set:
        - target = { x: enemy.intentX, y: enemy.intentY }
        - Remove target from occupiedTiles (the enemy itself)
        - dispatch EXECUTE_ENEMY_MOVE(enemy.id, target.x, target.y)
        - If target matches player position → trigger combat (same battleEnemy logic)
        - If target has another enemy → that enemy takes collision damage? (or just block)
        - If target has an item → item is destroyed (enemy tramples it)
```

Note: cooldown decrement could happen inside `advanceTurn` thunk (dispatch per-enemy) or by adding a `DECREMENT_COOLDOWNS` action handled in the sprite reducer.

---

## 8. Wire Into Player Turn (`src/presenters/Roguelike.tsx`)

In `movePlayer()`, after the player's action dispatches:

```ts
movePlayer(x: number, y: number) {
  // ... existing player move/combat/pickup logic ...
  this.props.advanceTurn();  // NEW — triggers enemy AI after player acts
}
```

Add `advanceTurn: () => void` to the `RoguelikeProps` interface and wire it in `mapDispatchToProps` in `Game.tsx`.

---

## 9. Telegraph Visual Rendering

### Brightness by Move Speed

Instead of a binary on/off highlight, telegraph brightness varies by speed:

| Move Speed | Meaning | Color | Intensity |
|---|---|---|---|
| 1 | Moves every turn (fastest) | Bright red | Highest |
| 2 | Every 2 turns | Orange-red | High |
| 3 | Every 3 turns | Amber | Medium |
| 4 | Every 4 turns (slowest) | Pale yellow | Low |

Implementation — compute inline style on the `<td>`:

```ts
function telegraphStyle(speed: number): React.CSSProperties {
  const alpha = 0.3 + (5 - speed) * 0.17;  // speed 1→0.98, speed 4→0.47
  const r = 255;
  const g = Math.round(220 - speed * 45);   // speed 1→175, speed 4→40
  const b = 0;
  return {
    '--telegraph-color': `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`,
  } as React.CSSProperties;
}
```

### CSS Animation (`src/presenters/Tile.css`)

```css
.tile-telegraph {
  animation: telegraph-pulse 0.6s ease-in-out infinite alternate;
  box-shadow: inset 0 0 6px 2px var(--telegraph-color);
}

@keyframes telegraph-pulse {
  from {
    box-shadow: inset 0 0 4px 1px var(--telegraph-color);
  }
  to {
    box-shadow: inset 0 0 10px 4px var(--telegraph-color);
  }
}
```

---

## 10. Data Flow Through Components

### `Game.tsx` → `mapStateToProps`

Compute a telegraph lookup map:

```ts
const telegraphs = new Map<string, number>(); // "x,y" → moveSpeed
state.sprites.forEach(sprite => {
  if (sprite.intentX != null && sprite.intentY != null) {
    telegraphs.set(`${sprite.intentX}x${sprite.intentY}`, sprite.moveSpeed);
  }
});
```

Pass `telegraphs` as a prop.

### `Map.tsx` container

Pass `telegraphs` from state to `TileGrid`.

### `TileGrid.tsx`

```tsx
interface TileGridProps {
  tiles: Tile[][];
  telegraphs: Map<string, number>;
}
```

Inside the loop, look up each tile:

```ts
const key = `${tiles[x][y].x}x${tiles[x][y].y}`;
const telegraphSpeed = telegraphs.get(key);
```

Pass `telegraphSpeed` to `Tile`.

### `Tile.tsx`

```tsx
interface TileProps {
  texture: string;
  orig: number;
  telegraphSpeed?: number; // undefined = no telegraph
}

const Tile = ({ texture, orig, telegraphSpeed }: TileProps) => {
  const cls = `tile tile-${texture} ${orig}${telegraphSpeed != null ? ' tile-telegraph' : ''}`;
  const style = telegraphSpeed != null ? telegraphStyle(telegraphSpeed) : undefined;
  return <td className={cls} style={style} />;
};
```

---

## 11. Edge Cases

| Scenario | Handling |
|---|---|
| Enemy intent tile is already telegraphed by another enemy | Second enemy's AI excludes occupied/telegraphed tiles; picks alternative or stays put |
| Enemy lands on player during execute | Combat triggers using existing `battleEnemy` logic |
| Enemy lands on health/weapon item | Item is destroyed (dispatch `DESTROY_SPRITE`) |
| Player kills enemy while its telegraph is showing | Intent disappears naturally — sprite is removed from state array, so telegraph map won't include it |
| Enemy in wander mode with no valid adjacent tiles | Returns `null` — enemy stays put, telegraph shows on its own tile then fades; cooldown resets |
| Boss behavior | Same as enemies but with separate move speed / chase range constants |
| Multiple enemies moving on same turn | Processed sequentially in the `advanceTurn` thunk; `occupiedTiles` set updated after each move to prevent collisions |

---

## 12. File Summary

| File | Change |
|---|---|
| `src/types.ts` | Add `moveSpeed`, `cooldown`, `intentX?`, `intentY?` to `SpriteData`; add `TurnState` interface and `turns` to `RoguelikeState` |
| `src/core/constants.ts` | Add `ENEMY_MOVE_SPEEDS` array, `ENEMY_CHASE_RANGE`, `BOSS_MOVE_SPEED`, `BOSS_CHASE_RANGE` |
| `src/core/enemy-ai.ts` | **NEW** — `getEnemyMove()` with wander/chase pathfinding |
| `src/actions/index.ts` | Add 4 new action types + action creators; extend `Action` union |
| `src/reducers/sprites.ts` | Handle `SET_ENEMY_INTENT`, `CLEAR_ENEMY_INTENT`, `EXECUTE_ENEMY_MOVE`; init move speed / cooldown on `SPAWN_SPRITE` |
| `src/reducers/turns.ts` | **NEW** — turn counter reducer |
| `src/reducers/index.ts` | Register `turns` reducer in `combineReducers` |
| `src/containers/Game.tsx` | Add `advanceTurn` thunk; compute `telegraphs` map in `mapStateToProps`; wire `advanceTurn` in `mapDispatchToProps` |
| `src/presenters/Roguelike.tsx` | Add `advanceTurn` prop; call it at end of `movePlayer()` |
| `src/containers/Map.tsx` | Accept `telegraphs` from state, pass to `TileGrid` |
| `src/presenters/TileGrid.tsx` | Accept `telegraphs` prop; look up each tile, pass `telegraphSpeed` to `Tile` |
| `src/presenters/Tile.tsx` | Accept optional `telegraphSpeed`; apply CSS class + inline `--telegraph-color` style |
| `src/presenters/Tile.css` | Add `.tile-telegraph` class + `@keyframes telegraph-pulse` animation |

---

## 13. Implementation Order (Recommended)

1. **Data model** — `types.ts`, `constants.ts`
2. **Turn reducer** — `reducers/turns.ts`, register in `reducers/index.ts`
3. **Actions** — add 4 new actions to `actions/index.ts`
4. **Sprite reducer** — handle new actions, init move speed in `sprites.ts`
5. **Enemy AI** — `core/enemy-ai.ts`
6. **Thunk + container wiring** — `Game.tsx`
7. **Player turn hook** — `Roguelike.tsx`
8. **Telegraph rendering** — `Map.tsx`, `TileGrid.tsx`, `Tile.tsx`, `Tile.css`
9. **Test** — playtest with various enemy speeds, verify wander/chase behavior
