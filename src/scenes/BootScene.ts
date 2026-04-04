import Phaser from 'phaser';
import { FAILED_ASSETS } from '../ui/PlaceholderImage';
import {
  CHARACTER_ASSET_LIST,
  TILE_ASSET_LIST,
  OBSTACLE_ASSET_LIST,
} from '../data/characterData';
import { GAME_WIDTH, GAME_HEIGHT } from '../data/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Progress bar
    const barBg = this.add.graphics();
    barBg.fillStyle(0x333355, 1);
    barBg.fillRect(GAME_WIDTH * 0.1, GAME_HEIGHT / 2 - 20, GAME_WIDTH * 0.8, 40);

    const bar = this.add.graphics();
    const barX = GAME_WIDTH * 0.1;
    const barY = GAME_HEIGHT / 2 - 20;
    const barW = GAME_WIDTH * 0.8;

    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0x88ddff, 1);
      bar.fillRect(barX + 2, barY + 2, (barW - 4) * value, 36);
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, '姫牡蠣育成パズル', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'Loading...', {
      fontSize: '16px',
      color: '#aabbcc',
    }).setOrigin(0.5);

    // Register error handler BEFORE queueing loads
    this.load.on('loaderror', (file: { key: string }) => {
      FAILED_ASSETS.add(file.key);
    });

    // Queue all assets
    const allAssets = [
      ...CHARACTER_ASSET_LIST,
      ...TILE_ASSET_LIST,
      ...OBSTACLE_ASSET_LIST,
    ];
    for (const { key, path } of allAssets) {
      this.load.image(key, path);
    }
  }

  create(): void {
    this.scene.start('TitleScene');
  }
}
