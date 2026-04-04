import type { MaterialType } from './materials';

export type PieceType = MaterialType;

export type FloorGimmick = 'mud' | 'redtide' | null;
export type ObstacleType = 'shellrock' | 'lockedtreasure' | null;
export type CoverType = 'bubbleblock' | null;

export interface Cell {
  piece: PieceType | null;
  floorGimmick: FloorGimmick;
  floorHp: number;
  obstacle: ObstacleType;
  obstacleHp: number;
  cover: CoverType;
}

export interface Position {
  row: number;
  col: number;
}

export interface ObstaclePlacement {
  type: 'mud' | 'redtide' | 'bubbleblock' | 'shellrock' | 'lockedtreasure';
  row: number;
  col: number;
  hp?: number;
}

export interface MatchGroup {
  positions: Position[];
}
