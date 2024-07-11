import { List, ActionPanel, Action, Detail, Color, Icon } from "@raycast/api";
import { useQuery } from "@tanstack/react-query";
import { getMyIssueQuery } from "./query";
import { useDeferredValue, useState } from "react";
import { formatIssue } from "./utils";
import { components } from "@octokit/openapi-types";
import { differenceInDays, format } from "date-fns";

type DetailProps = components["schemas"]["issue-search-result-item"];

const DetailComponent = (issue: DetailProps) => {
  return (
    <Detail
      navigationTitle={issue.title}
      markdown={issue.body}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={issue.html_url} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="title" text={issue.title} />
          <Detail.Metadata.Link title="url" target={issue.html_url} text={formatIssue(issue.html_url)} />
          <Detail.Metadata.Label
            title="author"
            text={issue.user?.login ?? ""}
            icon={{
              source: issue.user?.avatar_url ?? "",
              fallback: Icon.PersonCircle,
            }}
          />
          <Detail.Metadata.TagList title="assignees">
            {issue.assignees?.map((v) => (
              <Detail.Metadata.TagList.Item
                key={v.login}
                text={v.login}
                color={Color.SecondaryText}
                icon={{
                  source: v.avatar_url,
                  fallback: Icon.PersonCircle,
                }}
              />
            ))}
          </Detail.Metadata.TagList>
          <Detail.Metadata.TagList title="labels">
            {issue.labels.map((v) => (
              <Detail.Metadata.TagList.Item key={v.id} text={v.name ?? ""} color={v.color} />
            ))}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Label title="created" text={format(issue.created_at, "yyyy-MM-dd hh:mm")} />
          <Detail.Metadata.Label title="updated" text={format(issue.updated_at, "yyyy-MM-dd hh:mm")} />
        </Detail.Metadata>
      }
    />
  );
};

const getIssueTintColor = (issue: DetailProps) => {
  const days = differenceInDays(new Date(), issue.updated_at);
  if (days < 30) {
    return Color.Green;
  }
  if (days < 60) {
    return Color.Yellow;
  }
  return Color.SecondaryText;
};

const Issues = () => {
  const [keyword, setKeyword] = useState("");
  const searchKeyword = useDeferredValue(keyword);
  const { data, isLoading } = useQuery(getMyIssueQuery(searchKeyword));

  return (
    <List filtering={false} onSearchTextChange={setKeyword} isLoading={isLoading}>
      {data?.items.map((issue) => (
        <List.Item
          key={issue.node_id}
          title={{ value: issue.title, tooltip: JSON.stringify(issue.text_matches) }}
          subtitle={formatIssue(issue.html_url)}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<DetailComponent {...issue} />} />
            </ActionPanel>
          }
          icon={{ source: Icon.ExclamationMark, tintColor: getIssueTintColor(issue) }}
        />
      ))}
    </List>
  );
};

export default Issues;
