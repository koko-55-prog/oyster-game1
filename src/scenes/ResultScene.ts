import Phaser from 'phaser';
import { createButton } from '../ui/Button';
import { GAME_WIDTH, GAME_HEIGHT, MATERIAL_COLORS } from '../data/constants';
import { MATERIAL_TYPES } from '../types';
import { SaveSystem } from '../systems/SaveSystem';
import { EvolutionSystem } from '../systems/EvolutionSystem';
import type { StageResult } from '../types';
import { totalMaterials } from '../types';
import { STAGES } from '../data/stageConfigs';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  create(data: StageResult): void {
    // Load and update state
    let state = SaveSystem.load();
    state = EvolutionSystem.applyStageResult(state, data.materialsGained, data.stageIndex);

    // Advance stage index if cleared
    if (data.cleared && state.currentStageIndex <= data.stageIndex) {
      state = {
        ...state,
        currentStageIndex: Math.min(data.stageIndex + 1, STAGES.length - 1),
      };
      SaveSystem.save(state);
    }

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0520, 0x0a0520, 0x0d1a30, 0x0d1a30, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    const cleared = data.cleared;
    this.add.text(GAME_WIDTH / 2, 60, cleared ? 'ステージクリア！' : 'ステージ終了', {
      fontSize: '28px',
      color: cleared ? '#ffdd44' : '#aabbcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const stageName = STAGES[data.stageIndex]?.name ?? '';
    this.add.text(GAME_WIDTH / 2, 100, stageName, {
      fontSize: '16px',
      color: '#aabbcc',
    }).setOrigin(0.5);

    // Moves used
    this.add.text(GAME_WIDTH / 2, 135, `使用手数: ${data.movesUsed}`, {
      fontSize: '15px',
      color: '#88aacc',
    }).setOrigin(0.5);

    // Materials gained
    this.add.text(GAME_WIDTH / 2, 175, '獲得素材', {
      fontSize: '18px',
      color: '#ffe0f0',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const gained = data.materialsGained;
    const gainedTotal = totalMaterials(gained);

    let matY = 205;
    MATERIAL_TYPES.forEach((type: typeof MATERIAL_TYPES[number]) => {
      const val = gained[type];
      if (val <= 0) return;
      const dot = this.add.graphics();
      dot.fillStyle(MATERIAL_COLORS[type], 1);
      dot.fillCircle(GAME_WIDTH / 2 - 80, matY + 10, 9);
      this.add.text(GAME_WIDTH / 2 - 65, matY, `${type}`, {
        fontSize: '15px', color: '#ccddee',
      });
      this.add.text(GAME_WIDTH / 2 + 60, matY, `+${val}`, {
        fontSize: '15px', color: '#ffdd88', fontStyle: 'bold',
      }).setOrigin(1, 0);
      matY += 28;
    });

    if (gainedTotal === 0) {
      this.add.text(GAME_WIDTH / 2, matY, '（素材なし）', {
        fontSize: '14px', color: '#556677',
      }).setOrigin(0.5);
      matY += 28;
    }

    matY += 10;

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0x334455, 1);
    div.lineBetween(40, matY, GAME_WIDTH - 40, matY);
    matY += 20;

    // Current totals
    this.add.text(GAME_WIDTH / 2, matY, '累計素材', {
      fontSize: '16px', color: '#ffe0f0', fontStyle: 'bold',
    }).setOrigin(0.5);
    matY += 25;

    MATERIAL_TYPES.forEach((type: typeof MATERIAL_TYPES[number]) => {
      const dot = this.add.graphics();
      dot.fillStyle(MATERIAL_COLORS[type], 1);
      dot.fillCircle(GAME_WIDTH / 2 - 80, matY + 10, 8);
      this.add.text(GAME_WIDTH / 2 - 65, matY, `${type}`, {
        fontSize: '14px', color: '#aabbcc',
      });
      this.add.text(GAME_WIDTH / 2 + 60, matY, String(state.materials[type]), {
        fontSize: '14px', color: '#ffffff',
      }).setOrigin(1, 0);
      matY += 24;
    });

    matY += 10;

    // Check evolution
    const nextId = EvolutionSystem.checkEvolution(state);
    if (nextId) {
      this.add.text(GAME_WIDTH / 2, matY, '✨ 進化できる！', {
        fontSize: '20px', color: '#ffdd44', fontStyle: 'bold',
      }).setOrigin(0.5);
      matY += 35;

      createButton(this, {
        x: GAME_WIDTH / 2, y: matY + 20,
        text: '進化する！',
        width: 200, height: 52,
        bgColor: 0xee4488,
        onClick: () => {
          const evolved = EvolutionSystem.applyEvolution(state, nextId);
          SaveSystem.save(evolved);
          this.scene.start('EvolutionScene', {
            fromId: state.currentCharacter,
            toId: nextId,
          });
        },
      });
      matY += 80;
    } else {
      matY += 20;
    }

    // Back button
    createButton(this, {
      x: GAME_WIDTH / 2,
      y: Math.max(matY + 30, GAME_HEIGHT - 120),
      text: '育成画面に戻る',
      width: 220, height: 48,
      bgColor: 0x446688,
      onClick: () => {
        this.scene.start('NurtureScene');
      },
    });

    createButton(this, {
      x: GAME_WIDTH / 2,
      y: Math.max(matY + 90, GAME_HEIGHT - 60),
      text: 'もう一度プレイ',
      width: 180, height: 40,
      fontSize: '15px',
      bgColor: 0x335544,
      onClick: () => {
        this.scene.start('GameScene', { stageIndex: data.stageIndex });
      },
    });
  }
}
