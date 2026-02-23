import React, { useState, useEffect } from "react";
import type { Issue } from "../types";

interface IssuePreviewProps {
  issues: Issue[];
  onUpdateIssue?: (index: number, updatedIssue: Issue) => void;
}

export const IssuePreview: React.FC<IssuePreviewProps> = ({
  issues,
  onUpdateIssue,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<{
    issue: Issue;
    index: number;
  } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    if (selectedIssue) {
      setEditTitle(selectedIssue.issue.title);
      setEditBody(selectedIssue.issue.body);
    }
  }, [selectedIssue]);

  const handleSave = () => {
    if (selectedIssue && onUpdateIssue) {
      onUpdateIssue(selectedIssue.index, {
        ...selectedIssue.issue,
        title: editTitle,
        body: editBody,
      });
      setSelectedIssue(null);
    }
  };

  if (issues.length === 0) return null;

  const rows = Math.min(selectedIssue?.issue.body.split("\n").length ?? 0, 20);

  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">
        プレビュー
      </h3>
      {issues.slice(0, 3).map((issue, idx) => (
        <div
          key={idx}
          onClick={() => setSelectedIssue({ issue, index: idx })}
          className="bg-white p-4 rounded-lg border border-gray-200 opacity-75 cursor-pointer hover:opacity-100 transition-opacity"
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

      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-bold p-2 border border-gray-300 rounded w-full mr-4 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Issueのタイトル"
              />
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none mt-1"
              >
                &times;
              </button>
            </div>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="bg-gray-50 p-4 rounded text-sm text-gray-800 font-mono overflow-y-auto flex-1 border border-gray-300 w-full resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              rows={rows}
              placeholder="Issueの本文"
            />
            {selectedIssue.issue.labels &&
              selectedIssue.issue.labels.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {selectedIssue.issue.labels.map((l) => (
                    <span
                      key={l}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium"
              >
                閉じる
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
