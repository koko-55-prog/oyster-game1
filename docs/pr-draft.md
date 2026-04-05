# PR タイトル案

`feat: 姫牡蠣育成マッチ3パズル MVP 初期実装 + バグ修正`

---

# PR 本文案

## 概要

姫牡蠣を育てる育成型マッチ3パズルゲームの MVP を実装します。
Phaser 3 + TypeScript + Vite 構成で、ブラウザ完結・静的書き出し・iframe 埋め込み対応です。

## 実装内容

### ゲームシステム
- 7×7 マッチ3パズル（5種類のピース）
- 稚牡蠣 → ベビー牡蠣 → 見習い姫 → 姫牡蠣 の4段階進化
- 進化分岐: pink系（wa/sakura）/ blue系（milky/wave）の全8ルート
- 素材ポイント（blossom/pearl/aqua/shell/ribbon）で進化判定
- ステージ5面、各面にギミック配置

### 画面構成（7シーン）
- **BootScene**: アセットプリロード（失敗時 graceful fallback）
- **TitleScene**: タイトル・ゲーム開始・図鑑へ
- **NurtureScene**: 現在のキャラ表示・素材一覧・進化ヒント・ステージ選択
- **GameScene**: マッチ3ゲーム本体（タイル画像レンダリング）
- **ResultScene**: 素材獲得結果・進化判定
- **EvolutionScene**: 進化演出（tween アニメーション）
- **EncyclopediaScene**: 解放済みキャラ図鑑

### ギミック（5種）
- mud（ヘドロ汚染）: 床系、1回マッチで除去
- bubbleblock（泡ブロック）: 被覆系、1回マッチで破壊
- shellrock（封印貝）: 固定障害物、HP2、隣接マッチでダメージ
- redtide（赤潮ゾーン）: 床系、2回マッチで浄化
- lockedtreasure（宝晶封印貝）: 報酬付き障害物、2回マッチで解放・素材付与

### デバッグ機能
- 素材ポイント +50 一括追加
- 強制進化チェック
- ステージスキップ

## バグ修正

- `EvolutionSystem.ts`: `applyStageResult` の `Math.min` 引数が両辺同じだった問題を修正
  （`STAGES.length - 1` に変更してステージ上限を正しくクランプ）
- `GameScene.ts`: タイル画像をプリロード済みなのに常に色付き四角形で描画していた問題を修正
  （`cellImages` を `Image[][]` に変更し、実際の PNG テクスチャを使用）

## 技術仕様

| 項目 | 内容 |
|------|------|
| フレームワーク | Phaser 3.88.2 + TypeScript 5.5 |
| ビルド | Vite 5.4（静的書き出し `dist/`） |
| 保存 | localStorage のみ（バックエンドなし） |
| 対応画面 | モバイル縦画面優先（390×844）、PC対応 |
| アセット欠損時 | `FAILED_ASSETS` パターンで graceful fallback |

## 動作確認

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # dist/ に静的書き出し
```

NurtureScene の `[DEBUG]` ボタンで素材加算・強制進化・ステージスキップが可能。

## ドキュメント

- `docs/game-spec.md` — ゲーム仕様
- `docs/asset-manifest.md` — アセット一覧・命名規則
- `docs/gimmick-spec.md` — ギミック仕様

## 今後の TODO

- サウンド/BGM
- タイル消滅 tween アニメーション
- スワップ移動アニメーション
- 4連鎖以上の特殊ピース
- チュートリアル画面
- ポートレート画像の追加（現状はキャラ画像で代用・fallback）
