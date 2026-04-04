import Phaser from 'phaser';

export interface ButtonConfig {
  x: number;
  y: number;
  text: string;
  width?: number;
  height?: number;
  fontSize?: string;
  bgColor?: number;
  textColor?: string;
  onClick: () => void;
}

export function createButton(scene: Phaser.Scene, cfg: ButtonConfig): Phaser.GameObjects.Container {
  const w = cfg.width ?? 200;
  const h = cfg.height ?? 48;
  const bg = scene.add.graphics();
  bg.fillStyle(cfg.bgColor ?? 0x5566ee, 1);
  bg.fillRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);
  bg.lineStyle(2, 0xffffff, 0.6);
  bg.strokeRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);

  const label = scene.add.text(0, 0, cfg.text, {
    fontSize: cfg.fontSize ?? '20px',
    color: cfg.textColor ?? '#ffffff',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const container = scene.add.container(cfg.x, cfg.y, [bg, label]);
  container.setSize(w, h);
  container.setInteractive();

  container.on('pointerover', () => {
    bg.clear();
    bg.fillStyle(0x7788ff, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);
    bg.lineStyle(2, 0xffffff, 0.8);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);
  });

  container.on('pointerout', () => {
    bg.clear();
    bg.fillStyle(cfg.bgColor ?? 0x5566ee, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);
    bg.lineStyle(2, 0xffffff, 0.6);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, h * 0.3);
  });

  container.on('pointerdown', () => {
    scene.tweens.add({
      targets: container,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 80,
      yoyo: true,
      onComplete: () => cfg.onClick(),
    });
  });

  return container;
}
