# Gemini - GitHub Task Manager

Geminiが出力したIssueをGitHubに自動登録できるWebアプリです！

## 利用の流れ

1.  **初期設定**: ページ初回アクセス時に表示されるダイアログで、GitHubのパーソナルアクセストークン、オーナー名、リポジトリ名を設定します。設定情報はブラウザのLocalStorageに安全に保存されます。
2.  **GeminiでIssue生成**: 下記の[Gemini用JSONテンプレート](#gemini用jsonテンプレート)を参考に、GeminiにIssue内容を生成させます。
3.  **JSONの貼り付け**: Geminiが出力したJSON文字列をアプリの入力フィールドに貼り付けます。
4.  **バリデーション**: 「構文チェック」を行い、タイトル・本文・ラベルが正しく含まれているか確認します。
5.  **GitHubへ登録**: チェック完了後、送信ボタンを押すとGitHub APIを通じてIssueが一括登録されます。
6.  **データの管理**: 登録済みデータや設定情報は、JSON形式でダウンロード（バックアップ）したり、ファイルからインポートして復元したりすることが可能です。

## GitHub Pagesでの利用方法

本アプリはGitHub Pages上で動作します。

1.  公開URLにアクセスします。
2.  ブラウザのLocalStorageを利用するため、同一ブラウザであれば次回以降ログイン情報の再入力は不要です。
3.  **注意**: セキュリティのため、共有PCなどで利用した後は必要に応じてLocalStorageをクリアしてください。

## Gemini用JSONテンプレート

GeminiにIssueを生成させる際は、以下のフォーマットで出力するよう指示してください。

```json
[
  {
    "title": "Issueのタイトル",
    "body": "Issueの詳細な説明文",
    "labels": ["bug", "enhancement"]
  }
]
```

## エクスポート用JSONテンプレート

「ダウンロード」ボタンで取得できる、設定情報と登録済みIssueを含むファイル形式です。

```json
{
  "config": {
    "token": "ghp_xxxxxxxxxxxx",
    "owner": "your-username",
    "repo": "your-repo-name"
  },
  "issues": [
    {
      "title": "登録済みIssueのタイトル",
      "body": "登録済みIssueの説明",
      "labels": ["label1"],
      "registeredAt": "2023-10-27T00:00:00.000Z"
    }
  ]
}
```

---

### 生成プロンプト（参考）

> Geminiで出力したアイデアを表形式にしてGASで送信する方法から、GeminiでJSON文字列を出力し、GitHub Issuesに登録するような、GitHubPagesに公開する予定のReact Webアプリを作成してほしい。...（以下略）
