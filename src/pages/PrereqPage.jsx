// ============================================================
// 선수학습 (/prereq) — 5개 영역 셀프체크 페이지
// 데이터·스키마는 data/prereq.js 참고 (이 파일은 렌더링만)
// ============================================================
import prereq from '../data/prereq.js'
import CodeBlock from '../components/CodeBlock.jsx'
import SideNav from '../components/SideNav.jsx'

// level 뱃지 색: 필수=녹색(accent), 권장=노랑, 준비=파랑
const LEVEL_STYLE = {
  필수: { color: 'var(--accent)', border: 'rgba(238, 76, 44, 0.4)' },
  권장: { color: 'var(--yellow)', border: 'rgba(210, 153, 34, 0.5)' },
  준비: { color: 'var(--blue)', border: 'rgba(88, 166, 255, 0.5)' },
}

export default function PrereqPage() {
  const navItems = prereq.map((p, i) => ({
    key: p.id,
    anchor: p.id,
    sub: p.level,
    label: `${String(i + 1).padStart(2, '0')} ${p.title}`,
  }))

  return (
    <div className="container page-side">
      <SideNav title="선수학습 책갈피" items={navItems} />
      <div className="page-main">
      <div className="session-head">
        <h1>선수학습</h1>
        <p className="meta">
          과정 커리큘럼을 따라오기 위해 필요한 사전 지식입니다 —
          각 항목의 셀프체크 코드로 준비 상태를 점검하고, 부족한 부분은 보충 자료로 채워 오세요
        </p>
      </div>

      <section className="section">
        {prereq.map((p, i) => {
          const ls = LEVEL_STYLE[p.level] || LEVEL_STYLE['준비']
          return (
            <div key={p.id} id={p.id} style={{ marginBottom: 44 }}>
              <h2>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                {p.title}{' '}
                <span
                  className="tag"
                  style={{
                    fontSize: '0.7rem', padding: '3px 10px', borderRadius: 999,
                    border: `1px solid ${ls.border}`, color: ls.color,
                    verticalAlign: 'middle', marginLeft: 6,
                  }}
                >
                  {p.level}
                </span>
              </h2>
              <div className="theory-block" style={{ marginTop: 12 }}>
                <p>{p.summary}</p>
              </div>

              <div className="objectives">
                <h4>📋 필요한 수준</h4>
                <ul>{p.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
              </div>

              {p.checklist && (
                <div className="objectives" style={{ borderColor: 'rgba(63, 185, 80, 0.35)', background: 'rgba(63, 185, 80, 0.07)' }}>
                  <h4 style={{ color: 'var(--green)' }}>✅ 개념 셀프체크 — 아래를 설명할 수 있으면 통과</h4>
                  <ul>{p.checklist.map((c, j) => <li key={j}>{c}</li>)}</ul>
                </div>
              )}

              {p.check && <CodeBlock code={p.check} />}

              <div className="card-grid" style={{ marginTop: 14 }}>
                {p.resources.map((r, j) => (
                  <a key={j} href={r.url} target="_blank" rel="noreferrer" className="extra-card">
                    <span className="kind">보충 자료</span>
                    <h3>{r.title} ↗</h3>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </section>
      </div>
    </div>
  )
}
