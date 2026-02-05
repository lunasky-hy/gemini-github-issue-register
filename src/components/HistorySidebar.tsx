import React, { useState } from "react";
import { CheckCircle2, Circle, Trash2, ExternalLink } from "lucide-react";
import type { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  onClear,
}) => {
  const [showPRs, setShowPRs] = useState(false);

  const filteredHistory = history.filter((item) => {
    if (showPRs) return true;
    return !item.isPullRequest;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col max-h-[calc(100vh-8rem)]">
      <div className="p-4 border-b bg-gray-50 flex flex-col gap-2 sticky top-0">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            作成履歴
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="show-prs"
              checked={showPRs}
              onChange={(e) => setShowPRs(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show-prs" className="cursor-pointer select-none">
              PRも含める
            </label>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
              title="履歴をクリア"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            履歴はありません
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isOpened = item.isOpened ?? true;
            return (
              <div
                key={item.id}
                className="p-3 bg-white border border-gray-100 rounded hover:shadow-sm hover:border-gray-300 transition group"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-start gap-2">
                    {isOpened ? (
                      <Circle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    )}
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      {item.isPullRequest && (
                        <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          PR
                        </span>
                      )}
                      #{item.number} {item.title}
                      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    </a>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pl-6">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                    {item.repo}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
