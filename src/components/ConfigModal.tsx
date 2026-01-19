import React, { useState, useEffect, useRef } from "react";
import { Settings, Upload } from "lucide-react";
import type { AppConfig, BackupData } from "../types";

interface ConfigModalProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onClose: () => void;
  isOpen: boolean;
  firstTime: boolean;
  onImport: (data: BackupData) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  onSave,
  onClose,
  isOpen,
  firstTime,
  onImport,
}) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);

        if (data.config) {
          onImport(data);
          alert("設定を読み込みました。");
        } else {
          alert("無効なファイル形式です: configが見つかりません");
        }
      } catch (err: any) {
        alert("ファイルの読み込みに失敗しました: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {firstTime ? "初期設定" : "設定変更"}
          </h2>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".json"
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          GitHubのPersonal Access Token (Classic)
          と連携先のリポジトリ情報を入力してください。
          情報はブラウザのLocalStorageに保存されます。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Token (repo権限必須)
            </label>
            <input
              type="password"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={localConfig.token}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, token: e.target.value })
              }
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner (User/Org)
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={localConfig.owner}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    owner: e.target.value,
                  })
                }
                placeholder="user_name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repo Name
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={localConfig.repo}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, repo: e.target.value })
                }
                placeholder="my-project"
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 justify-left mt-6">
            <button
              onClick={handleUploadClick}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded transition cursor-pointer"
              title="設定ファイルを読み込む"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {!firstTime && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
              >
                キャンセル
              </button>
            )}
            <button
              onClick={() => onSave(localConfig)}
              disabled={
                !localConfig.token || !localConfig.owner || !localConfig.repo
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
