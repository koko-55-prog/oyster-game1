# 姫牡蠣育成パズル

Phaser 3 + TypeScript + Vite で作られたブラウザ動作のシングルプレイ育成型マッチ3パズルゲーム。

## 起動方法

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:3000

# 本番ビルド
npm run build
# → dist/ に静的ファイルが生成される
# → dist/index.html を直接ブラウザで開いても動作する
```

## ディレクトリ構成

```
oyster-game1/
├── index.html              # エントリーポイント
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── assets/             # 画像素材（なくてもプレースホルダー表示）
│       ├── characters/     # キャラクター立ち絵
│       ├── portraits/      # ポートレート
│       ├── tiles/          # マッチ3タイル
│       └── obstacles/      # ギミック画像
├── src/
│   ├── main.ts             # Phaser.Game 初期化
│   ├── types/              # TypeScript 型定義
│   ├── data/               # 定数・進化ルール・ステージ設定
│   ├── game/               # マッチ3ロジック（Phaser非依存）
│   ├── systems/            # SaveSystem, EvolutionSystem
│   ├── scenes/             # Phaser シーン
│   └── ui/                 # 再利用可能なUI部品
└── docs/
    ├── game-spec.md        # ゲーム仕様
    ├── asset-manifest.md   # 画像一覧・命名規則
    └── gimmick-spec.md     # ギミック仕様
```

## ゲーム概要

稚牡蠣を姫牡蠣に育てる育成型マッチ3パズルです。

### 進化ルート

```
spat_beige
  ├→ baby_pink (blossom+ribbon 優勢)
  │    ├→ apprentice_wa (ribbon 優勢)
  │    │    └→ princess_wa
  │    └→ apprentice_sakura (blossom 優勢)
  │         └→ princess_sakura
  └→ baby_blue (pearl+aqua 優勢)
       ├→ apprentice_milky (pearl 優勢)
       │    └→ princess_milky
       └→ apprentice_wave (aqua 優勢)
            └→ princess_wave
```

### 素材
- **blossom**: 花びら（ピンク系に寄与）
- **ribbon**: リボン（ピンク・和風系に寄与）
- **pearl**: 真珠（ブルー・ミルキー系に寄与）
- **aqua**: 水（ブルー・波系に寄与）
- **shell**: 貝殻（補助素材）

## 画像素材の追加方法

1. `public/assets/` 以下の対応するフォルダに PNG を配置
2. ファイル名は `docs/asset-manifest.md` の命名規則に従う
3. 画像がない場合は自動的にプレースホルダー（色付き図形）で代替表示

## 今後の TODO

- [ ] 実際の画像素材を配置する
- [ ] 音楽・SE の追加
- [ ] 進化演出の強化（パーティクル等）
- [ ] ステージ追加（6面以降）
- [ ] チュートリアル画面
- [ ] スコアランキング（ローカル）
- [ ] アニメーション付きタイル消去
- [ ] スペシャルピース（4連マッチ等）
- [ ] lockedtreasure の視覚的フィードバック強化

## iframe 埋め込み

```html
<iframe
  src="./dist/index.html"
  width="390"
  height="844"
  frameborder="0"
  scrolling="no"
  allow="autoplay"
></iframe>
```

## 技術情報

- **Phaser**: 3.88+
- **TypeScript**: 5.5+
- **Vite**: 5.4+
- **保存**: localStorage（キー: `oyster-game-v1`）
- **対象解像度**: 390×844（モバイル縦画面）、FIT スケールでPC対応
