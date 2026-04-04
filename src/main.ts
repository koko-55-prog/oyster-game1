import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './data/constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { NurtureScene } from './scenes/NurtureScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { EvolutionScene } from './scenes/EvolutionScene';
import { EncyclopediaScene } from './scenes/EncyclopediaScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a0a20',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: document.body,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [
    BootScene,
    TitleScene,
    NurtureScene,
    GameScene,
    ResultScene,
    EvolutionScene,
    EncyclopediaScene,
  ],
  input: {
    activePointers: 2,
  },
  render: {
    antialias: true,
    pixelArt: false,
  },
};

new Phaser.Game(config);
