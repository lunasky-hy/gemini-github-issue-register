import React from "react";

export const PromptHelper: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
      <h3 className="text-sm font-bold text-blue-800 mb-2">
        Geminiへのプロンプト例
      </h3>
      <div className="bg-white p-3 rounded border border-blue-100 text-xs text-gray-600 font-mono">
        以下のアイデアを機能ごとに分割し、以下のJSON形式のリストで出力してください。
        <br />
        [<br />
        &nbsp;&nbsp;{`{ title: "...", body: "...", labels: ["..."] }`}
        <br />]
      </div>
    </div>
  );
};
