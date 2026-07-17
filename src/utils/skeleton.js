// ============================================================
// 괄호채우기 생성기 (프로젝트 완성 코드 → 난이도별 빈칸 코드)
// ------------------------------------------------------------
// 데이터는 projects.js의 blanks: [{ level, find, hint, nth? }]
//  - level: 1~3 — 난이도 L 선택 시 level<=L 빈칸이 "누적" 적용
//  - find : solution.source 안의 정답 코드 조각 (정확히 일치)
//  - nth  : 같은 조각이 여러 번 나올 때 몇 번째를 비울지 (기본 1)
// makeSkeleton()이 등장 순서대로 ____①____ 형태로 치환하고,
// 번호별 힌트 목록을 함께 돌려준다.
// 변형 소스를 24벌 저장하는 대신 런타임 생성 — 완성 코드를
// 고치면 모든 난이도의 괄호채우기에 자동 반영된다.
// ============================================================
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

function indexOfNth(str, find, nth) {
  let idx = -1
  for (let i = 0; i < nth; i++) {
    idx = str.indexOf(find, idx + 1)
    if (idx < 0) return -1
  }
  return idx
}

export function makeSkeleton(source, blanks, level) {
  const active = blanks
    .filter((b) => b.level <= level)
    .map((b) => ({ ...b, pos: indexOfNth(source, b.find, b.nth || 1) }))
    .filter((b) => b.pos >= 0)
    .sort((a, b) => a.pos - b.pos)

  const hints = active.map((b, i) => ({ num: CIRCLED[i] || `(${i + 1})`, hint: b.hint }))

  let out = source
  for (let i = active.length - 1; i >= 0; i--) {
    const b = active[i]
    out = out.slice(0, b.pos) + '____' + (CIRCLED[i] || i + 1) + '____' + out.slice(b.pos + b.find.length)
  }
  return { source: out, hints }
}

export function blankCount(blanks, level) {
  return blanks.filter((b) => b.level <= level).length
}
