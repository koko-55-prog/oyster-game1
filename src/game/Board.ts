import type {
  Cell,
  Position,
  MaterialPoints,
  ObstaclePlacement,
  PieceType,
} from '../types';
import { emptyMaterials, addMaterials } from '../types';
import { BOARD_SIZE, POINTS_PER_MATCH } from '../data/constants';
import { findMatches, adjacentPositions } from './Matcher';
import { applyGravity, refill, createGrid } from './Cascader';
import type { Grid } from './Matcher';

export interface ResolveResult {
  materialsGained: MaterialPoints;
  matchCount: number;
  gimmicksCleared: string[];
}

export class Board {
  grid: Grid;

  constructor() {
    this.grid = createGrid();
  }

  /** Apply stage obstacle placements to the grid */
  applyObstacles(obstacles: ObstaclePlacement[]): void {
    for (const obs of obstacles) {
      const cell = this.grid[obs.row][obs.col];
      switch (obs.type) {
        case 'mud':
          cell.floorGimmick = 'mud';
          cell.floorHp = 1;
          break;
        case 'redtide':
          cell.floorGimmick = 'redtide';
          cell.floorHp = 2;
          break;
        case 'bubbleblock':
          cell.cover = 'bubbleblock';
          break;
        case 'shellrock':
          cell.obstacle = 'shellrock';
          cell.obstacleHp = obs.hp ?? 2;
          cell.piece = null; // obstacle occupies the cell
          break;
        case 'lockedtreasure':
          cell.obstacle = 'lockedtreasure';
          cell.obstacleHp = obs.hp ?? 2;
          cell.piece = null;
          break;
      }
    }
  }

  /** Attempt to swap two adjacent pieces. Returns false if not adjacent. */
  swap(a: Position, b: Position): boolean {
    if (!this.isAdjacent(a, b)) return false;
    const ca = this.grid[a.row][a.col];
    const cb = this.grid[b.row][b.col];
    if (ca.obstacle || cb.obstacle) return false;
    const tmp = ca.piece;
    ca.piece = cb.piece;
    cb.piece = tmp;
    return true;
  }

  /** Resolve all matches on the current grid, applying cascades.
   *  Returns accumulated materials gained. */
  resolve(): ResolveResult {
    let totalMaterials = emptyMaterials();
    let totalMatches = 0;
    const gimmicksCleared: string[] = [];

    let iteration = 0;
    while (iteration < 20) {
      const matches = findMatches(this.grid);
      if (matches.length === 0) break;

      totalMatches += matches.length;

      // Collect materials from matched pieces
      const gained = emptyMaterials();
      for (const pos of matches) {
        const cell = this.grid[pos.row][pos.col];
        const piece = cell.piece as PieceType;
        if (piece && piece in gained) {
          (gained as Record<string, number>)[piece] += POINTS_PER_MATCH;
        }

        // Process floor gimmicks
        if (cell.floorGimmick) {
          cell.floorHp--;
          if (cell.floorHp <= 0) {
            gimmicksCleared.push(cell.floorGimmick);
            cell.floorGimmick = null;
            cell.floorHp = 0;
          }
        }

        // Remove cover
        if (cell.cover) {
          gimmicksCleared.push('bubbleblock');
          cell.cover = null;
        }

        // Remove piece
        cell.piece = null;
      }

      // Process adjacent fixed obstacles
      const adjacent = adjacentPositions(matches);
      for (const pos of adjacent) {
        const cell = this.grid[pos.row][pos.col];
        if (cell.obstacle === 'shellrock' || cell.obstacle === 'lockedtreasure') {
          cell.obstacleHp--;
          if (cell.obstacleHp <= 0) {
            if (cell.obstacle === 'lockedtreasure') {
              // Bonus materials on unlock
              const bonusTypes: (keyof MaterialPoints)[] = ['blossom', 'pearl', 'aqua', 'shell', 'ribbon'];
              const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
              (gained as Record<string, number>)[bonusType] += 20;
            }
            gimmicksCleared.push(cell.obstacle);
            cell.obstacle = null;
            cell.obstacleHp = 0;
            // Cell becomes a normal playable cell; give it a piece
            cell.piece = null; // will be filled by refill
          }
        }
      }

      totalMaterials = addMaterials(totalMaterials, gained);

      // Gravity + refill
      applyGravity(this.grid);
      refill(this.grid);

      iteration++;
    }

    return { materialsGained: totalMaterials, matchCount: totalMatches, gimmicksCleared };
  }

  /** Resolve matches after a swap; undo if no matches found. */
  swapAndResolve(a: Position, b: Position): ResolveResult | null {
    if (!this.swap(a, b)) return null;
    const matches = findMatches(this.grid);
    if (matches.length === 0) {
      // Undo swap
      this.swap(b, a);
      return null;
    }
    return this.resolve();
  }

  private isAdjacent(a: Position, b: Position): boolean {
    return (
      (Math.abs(a.row - b.row) === 1 && a.col === b.col) ||
      (Math.abs(a.col - b.col) === 1 && a.row === b.row)
    );
  }

  getCell(pos: Position): Cell {
    return this.grid[pos.row][pos.col];
  }

  /** Ensure no deadlock: if no moves possible, shuffle */
  ensurePlayable(): void {
    let attempts = 0;
    while (!this.hasPossibleMove() && attempts < 10) {
      this.shufflePieces();
      attempts++;
    }
  }

  private hasPossibleMove(): boolean {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.grid[r][c].obstacle || !this.grid[r][c].piece) continue;
        // Try right
        if (c + 1 < BOARD_SIZE && !this.grid[r][c + 1].obstacle) {
          this.swap({ row: r, col: c }, { row: r, col: c + 1 });
          const m = findMatches(this.grid);
          this.swap({ row: r, col: c + 1 }, { row: r, col: c });
          if (m.length > 0) return true;
        }
        // Try down
        if (r + 1 < BOARD_SIZE && !this.grid[r + 1][c].obstacle) {
          this.swap({ row: r, col: c }, { row: r + 1, col: c });
          const m = findMatches(this.grid);
          this.swap({ row: r + 1, col: c }, { row: r, col: c });
          if (m.length > 0) return true;
        }
      }
    }
    return false;
  }

  private shufflePieces(): void {
    // Collect all pieces, shuffle, redistribute
    const pieces: (PieceType | null)[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!this.grid[r][c].obstacle) pieces.push(this.grid[r][c].piece);
      }
    }
    // Fisher-Yates
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    let idx = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!this.grid[r][c].obstacle) {
          this.grid[r][c].piece = pieces[idx++] ?? null;
        }
      }
    }
  }
}
