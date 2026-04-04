export type MaterialType = 'blossom' | 'pearl' | 'aqua' | 'shell' | 'ribbon';

export type MaterialPoints = Record<MaterialType, number>;

export const MATERIAL_TYPES: MaterialType[] = [
  'blossom',
  'pearl',
  'aqua',
  'shell',
  'ribbon',
];

export function emptyMaterials(): MaterialPoints {
  return { blossom: 0, pearl: 0, aqua: 0, shell: 0, ribbon: 0 };
}

export function addMaterials(a: MaterialPoints, b: Partial<MaterialPoints>): MaterialPoints {
  const result = { ...a };
  for (const key of MATERIAL_TYPES) {
    result[key] += b[key] ?? 0;
  }
  return result;
}

export function totalMaterials(m: MaterialPoints): number {
  return MATERIAL_TYPES.reduce((sum, k) => sum + m[k], 0);
}
