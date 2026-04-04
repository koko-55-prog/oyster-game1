import Phaser from 'phaser';
import type { MaterialPoints } from '../types';
import { MATERIAL_COLORS } from '../data/constants';
import { MATERIAL_TYPES } from '../types';

/**
 * A horizontal strip showing current material points.
 * Call update() to refresh values.
 */
export class MaterialBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private labels: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, width: number) {
    this.scene = scene;

    const bg = scene.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRect(-width / 2, -30, width, 60);

    const objects: Phaser.GameObjects.GameObject[] = [bg];

    const slotW = width / MATERIAL_TYPES.length;
    MATERIAL_TYPES.forEach((type: typeof MATERIAL_TYPES[number], i: number) => {
      const sx = -width / 2 + slotW * i + slotW / 2;

      // Color dot
      const dot = scene.add.graphics();
      dot.fillStyle(MATERIAL_COLORS[type], 1);
      dot.fillCircle(sx, -10, 8);
      objects.push(dot);

      // Type initial label
      const typeLabel = scene.add.text(sx, -10, type[0].toUpperCase(), {
        fontSize: '9px',
        color: '#000000',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      objects.push(typeLabel);

      // Value label
      const val = scene.add.text(sx, 8, '0', {
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.labels.push(val);
      objects.push(val);
    });

    this.container = scene.add.container(x, y, objects);
  }

  update(materials: MaterialPoints): void {
    MATERIAL_TYPES.forEach((type: typeof MATERIAL_TYPES[number], i: number) => {
      this.labels[i].setText(String(materials[type]));
    });
  }

  setDepth(d: number): this {
    this.container.setDepth(d);
    return this;
  }
}
