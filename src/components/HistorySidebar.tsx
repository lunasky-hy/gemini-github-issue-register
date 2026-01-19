import React from "react";
import { CheckCircle, Trash2, ExternalLink } from "lucide-react";
import type { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col max-h-[calc(100vh-8rem)]">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center sticky top-0">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          作成履歴
        </h2>
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
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            履歴はありません
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-gray-100 rounded hover:shadow-sm hover:border-gray-300 transition group"
            >
              <div className="flex justify-between items-start mb-1">
                <a
                  href={item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline flex items-center gap-1"
                >
                  #{item.number} {item.title}
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                  {item.repo}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
