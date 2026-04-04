# ゲーム仕様書

## 概要

**タイトル**: 姫牡蠣育成パズル  
**ジャンル**: 育成型マッチ3パズル  
**ターゲット**: モバイル縦画面優先、PC対応  
**保存**: localStorage のみ（`oyster-game-v1` キー）

---

## 進化ライン

### Stage 0: Spat（稚牡蠣）
- 初期キャラ: `spat_beige`
- 進化先: blossom+ribbon が優勢 → `baby_pink`、pearl+aqua が優勢 → `baby_blue`
- 進化条件: 全素材合計 ≥ 100

### Stage 1: Baby（ベビー牡蠣）
- `baby_pink` → ribbon > blossom なら `apprentice_wa`、それ以外は `apprentice_sakura`
- `baby_blue` → pearl > aqua なら `apprentice_milky`、それ以外は `apprentice_wave`
- 進化条件: pink系素材合計 or blue系素材合計 ≥ 150

### Stage 2: Apprentice（見習い姫）
- 1:1 で princess に進化
- `apprentice_wa` → `princess_wa`
- `apprentice_milky` → `princess_milky`
- `apprentice_sakura` → `princess_sakura`
- `apprentice_wave` → `princess_wave`
- 進化条件: 全主要素材合計 ≥ 200

### Stage 3: Princess（姫牡蠣）
- 最終形態

---

## 素材カテゴリ

| 素材 | 系統 | 役割 |
|------|------|------|
| blossom | 花 | pink系進化に寄与 |
| ribbon | 花 | pink系進化に寄与（wa寄り） |
| pearl | 真珠 | blue系進化に寄与 |
| aqua | 水 | blue系進化に寄与（wave寄り） |
| shell | 貝 | 補助・スコア用途 |

---

## マッチ3ルール

- 盤面: 7×7
- ピース: 5種類（blossom / pearl / aqua / shell / ribbon）
- 3つ以上の同種ピースが縦または横に並ぶと消える
- 消えた後は上から落下し、空きを補充
- 連鎖（cascade）は自動処理

---

## ステージ構成

| ステージ | 名称 | 手数 | ギミック |
|---------|------|------|---------|
| 1 | なぎさの浜 | 30 | なし |
| 2 | ヘドロの入江 | 25 | mud |
| 3 | 泡の洞窟 | 25 | bubbleblock + mud |
| 4 | 封印の礁 | 20 | shellrock + mud |
| 5 | 赤潮の海峡 | 20 | redtide + lockedtreasure + shellrock |

---

## 画面フロー

```
BootScene → TitleScene → NurtureScene → GameScene → ResultScene
                                               ↕ (evolution)
                                          EvolutionScene → NurtureScene
                ↓
          EncyclopediaScene
```

---

## デバッグ機能

NurtureScene右上の `[DEBUG]` ボタン:
- 全素材 +50
- 強制進化チェック・実行
- ステージスキップ

GameScene右上の `[D]` ボタン:
- セッション素材に +50（全種）

---

## 技術スタック

- Phaser 3.88+
- TypeScript 5.5+
- Vite 5.4+
- localStorage（バックエンドなし）

---

## 定数（src/data/constants.ts）

```typescript
BOARD_SIZE = 7
MATCH_MIN = 3
CELL_SIZE = 52
GAME_WIDTH = 390
GAME_HEIGHT = 844
SPAT_THRESHOLD = 100
BABY_THRESHOLD = 150
APPRENTICE_THRESHOLD = 200
POINTS_PER_MATCH = 5
```
