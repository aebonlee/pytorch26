// ============================================================
// 환경설정 (/setup) — 선수학습 다음 메뉴
// 데이터는 data/setup.js (5개 섹션: 파이썬/라이브러리/확인/Colab/VS Code)
// 각 섹션에 난이도·중요도 별점 + 본문 인라인 md(볼드·형광펜) 렌더링.
// ============================================================
import setup from '../data/setup.js'
import CodeBlock from '../components/CodeBlock.jsx'
import SideNav from '../components/SideNav.jsx'
import md, { stars } from '../utils/md.jsx'

export default function SetupPage() {
  const navItems = setup.map((s, i) => ({
    key: s.id,
    anchor: `setup-${s.id}`,
    sub: `난이도 ${'★'.repeat(s.difficulty)}`,
    label: `${String(i + 1).padStart(2, '0')} ${s.title}`,
  }))

  return (
    <div className="container page-side">
      <SideNav title="환경설정 책갈피" items={navItems} />
      <div className="page-main">
        <div className="session-head">
          <h1>환경설정</h1>
          <p className="meta">
            실습 환경을 준비하는 5단계입니다 — 수업 전날 <b>03 설치 확인</b>까지 마쳐 오세요.
            로컬 설치가 어려우면 04 Colab 방식으로 참여할 수 있습니다
          </p>
        </div>

        <section className="section">
          {setup.map((s, i) => (
            <div key={s.id} id={`setup-${s.id}`} style={{ marginBottom: 44 }}>
              <h2>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
                <span className="meta-badges" style={{ marginLeft: 12, verticalAlign: 'middle' }}>
                  <span className="mb">난이도 <b>{stars(s.difficulty)}</b></span>
                  <span className="mb imp">중요도 <b>{stars(s.importance)}</b></span>
                </span>
              </h2>
              <div className="theory-block" style={{ marginTop: 12 }}>
                <p>{md(s.body)}</p>
              </div>
              {s.code && <CodeBlock code={s.code} />}
              {s.resources?.length > 0 && (
                <div className="card-grid" style={{ marginTop: 14 }}>
                  {s.resources.map((r, j) => (
                    <a key={j} href={r.url} target="_blank" rel="noreferrer" className="extra-card">
                      <span className="kind">바로가기</span>
                      <h3>{r.title} ↗</h3>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
