import { Octokit } from "@octokit/core";
import { preference } from "./preference";
import { queryOptions } from "@tanstack/react-query";

const GHE_URL = `${preference.gheUrl}api/v3`;
const octokit = new Octokit({ auth: preference.gheToken, baseUrl: GHE_URL });

const getMyIssue = async ({ queryKey: [, keyword] }: { queryKey: [string, string | undefined] }) => {
  const data = await octokit.request("GET /search/issues", {
    order: "desc",
    sort: "updated",
    q: `assignee:@me is:open is:issue ${keyword ?? ""}`,
  });

  return data.data;
};

export const getMyIssueQuery = (keyword?: string) =>
  queryOptions({
    queryKey: ["myIssue", keyword] as const,
    queryFn: getMyIssue,
  });
