import type { AppConfig, Issue } from "../types";

export const createIssue = async (config: AppConfig, issue: Issue) => {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/issues`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${config.token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels || [],
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || response.statusText);
  }

  return await response.json();
};
