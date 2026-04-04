import type { Cell, Position } from '../types';
import { BOARD_SIZE, MATCH_MIN } from '../data/constants';

export type Grid = Cell[][];

/**
 * Find all matches (horizontal and vertical) in the grid.
 * Returns array of matched positions (may overlap from different groups).
 */
export function findMatches(grid: Grid): Position[] {
  const matched = new Set<string>();

  function key(r: number, c: number): string {
    return `${r},${c}`;
  }

  // Horizontal
  for (let r = 0; r < BOARD_SIZE; r++) {
    let c = 0;
    while (c < BOARD_SIZE) {
      const piece = grid[r][c].piece;
      if (!piece || grid[r][c].obstacle) {
        c++;
        continue;
      }
      let len = 1;
      while (c + len < BOARD_SIZE && grid[r][c + len].piece === piece && !grid[r][c + len].obstacle) {
        len++;
      }
      if (len >= MATCH_MIN) {
        for (let i = 0; i < len; i++) matched.add(key(r, c + i));
      }
      c += len;
    }
  }

  // Vertical
  for (let col = 0; col < BOARD_SIZE; col++) {
    let r = 0;
    while (r < BOARD_SIZE) {
      const piece = grid[r][col].piece;
      if (!piece || grid[r][col].obstacle) {
        r++;
        continue;
      }
      let len = 1;
      while (r + len < BOARD_SIZE && grid[r + len][col].piece === piece && !grid[r + len][col].obstacle) {
        len++;
      }
      if (len >= MATCH_MIN) {
        for (let i = 0; i < len; i++) matched.add(key(r + i, col));
      }
      r += len;
    }
  }

  return Array.from(matched).map((k) => {
    const [row, col] = k.split(',').map(Number);
    return { row, col };
  });
}

/**
 * Returns positions adjacent (4-directional) to the given set.
 */
export function adjacentPositions(positions: Position[]): Position[] {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const inBounds = (r: number, c: number) =>
    r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
  const posSet = new Set(positions.map((p) => `${p.row},${p.col}`));
  const result: Position[] = [];
  const seen = new Set<string>();

  for (const pos of positions) {
    for (const [dr, dc] of dirs) {
      const nr = pos.row + dr;
      const nc = pos.col + dc;
      const k = `${nr},${nc}`;
      if (inBounds(nr, nc) && !posSet.has(k) && !seen.has(k)) {
        seen.add(k);
        result.push({ row: nr, col: nc });
      }
    }
  }
  return result;
}
