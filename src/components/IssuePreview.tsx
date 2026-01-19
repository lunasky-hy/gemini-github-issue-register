import React from "react";
import type { Issue } from "../types";

interface IssuePreviewProps {
  issues: Issue[];
}

export const IssuePreview: React.FC<IssuePreviewProps> = ({ issues }) => {
  if (issues.length === 0) return null;

  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">
        プレビュー
      </h3>
      {issues.slice(0, 3).map((issue, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-lg border border-gray-200 opacity-75"
        >
          <div className="font-bold text-gray-800 mb-1">{issue.title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{issue.body}</div>
          <div className="mt-2 flex gap-1">
            {issue.labels?.map((l) => (
              <span
                key={l}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      ))}
      {issues.length > 3 && (
        <div className="text-center text-sm text-gray-500 py-2">
          他 {issues.length - 3} 件...
        </div>
      )}
    </div>
  );
};
