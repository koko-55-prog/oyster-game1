import type { Cell, PieceType } from '../types';
import { BOARD_SIZE, PIECE_TYPES } from '../data/constants';
import type { Grid } from './Matcher';

function randomPiece(): PieceType {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}

/**
 * Apply gravity: pieces fall down to fill empty (null piece) cells.
 * Obstacles are immovable and block falling.
 * Returns true if any piece moved.
 */
export function applyGravity(grid: Grid): boolean {
  let moved = false;
  for (let col = 0; col < BOARD_SIZE; col++) {
    // Scan from bottom up
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (grid[row][col].piece !== null) continue;
      if (grid[row][col].obstacle !== null) continue; // obstacle blocks flow

      // Find the nearest piece above
      for (let above = row - 1; above >= 0; above--) {
        if (grid[above][col].obstacle !== null) break; // obstacle blocks
        if (grid[above][col].piece !== null) {
          grid[row][col].piece = grid[above][col].piece;
          grid[above][col].piece = null;
          moved = true;
          break;
        }
      }
    }
  }
  return moved;
}

/**
 * Fill empty cells with random pieces.
 */
export function refill(grid: Grid): void {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (grid[row][col].piece === null && grid[row][col].obstacle === null) {
        grid[row][col].piece = randomPiece();
      }
    }
  }
}

/**
 * Create a fresh grid of cells.
 */
export function createGrid(): Grid {
  const grid: Grid = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push({
        piece: randomPiece(),
        floorGimmick: null,
        floorHp: 0,
        obstacle: null,
        obstacleHp: 0,
        cover: null,
      });
    }
    grid.push(row);
  }
  return grid;
}
