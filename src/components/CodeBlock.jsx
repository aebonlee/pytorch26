// ============================================================
// 실습 코드 블록 (SessionPage·PrereqPage 공용)
// ------------------------------------------------------------
// props.code = { filename: 'xxx.py', source: '코드 문자열' }
//   → 데이터는 src/data/day1~3.js, prereq.js에 정의되어 있다.
// 문법 하이라이터를 일부러 쓰지 않았다(의존성 최소화).
// 복사 버튼은 clipboard API 사용 — https 환경에서만 동작하므로
// 로컬 http 개발 중엔 실패할 수 있다(배포 환경에선 정상).
// ============================================================
import { useState } from 'react'

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
      <pre><code>{code.source}</code></pre>
    </div>
  )
}
