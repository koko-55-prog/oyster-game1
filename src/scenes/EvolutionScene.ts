import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../data/constants';
import { CHARACTER_MAP } from '../data/characterData';
import type { CharacterId } from '../types';
import { imageExists } from '../ui/PlaceholderImage';
import { createButton } from '../ui/Button';

interface EvolutionData {
  fromId: CharacterId;
  toId: CharacterId;
}

export class EvolutionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EvolutionScene' });
  }

  create(data: EvolutionData): void {
    const fromInfo = CHARACTER_MAP[data.fromId];
    const toInfo = CHARACTER_MAP[data.toId];

    // Dark background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Particle-like sparkles
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
      const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
      const r = Phaser.Math.Between(3, 8);
      const g = this.add.graphics();
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.3, 0.9));
      g.fillCircle(x, y, r);
      this.tweens.add({
        targets: g,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: Phaser.Math.Between(500, 1500),
        delay: Phaser.Math.Between(0, 800),
        repeat: -1,
        yoyo: true,
      });
    }

    // "進化！" text
    const evoText = this.add.text(GAME_WIDTH / 2, 120, '✨ 進化！ ✨', {
      fontSize: '36px',
      color: '#ffdd44',
      fontStyle: 'bold',
      stroke: '#aa6600',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: evoText,
      alpha: 1,
      y: 100,
      duration: 600,
      ease: 'Back.Out',
    });

    // From character
    const fromY = 280;
    this.drawCharacter(data.fromId, GAME_WIDTH / 2, fromY, 140);
    const fromLabel = this.add.text(GAME_WIDTH / 2, fromY + 80, fromInfo.displayName, {
      fontSize: '16px', color: '#aabbcc',
    }).setOrigin(0.5);

    // Arrow animation
    const arrow = this.add.text(GAME_WIDTH / 2, fromY + 110, '↓', {
      fontSize: '32px', color: '#ffdd44',
    }).setOrigin(0.5).setAlpha(0);

    // To character (hidden initially)
    const toY = fromY + 170;
    const toContainer = this.add.container(GAME_WIDTH / 2, toY);
    toContainer.setAlpha(0);
    toContainer.setScale(0.3);

    this.drawCharacterInContainer(data.toId, toContainer, 160);

    const toLabel = this.add.text(GAME_WIDTH / 2, toY + 90, toInfo.displayName, {
      fontSize: '20px',
      color: '#ffe0f0',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    // Sequence
    this.time.delayedCall(800, () => {
      // Flash from → show arrow
      this.cameras.main.flash(200, 255, 220, 100);
      this.tweens.add({
        targets: arrow,
        alpha: 1,
        duration: 300,
      });
    });

    this.time.delayedCall(1400, () => {
      // Reveal new character
      this.cameras.main.flash(400, 255, 200, 100);
      this.tweens.add({
        targets: toContainer,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 600,
        ease: 'Back.Out',
      });
      this.tweens.add({
        targets: toLabel,
        alpha: 1,
        duration: 400,
        delay: 200,
      });
      fromLabel.setAlpha(0.3);
    });

    // Continue button
    createButton(this, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 80,
      text: '育成画面へ',
      width: 200,
      height: 50,
      bgColor: 0xee4488,
      onClick: () => {
        this.scene.start('NurtureScene');
      },
    });
  }

  private drawCharacter(id: CharacterId, x: number, y: number, size: number): void {
    const key = `char_${id}`;
    if (imageExists(this, key)) {
      const img = this.add.image(x, y, key);
      img.setDisplaySize(size, size);
    } else {
      this.drawPlaceholderChar(x, y, size, id);
    }
  }

  private drawCharacterInContainer(id: CharacterId, container: Phaser.GameObjects.Container, size: number): void {
    const key = `char_${id}`;
    if (imageExists(this, key)) {
      const img = this.add.image(0, 0, key);
      img.setDisplaySize(size, size);
      container.add(img);
    } else {
      const g = this.add.graphics();
      const colors: Record<string, number> = {
        baby_pink: 0xff77aa, baby_blue: 0x5599ff,
        apprentice_wa: 0xff4488, apprentice_milky: 0xeeccff,
        apprentice_sakura: 0xff88aa, apprentice_wave: 0x33aaff,
        princess_wa: 0xff2266, princess_milky: 0xcc88ff,
        princess_sakura: 0xff6699, princess_wave: 0x0088ff,
      };
      const color = colors[id] ?? 0xaaaaff;
      g.fillStyle(color, 1);
      g.fillCircle(0, 0, size / 2);
      g.lineStyle(4, 0xffffff, 0.8);
      g.strokeCircle(0, 0, size / 2);
      container.add(g);

      const label = this.add.text(0, 0, '🐚', { fontSize: `${size * 0.4}px` }).setOrigin(0.5);
      container.add(label);
    }
  }

  private drawPlaceholderChar(x: number, y: number, size: number, id: string): void {
    const colors: Record<string, number> = {
      spat_beige: 0xf5deb3, baby_pink: 0xff77aa, baby_blue: 0x5599ff,
    };
    const color = colors[id] ?? 0x8888ff;
    const g = this.add.graphics();
    g.fillStyle(color, 0.9);
    g.fillCircle(x, y, size / 2);
    g.lineStyle(3, 0xffffff, 0.7);
    g.strokeCircle(x, y, size / 2);
    this.add.text(x, y, '🐚', { fontSize: `${size * 0.4}px` }).setOrigin(0.5);
  }
}
