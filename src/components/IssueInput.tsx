import React from "react";
import {
  FileJson,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Github,
} from "lucide-react";
import type { ProcessStatus } from "../types";

interface IssueInputProps {
  jsonInput: string;
  onJsonChange: (val: string) => void;
  validationError: string | null;
  parsedCount: number;
  isProcessing: boolean;
  processStatus: ProcessStatus;
  onImport: () => void;
  isConfigValid: boolean;
}

export const IssueInput: React.FC<IssueInputProps> = ({
  jsonInput,
  onJsonChange,
  validationError,
  parsedCount,
  isProcessing,
  processStatus,
  onImport,
  isConfigValid,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-blue-500" />
          JSON入力
        </h2>
        <div className="text-xs text-gray-500">Geminiからの出力を貼り付け</div>
      </div>
      <div className="p-4">
        <textarea
          className={`w-full h-64 p-4 font-mono text-sm border rounded-lg focus:ring-2 outline-none transition resize-y ${
            validationError
              ? "border-red-300 focus:ring-red-200 bg-red-50"
              : "border-gray-200 focus:ring-blue-500"
          }`}
          placeholder={
            '[\n  {\n    "title": "ログイン機能の実装",\n    "body": "メールアドレスでのログイン機能...",\n    "labels": ["backend", "feature"]\n  }\n]'
          }
          value={jsonInput}
          onChange={(e) => onJsonChange(e.target.value)}
          disabled={isProcessing}
        ></textarea>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between min-h-[24px]">
          {validationError ? (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {validationError}
            </div>
          ) : parsedCount > 0 ? (
            <div className="text-green-600 text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {parsedCount}件のタスクを認識しました
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              JSON配列を入力してください
            </div>
          )}

          <button
            onClick={onImport}
            disabled={
              !!validationError ||
              parsedCount === 0 ||
              isProcessing ||
              !isConfigValid
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                送信中 ({processStatus.success}/{processStatus.total})
              </>
            ) : (
              <>
                <Github className="w-4 h-4" />
                GitHubへ送信
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
