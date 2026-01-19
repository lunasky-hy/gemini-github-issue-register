export interface AppConfig {
  token: string;
  owner: string;
  repo: string;
}

export interface Issue {
  title: string;
  body: string;
  labels?: string[];
}

export interface HistoryItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  repo: string;
}

export interface ProcessStatus {
  success: number;
  total: number;
}

export interface BackupData {
  config: AppConfig;
  history?: HistoryItem[];
  exported_at?: string;
  app_version?: string;
}
