import React, { useRef } from "react";
import { Github, Upload, Download, Settings } from "lucide-react";
import type { AppConfig } from "../types";

interface HeaderProps {
  config: AppConfig;
  isConfigValid: boolean;
  onUpload: (file: File) => void;
  onDownload: () => void;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isConfigValid,
  onUpload,
  onDownload,
  onOpenConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = ""; // Reset
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Github className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg text-gray-800">
            Gemini Issue Importer
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isConfigValid && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200 hidden sm:inline-block">
              {config.owner}/{config.repo}
            </span>
          )}
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <button
            onClick={handleUploadClick}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded transition cursor-pointer"
            title="設定と履歴を読み込む"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />

          <button
            onClick={onDownload}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded transition cursor-pointer"
            title="設定と履歴をダウンロード"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenConfig}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded transition cursor-pointer"
            title="設定"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
