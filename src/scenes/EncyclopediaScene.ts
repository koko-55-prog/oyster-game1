import Phaser from 'phaser';
import { createButton } from '../ui/Button';
import { GAME_WIDTH, GAME_HEIGHT } from '../data/constants';
import { SaveSystem } from '../systems/SaveSystem';
import { CHARACTER_MAP } from '../data/characterData';
import type { CharacterId } from '../types';
import { imageExists } from '../ui/PlaceholderImage';

const ALL_IDS: CharacterId[] = [
  'spat_beige', 'spat_pink', 'spat_blue',
  'baby_pink', 'baby_blue',
  'apprentice_wa', 'apprentice_milky', 'apprentice_sakura', 'apprentice_wave',
  'princess_wa', 'princess_milky', 'princess_sakura', 'princess_wave',
];

export class EncyclopediaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EncyclopediaScene' });
  }

  create(): void {
    const state = SaveSystem.load();
    const unlocked = new Set(state.unlockedCharacters);

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0520, 0x0a0520, 0x0d1a30, 0x0d1a30, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.text(GAME_WIDTH / 2, 28, '図鑑', {
      fontSize: '24px', color: '#ffddee', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 58, `${unlocked.size} / ${ALL_IDS.length} 解放`, {
      fontSize: '14px', color: '#aabbcc',
    }).setOrigin(0.5);

    // Grid layout: 4 per row
    const cols = 4;
    const thumbSize = 72;
    const padX = (GAME_WIDTH - cols * thumbSize) / (cols + 1);
    const startY = 90;
    const rowH = thumbSize + 30;

    ALL_IDS.forEach((id, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padX + col * (thumbSize + padX) + thumbSize / 2;
      const y = startY + row * rowH + thumbSize / 2;

      if (unlocked.has(id)) {
        this.drawUnlocked(id, x, y, thumbSize);
      } else {
        this.drawLocked(x, y, thumbSize);
      }
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      text: '← 戻る',
      width: 160, height: 44,
      bgColor: 0x334455,
      onClick: () => this.scene.start('NurtureScene'),
    });
  }

  private drawUnlocked(id: CharacterId, x: number, y: number, size: number): void {
    const info = CHARACTER_MAP[id];
    const key = info.charKey;

    if (imageExists(this, key)) {
      const img = this.add.image(x, y, key);
      img.setDisplaySize(size - 8, size - 8);
    } else {
      const stageColors: Record<string, number> = {
        spat: 0xf5deb3, baby: 0xff99cc, apprentice: 0xcc88ff, princess: 0xff4488,
      };
      const color = stageColors[info.stage] ?? 0x8888ff;
      const g = this.add.graphics();
      g.fillStyle(color, 0.9);
      g.fillRoundedRect(x - size / 2, y - size / 2, size, size, 12);
      this.add.text(x, y, '🐚', { fontSize: '24px' }).setOrigin(0.5);
    }

    // Border
    const border = this.add.graphics();
    border.lineStyle(2, 0xffd700, 0.8);
    border.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 12);

    // Name label
    const shortName = info.displayName.replace(/（.*）/, '');
    this.add.text(x, y + size / 2 + 2, shortName, {
      fontSize: '9px', color: '#ffddee', align: 'center',
      wordWrap: { width: size + 10 },
    }).setOrigin(0.5, 0);
  }

  private drawLocked(x: number, y: number, size: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x222233, 0.9);
    g.fillRoundedRect(x - size / 2, y - size / 2, size, size, 12);
    g.lineStyle(2, 0x444455, 1);
    g.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 12);
    this.add.text(x, y, '?', {
      fontSize: '28px', color: '#445566', fontStyle: 'bold',
    }).setOrigin(0.5);
  }
}
