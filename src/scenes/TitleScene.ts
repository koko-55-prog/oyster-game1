import Phaser from 'phaser';
import { createButton } from '../ui/Button';
import { GAME_WIDTH, GAME_HEIGHT } from '../data/constants';
import { SaveSystem } from '../systems/SaveSystem';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0520, 0x0a0520, 0x1a1050, 0x1a1050, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Decorative circles
    for (let i = 0; i < 12; i++) {
      const g = this.add.graphics();
      const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
      const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
      const r = Phaser.Math.Between(4, 20);
      const alpha = Phaser.Math.FloatBetween(0.1, 0.4);
      g.fillStyle(0x88ddff, alpha);
      g.fillCircle(x, y, r);
    }

    // Title
    this.add.text(GAME_WIDTH / 2, 200, '姫牡蠣育成', {
      fontSize: '40px',
      color: '#ffe0f0',
      fontStyle: 'bold',
      stroke: '#660033',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 255, 'パズル', {
      fontSize: '30px',
      color: '#ffbbdd',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 310, '稚牡蠣を姫牡蠣に育てよう！', {
      fontSize: '16px',
      color: '#aabbcc',
    }).setOrigin(0.5);

    // Oyster placeholder art
    const art = this.add.graphics();
    art.fillStyle(0xffddee, 0.8);
    art.fillEllipse(GAME_WIDTH / 2, 420, 100, 80);
    art.fillStyle(0xffffff, 0.9);
    art.fillCircle(GAME_WIDTH / 2, 415, 18);
    this.add.text(GAME_WIDTH / 2, 415, '🐚', { fontSize: '36px' }).setOrigin(0.5);

    // Buttons
    createButton(this, {
      x: GAME_WIDTH / 2,
      y: 540,
      text: 'ゲームスタート',
      width: 240,
      height: 54,
      bgColor: 0xee4488,
      onClick: () => {
        this.scene.start('NurtureScene');
      },
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: 610,
      text: '図鑑',
      width: 160,
      height: 44,
      bgColor: 0x446688,
      onClick: () => {
        this.scene.start('EncyclopediaScene');
      },
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: 670,
      text: 'データリセット',
      width: 160,
      height: 36,
      bgColor: 0x554455,
      fontSize: '14px',
      onClick: () => {
        SaveSystem.reset();
        this.scene.restart();
      },
    });

    // Version
    this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'MVP v0.1', {
      fontSize: '11px',
      color: '#445566',
    }).setOrigin(1, 1);
  }
}
