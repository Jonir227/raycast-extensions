const issueRegex = /\/([^\/]+)\/issues\/(\d+)/;

export function formatIssue(url: string) {
  // 정규표현식 정의
  // url에서 정규표현식에 매칭되는 부분 찾기
  const match = url.match(issueRegex);

  // 매칭된 부분이 있으면 원하는 형식으로 반환
  if (match) {
    return `${match[1]}#${match[2]}`;
  } else {
    // 매칭되지 않으면 빈 문자열 반환
    return "";
  }
}
