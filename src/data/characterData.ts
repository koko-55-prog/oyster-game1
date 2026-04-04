import type { CharacterId, CharacterInfo, CharacterStage } from '../types';

function charInfo(
  id: CharacterId,
  stage: CharacterStage,
  displayName: string,
): CharacterInfo {
  const stageFolder = stage;
  return {
    id,
    stage,
    displayName,
    portraitKey: `portrait_${id}`,
    charKey: `char_${id}`,
  };
}

export const CHARACTER_MAP: Record<CharacterId, CharacterInfo> = {
  spat_beige: charInfo('spat_beige', 'spat', '稚牡蠣（ベージュ）'),
  spat_pink:  charInfo('spat_pink',  'spat', '稚牡蠣（ピンク）'),
  spat_blue:  charInfo('spat_blue',  'spat', '稚牡蠣（ブルー）'),
  baby_pink:  charInfo('baby_pink',  'baby', 'ベビー牡蠣（ピンク）'),
  baby_blue:  charInfo('baby_blue',  'baby', 'ベビー牡蠣（ブルー）'),
  apprentice_wa:     charInfo('apprentice_wa',     'apprentice', '見習い姫（和風）'),
  apprentice_milky:  charInfo('apprentice_milky',  'apprentice', '見習い姫（ミルキー）'),
  apprentice_sakura: charInfo('apprentice_sakura', 'apprentice', '見習い姫（桜）'),
  apprentice_wave:   charInfo('apprentice_wave',   'apprentice', '見習い姫（波）'),
  princess_wa:     charInfo('princess_wa',     'princess', '姫牡蠣（和風）'),
  princess_milky:  charInfo('princess_milky',  'princess', '姫牡蠣（ミルキー）'),
  princess_sakura: charInfo('princess_sakura', 'princess', '姫牡蠣（桜）'),
  princess_wave:   charInfo('princess_wave',   'princess', '姫牡蠣（波）'),
};

// Asset paths for BootScene preloading
export const CHARACTER_ASSET_LIST: Array<{ key: string; path: string }> = [
  // characters
  { key: 'char_spat_beige', path: 'assets/characters/spat/spat_beige.png' },
  { key: 'char_spat_pink',  path: 'assets/characters/spat/spat_pink.png' },
  { key: 'char_spat_blue',  path: 'assets/characters/spat/spat_blue.png' },
  { key: 'char_baby_pink',  path: 'assets/characters/baby/baby_pink.png' },
  { key: 'char_baby_blue',  path: 'assets/characters/baby/baby_blue.png' },
  { key: 'char_apprentice_wa',     path: 'assets/characters/apprentice/apprentice_wa.png' },
  { key: 'char_apprentice_milky',  path: 'assets/characters/apprentice/apprentice_milky.png' },
  { key: 'char_apprentice_sakura', path: 'assets/characters/apprentice/apprentice_sakura.png' },
  { key: 'char_apprentice_wave',   path: 'assets/characters/apprentice/apprentice_wave.png' },
  { key: 'char_princess_wa',     path: 'assets/characters/princess/princess_wa.png' },
  { key: 'char_princess_milky',  path: 'assets/characters/princess/princess_milky.png' },
  { key: 'char_princess_sakura', path: 'assets/characters/princess/princess_sakura.png' },
  { key: 'char_princess_wave',   path: 'assets/characters/princess/princess_wave.png' },
  // portraits (fall back to character if missing)
  { key: 'portrait_spat_beige', path: 'assets/portraits/spat/spat_beige.png' },
  { key: 'portrait_spat_pink',  path: 'assets/portraits/spat/spat_pink.png' },
  { key: 'portrait_spat_blue',  path: 'assets/portraits/spat/spat_blue.png' },
  { key: 'portrait_baby_pink',  path: 'assets/portraits/baby/baby_pink.png' },
  { key: 'portrait_baby_blue',  path: 'assets/portraits/baby/baby_blue.png' },
  { key: 'portrait_apprentice_wa',     path: 'assets/portraits/apprentice/apprentice_wa.png' },
  { key: 'portrait_apprentice_milky',  path: 'assets/portraits/apprentice/apprentice_milky.png' },
  { key: 'portrait_apprentice_sakura', path: 'assets/portraits/apprentice/apprentice_sakura.png' },
  { key: 'portrait_apprentice_wave',   path: 'assets/portraits/apprentice/apprentice_wave.png' },
  { key: 'portrait_princess_wa',     path: 'assets/portraits/princess/princess_wa.png' },
  { key: 'portrait_princess_milky',  path: 'assets/portraits/princess/princess_milky.png' },
  { key: 'portrait_princess_sakura', path: 'assets/portraits/princess/princess_sakura.png' },
  { key: 'portrait_princess_wave',   path: 'assets/portraits/princess/princess_wave.png' },
];

export const TILE_ASSET_LIST: Array<{ key: string; path: string }> = [
  { key: 'tile_blossom', path: 'assets/tiles/tile_blossom.png' },
  { key: 'tile_pearl',   path: 'assets/tiles/tile_pearl.png' },
  { key: 'tile_aqua',    path: 'assets/tiles/tile_aqua.png' },
  { key: 'tile_shell',   path: 'assets/tiles/tile_shell.png' },
  { key: 'tile_ribbon',  path: 'assets/tiles/tile_ribbon.png' },
];

export const OBSTACLE_ASSET_LIST: Array<{ key: string; path: string }> = [
  { key: 'obstacle_mud',            path: 'assets/obstacles/obstacle_mud.png' },
  { key: 'obstacle_bubbleblock',    path: 'assets/obstacles/obstacle_bubbleblock.png' },
  { key: 'obstacle_shellrock',      path: 'assets/obstacles/obstacle_shellrock.png' },
  { key: 'obstacle_redtide',        path: 'assets/obstacles/obstacle_redtide.png' },
  { key: 'obstacle_lockedtreasure', path: 'assets/obstacles/obstacle_lockedtreasure.png' },
];
