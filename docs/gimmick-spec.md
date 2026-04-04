# ギミック仕様

## 1. mud（ヘドロ汚染）

- **asset**: `assets/obstacles/obstacle_mud.png`
- **表示名**: ヘドロ汚染
- **種別**: 床系汚染ギミック
- **優先度**: 高（ステージ2から登場）
- **実装**:
  - `cell.floorGimmick = 'mud'`, `cell.floorHp = 1`
  - そのマスで1回マッチすると除去（`floorHp` を1減らして0になったら `null` にリセット）
  - ピースは通常通り配置・マッチできる
- **MVPでは拡大しない**

## 2. bubbleblock（泡ブロック）

- **asset**: `assets/obstacles/obstacle_bubbleblock.png`
- **表示名**: 泡ブロック
- **種別**: ピース被覆ギミック
- **優先度**: 高（ステージ3から登場）
- **実装**:
  - `cell.cover = 'bubbleblock'`
  - 泡がある間も下のピースは見える（cover は上に重ねて描画）
  - そのマスで1回マッチすると破壊（`cell.cover = null`）
  - ピースのマッチには参加できるが、cover 除去後も通常通り動作する

## 3. shellrock（封印貝）

- **asset**: `assets/obstacles/obstacle_shellrock.png`
- **表示名**: 封印貝
- **種別**: 固定障害物
- **優先度**: 中（ステージ4から登場）
- **実装**:
  - `cell.obstacle = 'shellrock'`, `cell.obstacleHp = 2`
  - そのマスにはピースを配置しない（マッチ不可）
  - 隣接マスでマッチが発生するたびに `obstacleHp` を1減らす
  - `obstacleHp = 0` になると通常マス化
  - HP 残量を白丸の数で表示（2個 → 1個 → 消滅）

## 4. redtide（赤潮ゾーン）

- **asset**: `assets/obstacles/obstacle_redtide.png`
- **表示名**: 赤潮ゾーン
- **種別**: 危険床ギミック
- **優先度**: 中（ステージ5から登場）
- **実装**:
  - `cell.floorGimmick = 'redtide'`, `cell.floorHp = 2`
  - そのマスで2回マッチすると浄化される
  - ピースは配置・マッチ可能
- **MVPでは毒化や拡大は不要**

## 5. lockedtreasure（宝晶封印貝）

- **asset**: `assets/obstacles/obstacle_lockedtreasure.png`
- **表示名**: 宝晶封印貝
- **種別**: 報酬付き特殊ギミック
- **優先度**: 低（ステージ5に1個）
- **実装**:
  - `cell.obstacle = 'lockedtreasure'`, `cell.obstacleHp = 2`
  - そのマスにはピースを配置しない
  - 隣接マッチで `obstacleHp` を1減らす
  - `obstacleHp = 0` になると解放
  - 解放時にランダムな素材タイプに +20pt 付与
- **MVPでは簡易実装でよい**

---

## 設計メモ

```
セル構造:
{
  piece: PieceType | null,
  floorGimmick: 'mud' | 'redtide' | null,   // 床系（下層）
  floorHp: number,
  obstacle: 'shellrock' | 'lockedtreasure' | null,  // 固定障害物（ピース配置不可）
  obstacleHp: number,
  cover: 'bubbleblock' | null,               // 被覆（上層）
}
```

- **mud / redtide** = `floorGimmick`（ピース配置可、マッチ時にhp消費）
- **bubbleblock** = `cover`（ピースの上に重ねる、マッチ時に除去）
- **shellrock / lockedtreasure** = `obstacle`（ピース配置不可、隣接マッチでダメージ）

優先処理順序:
1. マッチ検出
2. マッチセルの `cover` 除去
3. マッチセルの `floorGimmick` HP 減算
4. マッチセルの `piece` 除去
5. 隣接セルの `obstacle` HP 減算
6. 重力 → 補充
