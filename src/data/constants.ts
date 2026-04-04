import type { PieceType } from '../types';

// Board
export const BOARD_SIZE = 7;
export const MATCH_MIN = 3;

// Tile rendering
export const CELL_SIZE = 52;
export const BOARD_OFFSET_X = 11; // pixels from left edge of canvas (390px wide)
export const BOARD_OFFSET_Y = 120; // pixels from top

// Canvas size
export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

// Evolution thresholds (total material points required)
export const SPAT_THRESHOLD = 100;
export const BABY_THRESHOLD = 150;
export const APPRENTICE_THRESHOLD = 200;

// Material points per tile matched
export const POINTS_PER_MATCH = 5;

// Piece types used in the board
export const PIECE_TYPES: PieceType[] = [
  'blossom',
  'pearl',
  'aqua',
  'shell',
  'ribbon',
];

// Material display colors (fallback when images missing)
export const MATERIAL_COLORS: Record<PieceType, number> = {
  blossom: 0xff88aa,
  pearl:   0xf0e8d8,
  aqua:    0x88ddff,
  shell:   0xd4a04a,
  ribbon:  0xdd66bb,
};

// Debug
export const DEBUG_MATERIAL_BONUS = 50;
