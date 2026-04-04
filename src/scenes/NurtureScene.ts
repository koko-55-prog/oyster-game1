import Phaser from 'phaser';
import { createButton } from '../ui/Button';
import { MaterialBar } from '../ui/MaterialBar';
import { GAME_WIDTH, GAME_HEIGHT, MATERIAL_COLORS } from '../data/constants';
import { MATERIAL_TYPES } from '../types';
import { SaveSystem } from '../systems/SaveSystem';
import { EvolutionSystem } from '../systems/EvolutionSystem';
import { CHARACTER_MAP } from '../data/characterData';
import { getEvolutionHint, getNextThreshold } from '../data/evolutionRules';
import { imageExists } from '../ui/PlaceholderImage';
import type { GameState } from '../types';
import { STAGES } from '../data/stageConfigs';
import { totalMaterials } from '../types';

export class NurtureScene extends Phaser.Scene {
  private state!: GameState;

  constructor() {
    super({ key: 'NurtureScene' });
  }

  create(): void {
    this.state = SaveSystem.load();
    this.buildUI();
  }

  private buildUI(): void {
    // Clear previous children
    this.children.removeAll(true);

    const state = this.state;
    const charInfo = CHARACTER_MAP[state.currentCharacter];

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0520, 0x0a0520, 0x0d1a30, 0x0d1a30, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Header
    this.add.text(GAME_WIDTH / 2, 28, '育成', {
      fontSize: '22px',
      color: '#ffddee',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Character display area
    const charY = 220;
    const charKey = charInfo.charKey;

    if (imageExists(this, charKey)) {
      const img = this.add.image(GAME_WIDTH / 2, charY, charKey);
      img.setDisplaySize(180, 180);
    } else {
      this.drawCharPlaceholder(GAME_WIDTH / 2, charY, 160, state.currentCharacter);
    }

    // Character name
    this.add.text(GAME_WIDTH / 2, charY + 100, charInfo.displayName, {
      fontSize: '18px',
      color: '#ffe0f0',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stage label
    const stageLabel = ['稚牡蠣', 'ベビー牡蠣', '見習い姫', '姫牡蠣'][
      ['spat', 'baby', 'apprentice', 'princess'].indexOf(charInfo.stage)
    ];
    this.add.text(GAME_WIDTH / 2, charY + 125, `【${stageLabel}】`, {
      fontSize: '14px',
      color: '#aabbcc',
    }).setOrigin(0.5);

    // Material points display
    this.add.text(20, 360, '所持素材', {
      fontSize: '14px',
      color: '#aabbcc',
    });

    const matStartY = 385;
    const matH = 26;
    MATERIAL_TYPES.forEach((type: typeof MATERIAL_TYPES[number], i: number) => {
      const y = matStartY + i * matH;
      // color dot
      const dot = this.add.graphics();
      dot.fillStyle(MATERIAL_COLORS[type], 1);
      dot.fillCircle(32, y + 8, 8);
      this.add.text(48, y, type, { fontSize: '14px', color: '#ccddee' });
      this.add.text(GAME_WIDTH - 20, y, String(state.materials[type]), {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(1, 0);
    });

    // Evolution hint
    const total = totalMaterials(state.materials);
    const threshold = getNextThreshold(state.currentCharacter);
    const hint = getEvolutionHint(state.currentCharacter);

    this.add.text(20, matStartY + MATERIAL_TYPES.length * matH + 10, hint, {
      fontSize: '12px',
      color: '#ffbbdd',
      wordWrap: { width: GAME_WIDTH - 40 },
    });

    if (threshold > 0) {
      const progress = Math.min(total / threshold, 1);
      const barX = 20;
      const barY = matStartY + MATERIAL_TYPES.length * matH + 38;
      const barW = GAME_WIDTH - 40;
      const barH = 14;
      const barBg = this.add.graphics();
      barBg.fillStyle(0x223344, 1);
      barBg.fillRoundedRect(barX, barY, barW, barH, 7);
      const barFill = this.add.graphics();
      barFill.fillStyle(0xee88aa, 1);
      barFill.fillRoundedRect(barX, barY, barW * progress, barH, 7);
      this.add.text(GAME_WIDTH / 2, barY + barH + 6, `${total} / ${threshold}`, {
        fontSize: '12px',
        color: '#aabbcc',
      }).setOrigin(0.5);
    }

    // Buttons
    const btnY = GAME_HEIGHT - 160;
    const stageIdx = Math.min(state.currentStageIndex, STAGES.length - 1);
    const stage = STAGES[stageIdx];
    createButton(this, {
      x: GAME_WIDTH / 2,
      y: btnY,
      text: `ステージ ${stage.id}「${stage.name}」`,
      width: 300,
      height: 52,
      bgColor: 0xee4488,
      onClick: () => {
        this.scene.start('GameScene', { stageIndex: stageIdx });
      },
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: btnY + 70,
      text: '図鑑',
      width: 140,
      height: 40,
      bgColor: 0x446688,
      fontSize: '16px',
      onClick: () => {
        this.scene.start('EncyclopediaScene');
      },
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: btnY + 120,
      text: 'タイトルへ',
      width: 140,
      height: 36,
      bgColor: 0x334455,
      fontSize: '14px',
      onClick: () => {
        this.scene.start('TitleScene');
      },
    });

    // Debug button (small, top-right)
    this.addDebugButton();
  }

  private drawCharPlaceholder(x: number, y: number, size: number, id: string): void {
    const colors: Record<string, number> = {
      spat_beige: 0xf5deb3, spat_pink: 0xffaabb, spat_blue: 0x88bbff,
      baby_pink: 0xff77aa, baby_blue: 0x5599ff,
      apprentice_wa: 0xff4488, apprentice_milky: 0xeeccff,
      apprentice_sakura: 0xff88aa, apprentice_wave: 0x33aaff,
      princess_wa: 0xff2266, princess_milky: 0xcc88ff,
      princess_sakura: 0xff6699, princess_wave: 0x0088ff,
    };
    const color = colors[id] ?? 0x8888ff;
    const g = this.add.graphics();
    g.fillStyle(color, 0.9);
    g.fillEllipse(x, y, size, size);
    g.lineStyle(3, 0xffffff, 0.7);
    g.strokeEllipse(x, y, size, size);
    this.add.text(x, y, '🐚', { fontSize: '48px' }).setOrigin(0.5);
  }

  private addDebugButton(): void {
    const btn = this.add.text(GAME_WIDTH - 10, 10, '[DEBUG]', {
      fontSize: '11px',
      color: '#556677',
    }).setOrigin(1, 0).setInteractive();

    btn.on('pointerdown', () => {
      this.showDebugPanel();
    });
  }

  private showDebugPanel(): void {
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.85);
    panel.fillRoundedRect(30, 100, GAME_WIDTH - 60, 300, 16);

    const title = this.add.text(GAME_WIDTH / 2, 120, 'DEBUG PANEL', {
      fontSize: '16px', color: '#ffff00', fontStyle: 'bold',
    }).setOrigin(0.5);

    const items: Phaser.GameObjects.GameObject[] = [panel, title];

    const addMat = createButton(this, {
      x: GAME_WIDTH / 2, y: 175,
      text: '素材 +50 全部',
      width: 220, height: 42, bgColor: 0x228844,
      onClick: () => {
        this.state = EvolutionSystem.debugAddMaterials(this.state, 50);
        items.forEach((o) => o.destroy());
        this.buildUI();
      },
    });
    items.push(addMat);

    const forceEvo = createButton(this, {
      x: GAME_WIDTH / 2, y: 230,
      text: '強制進化チェック',
      width: 220, height: 42, bgColor: 0xaa2288,
      onClick: () => {
        const nextId = EvolutionSystem.checkEvolution(this.state);
        items.forEach((o) => o.destroy());
        if (nextId) {
          this.state = EvolutionSystem.applyEvolution(this.state, nextId);
          this.scene.start('EvolutionScene', {
            fromId: this.state.currentCharacter,
            toId: nextId,
          });
        } else {
          this.buildUI();
        }
      },
    });
    items.push(forceEvo);

    const skipStage = createButton(this, {
      x: GAME_WIDTH / 2, y: 285,
      text: 'ステージスキップ',
      width: 220, height: 42, bgColor: 0x885500,
      onClick: () => {
        this.state = {
          ...this.state,
          currentStageIndex: Math.min(
            this.state.currentStageIndex + 1,
            STAGES.length - 1,
          ),
          stagesCompleted: this.state.stagesCompleted + 1,
        };
        SaveSystem.save(this.state);
        items.forEach((o) => o.destroy());
        this.buildUI();
      },
    });
    items.push(skipStage);

    const close = createButton(this, {
      x: GAME_WIDTH / 2, y: 350,
      text: '閉じる',
      width: 120, height: 36, bgColor: 0x444444,
      fontSize: '14px',
      onClick: () => {
        items.forEach((o) => o.destroy());
      },
    });
    items.push(close);
  }
}
