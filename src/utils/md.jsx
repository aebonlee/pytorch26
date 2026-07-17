// ============================================================
// 인라인 마크다운 렌더러 (산문 데이터 → React 노드)
// ------------------------------------------------------------
// 지원 문법 (2026-07-17 대표 지시 — 마크다운을 HTML로 정확 반영):
//   **텍스트**  → <strong> 볼드
//   ==텍스트==  → <mark class="hl"> 형광펜
//   `텍스트`    → <code> 인라인 코드
// 데이터 파일의 p/summary/goal/explain 등 산문 필드에 위 문법을
// 쓰면 각 페이지가 이 함수를 통해 렌더링한다.
// ※ 실습 코드 블록(code.source)에는 적용하지 않는다 —
//   파이썬의 ** 연산자가 볼드로 오인되므로. (CodeBlock은 미사용)
// ============================================================
export default function md(text) {
  if (typeof text !== 'string') return text
  return text.split(/(\*\*[^*]+\*\*|==[^=]+==|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return <mark key={i} className="hl">{part.slice(2, -2)}</mark>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

// 난이도·중요도(1~5)를 별로 표시
export function stars(n) {
  const v = Math.max(0, Math.min(5, Number(n) || 0))
  return '★'.repeat(v) + '☆'.repeat(5 - v)
}
