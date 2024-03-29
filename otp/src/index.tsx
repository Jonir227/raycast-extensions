import { Action, ActionPanel, List } from "@raycast/api";
import { useSQL } from "@raycast/utils";
import { formatDistance } from "date-fns";

const MESSAGE_QUERY = `
SELECT
  text,
  attributedBody,
  datetime(date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime") as date
FROM
  message
ORDER BY
  date
DESC
LIMIT 50
`;

/**
 *
 * TODO: 알수 없는 문자열 처리방법이 없음
 * reference: https://github.com/my-other-github-account/imessage_tools/blob/master/imessage_tools.py
 */
const processAttributedBody = (value: string) => {
  let result = Buffer.from(value).toString("utf-8");
  if (result.includes("NSNumber")) {
    result = result.split("NSNumber")[0];
    if (result.includes("NSString")) {
      result = result.split("NSString")[1];
      if (result.includes("NSDictionary")) {
        result = result.split("NSDictionary")[0];
        result = result.slice(6, -12);
      }
    }
  }
  return result;
};

const OTP_REGEX = /(?<![,.-])\b\d{4,6}\b(?![,.-])/g;

export default function Command() {
  const { data } = useSQL<{ text: string | null; attributedBody: string | null; date: string }>(
    "/Users/user/Library/Messages/chat.db",
    MESSAGE_QUERY,
  );

  const newData = data
    ?.map((msg) => ({
      text: msg.text ?? processAttributedBody(msg.attributedBody ?? ""),
      date: msg.date,
    }))
    .filter((msg) => {
      return ["인증", "코드", "OTP"].some((check) => msg.text.includes(check));
    })
    .map((msg) => ({
      ...msg,
      otp: msg.text.match(OTP_REGEX)?.[0],
    }))
    .filter((msg) => msg.otp);

  return (
    <List>
      {newData?.map((msg) => (
        <List.Item
          key={msg.date}
          title={{ value: msg.otp ?? "", tooltip: msg.text }}
          subtitle={{ value: formatDistance(msg.date, new Date()) }}
          actions={
            <ActionPanel>
              <ActionPanel.Section>{msg.text && <Action.CopyToClipboard content={msg.text} />}</ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
