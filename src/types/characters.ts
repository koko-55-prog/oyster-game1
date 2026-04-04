export type CharacterStage = 'spat' | 'baby' | 'apprentice' | 'princess';

export type CharacterId =
  | 'spat_beige'
  | 'spat_pink'
  | 'spat_blue'
  | 'baby_pink'
  | 'baby_blue'
  | 'apprentice_wa'
  | 'apprentice_milky'
  | 'apprentice_sakura'
  | 'apprentice_wave'
  | 'princess_wa'
  | 'princess_milky'
  | 'princess_sakura'
  | 'princess_wave';

export interface CharacterInfo {
  id: CharacterId;
  stage: CharacterStage;
  displayName: string;
  portraitKey: string;
  charKey: string;
}
