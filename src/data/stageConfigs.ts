import type { MaterialPoints, ObstaclePlacement } from '../types';

export interface StageConfig {
  id: number;
  name: string;
  moveLimit: number;
  goals: Partial<MaterialPoints>;
  obstacles: ObstaclePlacement[];
  rewardMultiplier: number;
}

export const STAGES: StageConfig[] = [
  {
    id: 1,
    name: 'なぎさの浜',
    moveLimit: 30,
    goals: {},
    obstacles: [],
    rewardMultiplier: 1,
  },
  {
    id: 2,
    name: 'ヘドロの入江',
    moveLimit: 25,
    goals: {},
    obstacles: [
      { type: 'mud', row: 3, col: 3 },
      { type: 'mud', row: 3, col: 4 },
      { type: 'mud', row: 4, col: 3 },
      { type: 'mud', row: 2, col: 2 },
    ],
    rewardMultiplier: 1.2,
  },
  {
    id: 3,
    name: '泡の洞窟',
    moveLimit: 25,
    goals: {},
    obstacles: [
      { type: 'bubbleblock', row: 1, col: 1 },
      { type: 'bubbleblock', row: 1, col: 5 },
      { type: 'bubbleblock', row: 2, col: 3 },
      { type: 'bubbleblock', row: 4, col: 2 },
      { type: 'bubbleblock', row: 4, col: 4 },
      { type: 'mud', row: 5, col: 5 },
      { type: 'mud', row: 5, col: 1 },
    ],
    rewardMultiplier: 1.3,
  },
  {
    id: 4,
    name: '封印の礁',
    moveLimit: 20,
    goals: {},
    obstacles: [
      { type: 'shellrock', row: 0, col: 3, hp: 2 },
      { type: 'shellrock', row: 3, col: 0, hp: 2 },
      { type: 'shellrock', row: 3, col: 6, hp: 2 },
      { type: 'shellrock', row: 6, col: 3, hp: 2 },
      { type: 'mud', row: 2, col: 2 },
      { type: 'mud', row: 4, col: 4 },
    ],
    rewardMultiplier: 1.5,
  },
  {
    id: 5,
    name: '赤潮の海峡',
    moveLimit: 20,
    goals: {},
    obstacles: [
      { type: 'redtide', row: 3, col: 0 },
      { type: 'redtide', row: 3, col: 1 },
      { type: 'redtide', row: 3, col: 2 },
      { type: 'redtide', row: 3, col: 4 },
      { type: 'redtide', row: 3, col: 5 },
      { type: 'redtide', row: 3, col: 6 },
      { type: 'lockedtreasure', row: 3, col: 3, hp: 2 },
      { type: 'shellrock', row: 0, col: 0, hp: 2 },
      { type: 'shellrock', row: 6, col: 6, hp: 2 },
    ],
    rewardMultiplier: 2.0,
  },
];
