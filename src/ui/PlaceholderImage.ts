import Phaser from 'phaser';

/** Set of asset keys that failed to load */
export const FAILED_ASSETS = new Set<string>();

/**
 * Create a placeholder graphic when an image asset is missing.
 * Returns either a Phaser Image (if key loaded) or a Graphics object.
 */
export function createImage(
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  fallbackColor: number = 0x8888ff,
  size: number = 64,
): Phaser.GameObjects.GameObject {
  if (!FAILED_ASSETS.has(key) && scene.textures.exists(key)) {
    const img = scene.add.image(x, y, key);
    img.setDisplaySize(size, size);
    return img;
  }
  // Fallback: colored rectangle
  const g = scene.add.graphics();
  g.fillStyle(fallbackColor, 1);
  g.fillRoundedRect(x - size / 2, y - size / 2, size, size, size * 0.15);
  g.lineStyle(2, 0xffffff, 0.5);
  g.strokeRoundedRect(x - size / 2, y - size / 2, size, size, size * 0.15);
  const label = scene.add.text(x, y, key.split('_').slice(-1)[0], {
    fontSize: `${Math.max(8, size * 0.2)}px`,
    color: '#ffffff',
    align: 'center',
  }).setOrigin(0.5);
  // Return graphics as representative object (label is sibling)
  return g;
}

/**
 * Get display size for an image key, respecting fallback.
 */
export function imageExists(scene: Phaser.Scene, key: string): boolean {
  return !FAILED_ASSETS.has(key) && scene.textures.exists(key);
}
