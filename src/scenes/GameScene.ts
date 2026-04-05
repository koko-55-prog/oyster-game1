import Phaser from 'phaser';
import { Board } from '../game/Board';
import { MaterialBar } from '../ui/MaterialBar';
import { createButton } from '../ui/Button';
import {
  BOARD_SIZE,
  CELL_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT,
  MATERIAL_COLORS,
  DEBUG_MATERIAL_BONUS,
} from '../data/constants';
import { STAGES, StageConfig } from '../data/stageConfigs';
import { SaveSystem } from '../systems/SaveSystem';
import { EvolutionSystem } from '../systems/EvolutionSystem';
import type { Position, StageResult, MaterialPoints } from '../types';
import { emptyMaterials, addMaterials, MATERIAL_TYPES } from '../types';
import { FAILED_ASSETS } from '../ui/PlaceholderImage';

const BOARD_LEFT = (GAME_WIDTH - BOARD_SIZE * CELL_SIZE) / 2;
const BOARD_TOP = 110;

export class GameScene extends Phaser.Scene {
  private board!: Board;
  private stage!: StageConfig;
  private stageIndex!: number;
  private movesLeft!: number;
  private sessionMaterials!: MaterialPoints;

  private cellImages: Phaser.GameObjects.Image[][] = [];
  private floorGfx: Phaser.GameObjects.Graphics[][] = [];
  private obstacleGfx: Phaser.GameObjects.Graphics[][] = [];
  private coverGfx: Phaser.GameObjects.Graphics[][] = [];

  private selectedPos: Position | null = null;
  private isAnimating = false;

  private movesText!: Phaser.GameObjects.Text;
  private matBar!: MaterialBar;
  private stageText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { stageIndex?: number }): void {
    this.stageIndex = data.stageIndex ?? 0;
    this.stage = STAGES[Math.min(this.stageIndex, STAGES.length - 1)];
    this.movesLeft = this.stage.moveLimit;
    this.sessionMaterials = emptyMaterials();
    this.selectedPos = null;
    this.isAnimating = false;
    this.cellImages = [];
    this.floorGfx = [];
    this.obstacleGfx = [];
    this.coverGfx = [];
  }

  create(): void {
    // Board init
    this.board = new Board();
    this.board.applyObstacles(this.stage.obstacles);
    this.board.ensurePlayable();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a20, 0x0a0a20, 0x0d1530, 0x0d1530, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Header
    this.stageText = this.add.text(GAME_WIDTH / 2, 18, `Lv${this.stage.id} ${this.stage.name}`, {
      fontSize: '16px',
      color: '#aabbcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.movesText = this.add.text(GAME_WIDTH / 2, 44, `残り ${this.movesLeft} 手`, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Board border
    const borderGfx = this.add.graphics();
    borderGfx.lineStyle(2, 0x334466, 1);
    borderGfx.strokeRect(
      BOARD_LEFT - 2,
      BOARD_TOP - 2,
      BOARD_SIZE * CELL_SIZE + 4,
      BOARD_SIZE * CELL_SIZE + 4,
    );

    // Find a valid initial tile texture (fallback to first available)
    const initTileKey = MATERIAL_TYPES.map((t) => `tile_${t}`)
      .find((k) => this.textures.exists(k) && !FAILED_ASSETS.has(k)) ?? '';

    // Initialize cell rendering arrays
    for (let r = 0; r < BOARD_SIZE; r++) {
      this.cellImages.push([]);
      this.floorGfx.push([]);
      this.obstacleGfx.push([]);
      this.coverGfx.push([]);
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.floorGfx[r].push(this.add.graphics());
        this.obstacleGfx[r].push(this.add.graphics());
        // Pre-create Image objects for tile rendering (invisible until needed)
        const img = initTileKey
          ? this.add.image(this.cellX(c), this.cellY(r), initTileKey)
          : this.add.image(this.cellX(c), this.cellY(r), '__DEFAULT');
        img.setDisplaySize(CELL_SIZE - 8, CELL_SIZE - 8);
        img.setAlpha(0);
        this.cellImages[r].push(img);
        this.coverGfx[r].push(this.add.graphics());
      }
    }

    // Draw initial board
    this.renderBoard();

    // Input
    this.input.on('pointerdown', this.onPointerDown, this);

    // Material bar at bottom
    this.matBar = new MaterialBar(this, GAME_WIDTH / 2, GAME_HEIGHT - 45, GAME_WIDTH - 20);
    this.matBar.setDepth(10);
    this.matBar.update(this.sessionMaterials);

    // Back button
    createButton(this, {
      x: 44, y: 72,
      text: '← 戻る',
      width: 80, height: 30,
      fontSize: '13px',
      bgColor: 0x334455,
      onClick: () => {
        if (!this.isAnimating) this.exitToNurture(false);
      },
    });

    // Debug button
    const dbgBtn = this.add.text(GAME_WIDTH - 10, 10, '[D]', {
      fontSize: '12px', color: '#556677',
    }).setOrigin(1, 0).setInteractive();
    dbgBtn.on('pointerdown', () => this.toggleDebug());
  }

  private cellX(col: number): number {
    return BOARD_LEFT + col * CELL_SIZE + CELL_SIZE / 2;
  }
  private cellY(row: number): number {
    return BOARD_TOP + row * CELL_SIZE + CELL_SIZE / 2;
  }

  private renderBoard(): void {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.renderCell(r, c);
      }
    }
  }

  private renderCell(r: number, c: number): void {
    const cell = this.board.grid[r][c];
    const x = this.cellX(c);
    const y = this.cellY(r);
    const cs = CELL_SIZE;

    // --- Floor gimmick layer ---
    const fg = this.floorGfx[r][c];
    fg.clear();
    const isSelected = this.selectedPos?.row === r && this.selectedPos?.col === c;

    if (cell.floorGimmick === 'mud') {
      fg.fillStyle(0x553311, 0.8);
      fg.fillRect(x - cs / 2, y - cs / 2, cs, cs);
      if (!FAILED_ASSETS.has('obstacle_mud')) {
        // Draw image if available (handled differently, skip for now)
      }
      fg.fillStyle(0x885522, 0.5);
      fg.fillRect(x - cs / 2 + 2, y - cs / 2 + 2, cs - 4, cs - 4);
    } else if (cell.floorGimmick === 'redtide') {
      fg.fillStyle(0xaa1100, 0.6);
      fg.fillRect(x - cs / 2, y - cs / 2, cs, cs);
      fg.fillStyle(0xff3300, 0.3);
      fg.fillRect(x - cs / 2 + 3, y - cs / 2 + 3, cs - 6, cs - 6);
    } else {
      // Normal cell background
      const even = (r + c) % 2 === 0;
      fg.fillStyle(even ? 0x1a2a3a : 0x1a2540, 0.9);
      fg.fillRect(x - cs / 2, y - cs / 2, cs, cs);
    }

    // Hover/selected highlight
    if (isSelected) {
      fg.lineStyle(3, 0xffff00, 1);
      fg.strokeRect(x - cs / 2 + 1, y - cs / 2 + 1, cs - 2, cs - 2);
    }

    // --- Obstacle layer ---
    const og = this.obstacleGfx[r][c];
    og.clear();
    if (cell.obstacle === 'shellrock') {
      og.fillStyle(0x667788, 1);
      og.fillRoundedRect(x - cs / 2 + 2, y - cs / 2 + 2, cs - 4, cs - 4, 6);
      og.lineStyle(2, 0x99aabb, 1);
      og.strokeRoundedRect(x - cs / 2 + 2, y - cs / 2 + 2, cs - 4, cs - 4, 6);
      // HP indicator
      for (let hp = 0; hp < cell.obstacleHp; hp++) {
        og.fillStyle(0xffffff, 0.8);
        og.fillCircle(x - 6 + hp * 12, y + cs / 2 - 8, 4);
      }
    } else if (cell.obstacle === 'lockedtreasure') {
      og.fillStyle(0xaa8800, 1);
      og.fillRoundedRect(x - cs / 2 + 2, y - cs / 2 + 2, cs - 4, cs - 4, 6);
      og.lineStyle(2, 0xffdd44, 1);
      og.strokeRoundedRect(x - cs / 2 + 2, y - cs / 2 + 2, cs - 4, cs - 4, 6);
      og.fillStyle(0xffdd44, 0.9);
      og.fillCircle(x, y, 8);
    }

    // --- Piece layer ---
    const img = this.cellImages[r][c];

    if (cell.piece && !cell.obstacle) {
      const piece = cell.piece;
      const tileKey = `tile_${piece}`;

      if (!FAILED_ASSETS.has(tileKey) && this.textures.exists(tileKey)) {
        // Use actual tile image
        img.setTexture(tileKey);
        img.setDisplaySize(CELL_SIZE - 8, CELL_SIZE - 8);
        img.setAlpha(1);
        img.setTint(isSelected ? 0xffff88 : 0xffffff);
      } else {
        // Fallback: draw colored rectangle in floor graphics layer
        img.setAlpha(0);
        const color = MATERIAL_COLORS[piece];
        const pad = 4;
        fg.fillStyle(color, 1);
        fg.fillRoundedRect(x - cs / 2 + pad, y - cs / 2 + pad, cs - pad * 2, cs - pad * 2, 8);
        fg.lineStyle(2, 0xffffff, 0.4);
        fg.strokeRoundedRect(x - cs / 2 + pad, y - cs / 2 + pad, cs - pad * 2, cs - pad * 2, 8);
        fg.fillStyle(0xffffff, 0.25);
        fg.fillEllipse(x - cs / 4, y - cs / 4, cs / 3, cs / 5);
        if (isSelected) {
          fg.lineStyle(3, 0xffff00, 1);
          fg.strokeRoundedRect(x - cs / 2 + pad, y - cs / 2 + pad, cs - pad * 2, cs - pad * 2, 8);
        }
      }
    } else {
      img.setAlpha(0);
    }

    // --- Cover layer ---
    const cg = this.coverGfx[r][c];
    cg.clear();
    if (cell.cover === 'bubbleblock') {
      cg.lineStyle(3, 0x88ddff, 0.8);
      cg.strokeCircle(x, y, cs / 2 - 4);
      cg.fillStyle(0x88ddff, 0.2);
      cg.fillCircle(x, y, cs / 2 - 4);
    }
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.isAnimating) return;

    const px = pointer.x;
    const py = pointer.y;
    const col = Math.floor((px - BOARD_LEFT) / CELL_SIZE);
    const row = Math.floor((py - BOARD_TOP) / CELL_SIZE);

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      this.selectedPos = null;
      this.renderBoard();
      return;
    }

    const cell = this.board.grid[row][col];
    if (cell.obstacle) {
      this.selectedPos = null;
      this.renderBoard();
      return;
    }

    if (!this.selectedPos) {
      this.selectedPos = { row, col };
      this.renderBoard();
      return;
    }

    const prev = this.selectedPos;
    this.selectedPos = null;

    if (prev.row === row && prev.col === col) {
      this.renderBoard();
      return;
    }

    // Try swap
    this.isAnimating = true;
    const result = this.board.swapAndResolve(prev, { row, col });
    if (!result) {
      // Invalid swap
      this.isAnimating = false;
      this.renderBoard();
      return;
    }

    // Apply multiplier
    const mult = this.stage.rewardMultiplier;
    const gained = emptyMaterials();
    for (const mt of MATERIAL_TYPES) {
      gained[mt] = Math.round(result.materialsGained[mt] * mult);
    }

    this.sessionMaterials = addMaterials(this.sessionMaterials, gained);
    this.movesLeft--;
    this.movesText.setText(`残り ${this.movesLeft} 手`);
    this.matBar.update(this.sessionMaterials);

    this.renderBoard();
    this.isAnimating = false;

    // Animate cleared pieces with a quick flash
    this.cameras.main.flash(80, 255, 255, 255, false);

    // Check win/lose
    if (this.movesLeft <= 0) {
      this.time.delayedCall(300, () => this.exitToNurture(true));
    }
  }

  private exitToNurture(cleared: boolean): void {
    const result: StageResult = {
      stageIndex: this.stageIndex,
      materialsGained: this.sessionMaterials,
      cleared,
      movesUsed: this.stage.moveLimit - this.movesLeft,
    };
    this.scene.start('ResultScene', result);
  }

  private toggleDebug(): void {
    // Add materials for quick testing
    for (const mt of MATERIAL_TYPES) {
      this.sessionMaterials[mt] += DEBUG_MATERIAL_BONUS;
    }
    this.matBar.update(this.sessionMaterials);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '+デバッグ素材', {
      fontSize: '24px', color: '#ffff00', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0).setDepth(20)
      .setAlpha(1);
    this.time.delayedCall(800, () => {});
  }
}
