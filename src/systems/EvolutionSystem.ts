import type { CharacterId, GameState, MaterialPoints } from '../types';
import { calcEvolution } from '../data/evolutionRules';
import { addMaterials } from '../types';
import { SaveSystem } from './SaveSystem';
import { STAGES } from '../data/stageConfigs';

export const EvolutionSystem = {
  /**
   * Check if current character can evolve.
   * Returns the new CharacterId if yes, null otherwise.
   */
  checkEvolution(state: GameState): CharacterId | null {
    return calcEvolution(state.currentCharacter, state.materials);
  },

  /**
   * Apply evolution to state, save, and return updated state.
   */
  applyEvolution(state: GameState, nextId: CharacterId): GameState {
    const next: GameState = {
      ...state,
      currentCharacter: nextId,
      unlockedCharacters: state.unlockedCharacters.includes(nextId)
        ? state.unlockedCharacters
        : [...state.unlockedCharacters, nextId],
    };
    SaveSystem.save(next);
    return next;
  },

  /**
   * Apply stage result materials to state, save, return updated state.
   */
  applyStageResult(
    state: GameState,
    gained: MaterialPoints,
    stageIndex: number,
  ): GameState {
    const next: GameState = {
      ...state,
      materials: addMaterials(state.materials, gained),
      stagesCompleted: Math.max(state.stagesCompleted, stageIndex + 1),
      currentStageIndex: Math.min(
        state.currentStageIndex + 1,
        STAGES.length - 1,
      ),
    };
    SaveSystem.save(next);
    return next;
  },

  /** Force-set materials (for debug) */
  debugAddMaterials(state: GameState, amount: number): GameState {
    const next: GameState = {
      ...state,
      materials: {
        blossom: state.materials.blossom + amount,
        pearl: state.materials.pearl + amount,
        aqua: state.materials.aqua + amount,
        shell: state.materials.shell + amount,
        ribbon: state.materials.ribbon + amount,
      },
    };
    SaveSystem.save(next);
    return next;
  },
};
