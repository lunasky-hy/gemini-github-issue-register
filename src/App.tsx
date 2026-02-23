import { useState, useEffect } from "react";
import type {
  AppConfig,
  HistoryItem,
  Issue,
  ProcessStatus,
  BackupData,
} from "./types";
import { ConfigModal } from "./components/ConfigModal";
import { HistorySidebar } from "./components/HistorySidebar";
import { Header } from "./components/Header";
import { IssueInput } from "./components/IssueInput";
import { IssuePreview } from "./components/IssuePreview";
import { PromptHelper } from "./components/PromptHelper";
import { InfoModal } from "./components/InfoModal";
import { createIssue, fetchIssues } from "./utils/github";

function App() {
  // --- State ---
  const [config, setConfig] = useState<AppConfig>({
    token: "",
    owner: "",
    repo: "",
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Input & Processing State
  const [jsonInput, setJsonInput] = useState("");
  const [parsedIssues, setParsedIssues] = useState<Issue[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>({
    success: 0,
    total: 0,
  });

  // --- Effects ---
  useEffect(() => {
    const storedConfig = localStorage.getItem("gemini_issue_importer_config");
    const storedHistory = localStorage.getItem("gemini_issue_importer_history");

    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    } else {
      setIsConfigOpen(true);
    }

    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // --- Handlers ---
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const issues = await fetchIssues(config);
      setHistory(issues);
      localStorage.setItem(
        "gemini_issue_importer_history",
        JSON.stringify(issues),
      );
      alert(`${issues.length}件のIssueを同期しました！`);
    } catch (err: any) {
      console.error("Sync failed:", err);
      alert(`同期に失敗しました: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(
      "gemini_issue_importer_config",
      JSON.stringify(newConfig),
    );
    setIsConfigOpen(false);
  };

  const handleJsonChange = (val: string) => {
    setJsonInput(val);

    if (!val.trim()) {
      setParsedIssues([]);
      setValidationError(null);
      return;
    }

    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        throw new Error("ルート要素は配列（[...]）である必要があります。");
      }

      const isValid = parsed.every((item: any) => item.title && item.body);
      if (!isValid) {
        throw new Error(
          "すべての要素に 'title' と 'body' が含まれている必要があります。",
        );
      }

      setParsedIssues(parsed);
      setValidationError(null);
    } catch (err: any) {
      setParsedIssues([]);
      setValidationError(err.message);
    }
  };

  const handleUpdateIssue = (index: number, updatedIssue: Issue) => {
    const newIssues = [...parsedIssues];
    newIssues[index] = updatedIssue;
    setParsedIssues(newIssues);
    setJsonInput(JSON.stringify(newIssues, null, 2));
  };

  const handleImport = async () => {
    if (parsedIssues.length === 0) return;

    setIsProcessing(true);
    setProcessStatus({ success: 0, total: parsedIssues.length });
    const newHistoryItems: HistoryItem[] = [];

    for (const issue of parsedIssues) {
      try {
        const result = await createIssue(config, issue);
        const historyItem: HistoryItem = {
          id: result.id,
          number: result.number,
          title: result.title,
          html_url: result.html_url,
          created_at: new Date().toISOString(),
          repo: `${config.owner}/${config.repo}`,
        };
        newHistoryItems.push(historyItem);
        setProcessStatus((prev) => ({
          ...prev,
          success: prev.success + 1,
        }));

        await new Promise((r) => setTimeout(r, 500));
      } catch (err: any) {
        console.error("Failed to create issue:", issue.title, err);
        alert(`エラーが発生しました: ${issue.title}\n${err.message}`);
      }
    }

    const updatedHistory = [...newHistoryItems, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(
      "gemini_issue_importer_history",
      JSON.stringify(updatedHistory),
    );

    setIsProcessing(false);
    setJsonInput("");
    setParsedIssues([]);
    alert(`${newHistoryItems.length}件のIssueを作成しました！`);
  };

  const handleDownloadData = () => {
    const data = {
      config: config,
      history: history,
      exported_at: new Date().toISOString(),
      app_version: "1.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gemini-issue-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTasks = async () => {
    setIsSyncing(true);
    try {
      const issues: Array<HistoryItem> = await fetchIssues(config);

      const tasks = issues.filter((issue: HistoryItem) => !issue.isPullRequest);
      const openTasks = tasks.filter((issue: HistoryItem) => issue.isOpened);
      const closedTasks = tasks.filter((issue: HistoryItem) => !issue.isOpened);

      const jsonOutput = {
        onProgress: openTasks.map((it) => {
          return { title: it.title };
        }),
        done: closedTasks.map((it) => {
          return { title: it.title };
        }),
      };
      const blob = new Blob([JSON.stringify(jsonOutput)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`タスク情報の取得に失敗しました: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);

        if (data.config && Array.isArray(data.history)) {
          if (confirm("現在の設定と履歴をファイルの内容で上書きしますか？")) {
            handleFullRestore(data);
            alert("データを復元しました。");
          }
        } else {
          alert("無効なファイル形式です。");
        }
      } catch (err: any) {
        alert("ファイルの読み込みに失敗しました: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleFullRestore = (data: BackupData) => {
    if (data.config) {
      setConfig(data.config);
      localStorage.setItem(
        "gemini_issue_importer_config",
        JSON.stringify(data.config),
      );
    }
    if (data.history) {
      setHistory(data.history);
      localStorage.setItem(
        "gemini_issue_importer_history",
        JSON.stringify(data.history),
      );
    }
    setIsConfigOpen(false);
  };

  const clearHistory = () => {
    if (
      confirm("履歴をすべて削除しますか？（GitHub上のIssueは削除されません）")
    ) {
      setHistory([]);
      localStorage.removeItem("gemini_issue_importer_history");
    }
  };

  const isConfigValid = !!(config.token && config.owner && config.repo);

  return (
    <div className="min-h-screen pb-12">
      <Header
        config={config}
        isConfigValid={isConfigValid}
        onUpload={handleFileUpload}
        onDownload={handleDownloadData}
        onDownloadTasks={handleDownloadTasks}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <IssueInput
            jsonInput={jsonInput}
            onJsonChange={handleJsonChange}
            validationError={validationError}
            parsedCount={parsedIssues.length}
            isProcessing={isProcessing}
            processStatus={processStatus}
            onImport={handleImport}
            isConfigValid={isConfigValid}
          />
          <IssuePreview
            issues={parsedIssues}
            onUpdateIssue={handleUpdateIssue}
          />
          <PromptHelper />
        </div>

        <div className="lg:col-span-1">
          <HistorySidebar history={history} onClear={clearHistory} />
        </div>
      </main>

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => isConfigValid && setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        config={config}
        firstTime={!config.token}
        onImport={handleFullRestore}
      />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

export default App;
