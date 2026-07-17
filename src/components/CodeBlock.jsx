// ============================================================
// 실습 코드 블록 (SessionPage·PrereqPage 공용)
// ------------------------------------------------------------
// props.code = { filename: 'xxx.py', source: '코드 문자열' }
//   → 데이터는 src/data/day1~3.js, prereq.js에 정의되어 있다.
// 전체 문법 하이라이터는 일부러 쓰지 않았고(의존성 최소화),
// 파이썬 주석(#...)만 녹색(.code-comment)으로 강조한다
// — 2026-07-17 대표 요청. 복사 버튼은 원본 source 그대로 복사.
// clipboard API는 https 환경 전용이라 로컬 http 개발 중엔
// 복사가 실패할 수 있다(배포 환경에선 정상).
// ============================================================
import { useState } from 'react'

// 한 줄에서 "문자열 밖의 첫 #" 위치를 찾는다 — 따옴표(' ")를
// 추적해 print("#태그") 같은 문자열 안의 #는 주석으로 오인하지
// 않는다. 주석이 없으면 -1 반환. (파이썬 삼중따옴표는 이 과정
// 코드에 등장하지 않으므로 처리하지 않는다)
function findCommentStart(line) {
  let quote = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null
    } else if (ch === "'" || ch === '"') {
      quote = ch
    } else if (ch === '#') {
      return i
    }
  }
  return -1
}

// 코드 문자열을 줄 단위로 나눠, 주석 부분만 <span.code-comment>로
// 감싼 React 노드 배열을 만든다 (하이라이팅은 표시용일 뿐 —
// 복사 버튼은 항상 원본 문자열을 사용한다)
function renderHighlighted(source) {
  return source.split('\n').map((line, i) => {
    const at = findCommentStart(line)
    return (
      <span key={i}>
        {at === -1 ? line : (
          <>
            {line.slice(0, at)}
            <span className="code-comment">{line.slice(at)}</span>
          </>
        )}
        {'\n'}
      </span>
    )
  })
}

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code.source).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div className="code-block">
      <div className="code-head">
        <span>🐍 {code.filename}</span>
        <button className="copy-btn" onClick={copy}>{copied ? '✓ 복사됨' : '복사'}</button>
      </div>
      <pre><code>{renderHighlighted(code.source)}</code></pre>
    </div>
  )
}
