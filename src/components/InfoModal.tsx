import React from "react";
import { Info, X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-blue-600">
            <Info className="w-6 h-6" />
            <h2 className="text-xl font-bold text-gray-800">使い方</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
              このツールの役割
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              このツールは、JSONフォーマットのテキストデータを読み込み、GitHubリポジトリにIssueとして一括登録（インポート）するためのツールです。
              AI（Geminiなど）に要件定義やタスク分割を行わせ、生成されたJSONをコピー＆ペーストするだけで、簡単にチケット化することができます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
              このツールを使う際の準備
            </h3>
            <ol className="list-decimal list-inside text-gray-600 text-sm leading-relaxed space-y-2">
              <li>
                GitHubの <strong>Personal Access Token (Classic)</strong>{" "}
                を作成します（<code>repo</code> 権限が必要）。
              </li>
              <li>
                ヘッダーの設定ボタン（歯車アイコン）から設定画面を開きます。
              </li>
              <li>
                対象リポジトリの Owner, Repo 名と取得した Token
                を入力して保存します。
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
              Gemini/その他生成AI設定例
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              AIにタスクを分割させる際のプロンプト例です。
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 whitespace-pre-wrap">
              {`以下の要件に基づいてタスクを分割し、指定のJSON配列フォーマットで出力してください。

【要件】
（ここに要件を記載）

【出力フォーマット】
[
  {
    "title": "タスクのタイトル",
    "body": "タスクの詳細説明や完了条件など"
  }
]`}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
              読み込み可能なJSONフォーマット
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              以下の形式のJSON配列のみ読み込み可能です。ルート要素は配列で、各要素には必ず{" "}
              <code>title</code> と <code>body</code>{" "}
              プロパティを含めてください。
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 whitespace-pre-wrap">
              {`[
  {
    "title": "ログイン画面の実装",
    "body": "## 概要\\nログイン画面のUIを実装する。\\n\\n## 完了条件\\n- メールアドレスとパスワードの入力欄があること\\n- ログインボタンがあること"
  },
  {
    "title": "API連携の実装",
    "body": "バックエンドの \`/api/login\` と連携する処理を実装する。"
  }
]`}
            </pre>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
