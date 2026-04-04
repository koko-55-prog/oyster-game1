# Asset Manifest

すべての画像は `public/` 以下に配置してください。Vite の静的ファイルサーバーがルートとして提供します。

## 命名規則

| カテゴリ | パターン | 例 |
|---------|---------|---|
| キャラクター立ち絵 | `assets/characters/{stage}/{id}.png` | `assets/characters/spat/spat_beige.png` |
| ポートレート | `assets/portraits/{stage}/{id}.png` | `assets/portraits/spat/spat_beige.png` |
| タイル | `assets/tiles/tile_{type}.png` | `assets/tiles/tile_blossom.png` |
| 障害物 | `assets/obstacles/obstacle_{type}.png` | `assets/obstacles/obstacle_mud.png` |

## キャラクターアセット

### Spat（稚牡蠣）
- `assets/characters/spat/spat_beige.png` — 初期キャラ
- `assets/characters/spat/spat_pink.png`
- `assets/characters/spat/spat_blue.png`

### Baby（ベビー牡蠣）
- `assets/characters/baby/baby_pink.png`
- `assets/characters/baby/baby_blue.png`

### Apprentice（見習い姫）
- `assets/characters/apprentice/apprentice_wa.png`
- `assets/characters/apprentice/apprentice_milky.png`
- `assets/characters/apprentice/apprentice_sakura.png`
- `assets/characters/apprentice/apprentice_wave.png`

### Princess（姫牡蠣）
- `assets/characters/princess/princess_wa.png`
- `assets/characters/princess/princess_milky.png`
- `assets/characters/princess/princess_sakura.png`
- `assets/characters/princess/princess_wave.png`

## ポートレートアセット

立ち絵縮小で代用可。パス構造はキャラクターと同じ。

- `assets/portraits/spat/spat_beige.png`
- `assets/portraits/spat/spat_pink.png`
- `assets/portraits/spat/spat_blue.png`
- `assets/portraits/baby/baby_pink.png`
- `assets/portraits/baby/baby_blue.png`
- `assets/portraits/apprentice/apprentice_wa.png`
- `assets/portraits/apprentice/apprentice_milky.png`
- `assets/portraits/apprentice/apprentice_sakura.png`
- `assets/portraits/apprentice/apprentice_wave.png`
- `assets/portraits/princess/princess_wa.png`
- `assets/portraits/princess/princess_milky.png`
- `assets/portraits/princess/princess_sakura.png`
- `assets/portraits/princess/princess_wave.png`

## タイルアセット

| ファイル | 素材タイプ | 説明 |
|---------|-----------|------|
| `assets/tiles/tile_blossom.png` | blossom | 花びら系 |
| `assets/tiles/tile_pearl.png` | pearl | 真珠系 |
| `assets/tiles/tile_aqua.png` | aqua | 水・泡系 |
| `assets/tiles/tile_shell.png` | shell | 貝殻系 |
| `assets/tiles/tile_ribbon.png` | ribbon | リボン系 |

推奨サイズ: 64×64px（ゲーム内では 44×44 に縮小表示）

## 障害物アセット

| ファイル | ギミック名 | 説明 |
|---------|-----------|------|
| `assets/obstacles/obstacle_mud.png` | ヘドロ汚染 | 床系汚染 |
| `assets/obstacles/obstacle_bubbleblock.png` | 泡ブロック | 被覆ギミック |
| `assets/obstacles/obstacle_shellrock.png` | 封印貝 | 固定障害物 |
| `assets/obstacles/obstacle_redtide.png` | 赤潮ゾーン | 危険床 |
| `assets/obstacles/obstacle_lockedtreasure.png` | 宝晶封印貝 | 報酬付き障害物 |

推奨サイズ: 64×64px

## ロード失敗時の挙動

画像がなくても `FAILED_ASSETS` に記録され、プレースホルダーの色付き図形で代替表示します。
ゲームはクラッシュしません。
