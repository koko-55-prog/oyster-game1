import type { CharacterId } from './characters';
import type { MaterialPoints } from './materials';

export interface GameState {
  currentCharacter: CharacterId;
  materials: MaterialPoints;
  currentStageIndex: number;
  unlockedCharacters: CharacterId[];
  stagesCompleted: number;
}

export interface StageResult {
  stageIndex: number;
  materialsGained: MaterialPoints;
  cleared: boolean;
  movesUsed: number;
}
