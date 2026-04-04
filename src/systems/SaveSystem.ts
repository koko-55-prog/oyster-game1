import type { GameState } from '../types';
import { emptyMaterials } from '../types';

const SAVE_KEY = 'oyster-game-v1';

function defaultState(): GameState {
  return {
    currentCharacter: 'spat_beige',
    materials: emptyMaterials(),
    currentStageIndex: 0,
    unlockedCharacters: ['spat_beige'],
    stagesCompleted: 0,
  };
}

export const SaveSystem = {
  load(): GameState {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw) as Partial<GameState>;
      // Merge with defaults to handle schema changes
      return { ...defaultState(), ...parsed };
    } catch {
      return defaultState();
    }
  },

  save(state: GameState): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable — ignore silently
    }
  },

  reset(): GameState {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // ignore
    }
    return defaultState();
  },
};
