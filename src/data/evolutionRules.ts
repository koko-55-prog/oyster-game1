import type { CharacterId } from '../types';
import type { MaterialPoints } from '../types';
import {
  SPAT_THRESHOLD,
  BABY_THRESHOLD,
  APPRENTICE_THRESHOLD,
} from './constants';

/**
 * Returns the next CharacterId if evolution conditions are met, or null.
 */
export function calcEvolution(
  current: CharacterId,
  materials: MaterialPoints,
): CharacterId | null {
  const { blossom, pearl, aqua, ribbon } = materials;
  const total = blossom + pearl + aqua + ribbon + materials.shell;

  switch (current) {
    case 'spat_beige': {
      if (total < SPAT_THRESHOLD) return null;
      const pinkScore = blossom + ribbon;
      const blueScore = pearl + aqua;
      return pinkScore > blueScore ? 'baby_pink' : 'baby_blue';
    }

    case 'baby_pink': {
      const pinkTotal = blossom + ribbon;
      if (pinkTotal < BABY_THRESHOLD) return null;
      return ribbon > blossom ? 'apprentice_wa' : 'apprentice_sakura';
    }

    case 'baby_blue': {
      const blueTotal = pearl + aqua;
      if (blueTotal < BABY_THRESHOLD) return null;
      return pearl > aqua ? 'apprentice_milky' : 'apprentice_wave';
    }

    case 'apprentice_wa': {
      const appTotal = blossom + pearl + aqua + ribbon;
      if (appTotal < APPRENTICE_THRESHOLD) return null;
      return 'princess_wa';
    }
    case 'apprentice_milky': {
      const appTotal = blossom + pearl + aqua + ribbon;
      if (appTotal < APPRENTICE_THRESHOLD) return null;
      return 'princess_milky';
    }
    case 'apprentice_sakura': {
      const appTotal = blossom + pearl + aqua + ribbon;
      if (appTotal < APPRENTICE_THRESHOLD) return null;
      return 'princess_sakura';
    }
    case 'apprentice_wave': {
      const appTotal = blossom + pearl + aqua + ribbon;
      if (appTotal < APPRENTICE_THRESHOLD) return null;
      return 'princess_wave';
    }

    // Terminal forms
    default:
      return null;
  }
}

/** Returns hint text about which materials to focus on */
export function getEvolutionHint(current: CharacterId): string {
  switch (current) {
    case 'spat_beige':
      return 'blossom・ribbon → ピンク系　pearl・aqua → ブルー系';
    case 'baby_pink':
      return 'ribbon 優勢 → 和風　blossom 優勢 → 桜';
    case 'baby_blue':
      return 'pearl 優勢 → ミルキー　aqua 優勢 → 波';
    case 'apprentice_wa':
    case 'apprentice_milky':
    case 'apprentice_sakura':
    case 'apprentice_wave':
      return '素材を集めて princess に進化！';
    default:
      return '最終形態に到達！';
  }
}

/** Returns the next evolution threshold for display */
export function getNextThreshold(current: CharacterId): number {
  switch (current) {
    case 'spat_beige': return SPAT_THRESHOLD;
    case 'baby_pink':
    case 'baby_blue':  return BABY_THRESHOLD;
    case 'apprentice_wa':
    case 'apprentice_milky':
    case 'apprentice_sakura':
    case 'apprentice_wave': return APPRENTICE_THRESHOLD;
    default: return 0;
  }
}
