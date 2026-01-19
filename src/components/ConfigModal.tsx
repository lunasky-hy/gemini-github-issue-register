import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import type { AppConfig } from "../types";

interface ConfigModalProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onClose: () => void;
  isOpen: boolean;
  firstTime: boolean;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  onSave,
  onClose,
  isOpen,
  firstTime,
}) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {firstTime ? "初期設定" : "設定変更"}
        </h2>
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
  );
};
