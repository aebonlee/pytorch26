// ============================================================
// 요약정리 (/summary) — 3일차 다음 메뉴
// 데이터는 data/summary.js (계보/비교표/공식/일차별 핵심/용어사전)
// 사이드바 책갈피 5개 섹션, 표는 .sum-table (가로 스크롤 대응)
// ============================================================
import { lineage, algoTable, formulas, dayPoints, glossary } from '../data/summary.js'
import SideNav from '../components/SideNav.jsx'
import md from '../utils/md.jsx'

const NAV = [
  { key: 'lineage', anchor: 'sum-lineage', label: '01 알고리즘 계보' },
  { key: 'algo', anchor: 'sum-algo', label: '02 알고리즘 비교표' },
  { key: 'formulas', anchor: 'sum-formulas', label: '03 핵심 공식 모음' },
  { key: 'days', anchor: 'sum-days', label: '04 일차별 핵심 정리' },
  { key: 'glossary', anchor: 'sum-glossary', label: '05 용어 사전' },
]

export default function SummaryPage() {
  return (
    <div className="container page-side">
      <SideNav title="요약정리 책갈피" items={NAV} />
      <div className="page-main">
        <div className="session-head">
          <h1>요약정리</h1>
          <p className="meta">
            3일 과정의 뼈대를 한 페이지에 — 시험 전날처럼 훑어보고,
            헷갈리는 용어는 05 용어 사전에서 찾아보세요
          </p>
        </div>

        {/* 01 계보 */}
        <section className="section" id="sum-lineage">
          <h2><span className="num">01</span>3일 알고리즘 계보</h2>
          <div className="tt-box">
            {lineage.map((l, i) => (
              <div key={i} className="tt-row" style={{ cursor: 'default' }}>
                <span className="slot" style={{ flexBasis: 110 }}>{l.step}</span>
                <span className="time" style={{ flexBasis: 90 }}>{l.day}</span>
                <span className="title" style={{ fontWeight: 500 }}>{l.desc}</span>
              </div>
            ))}
          </div>
          <div className="objectives" style={{ marginTop: 16 }}>
            <h4>🧭 관통하는 세 질문</h4>
            <ul>
              <li>{md('**목표(target)를 무엇으로 만드는가** — 실제 리턴? 부트스트랩? 타깃넷? min?')}</li>
              <li>{md('**탐험을 어떻게 하는가** — ε? 확률적 정책? 행동 노이즈? 엔트로피?')}</li>
              <li>{md('**무엇으로 안정화하는가** — 재현버퍼? 타깃넷? 클리핑? 트윈 Q?')}</li>
            </ul>
          </div>
        </section>

        {/* 02 비교표 */}
        <section className="section" id="sum-algo">
          <h2><span className="num">02</span>알고리즘 비교표</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="sum-table">
              <thead>
                <tr><th>알고리즘</th><th>유형</th><th>On/Off</th><th>행동공간</th><th>탐험</th><th>핵심 한 줄</th></tr>
              </thead>
              <tbody>
                {algoTable.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 800, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{a.name}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{a.type}</td>
                    <td>{a.policy}</td>
                    <td>{a.action}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{a.explore}</td>
                    <td>{a.core}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 03 공식 */}
        <section className="section" id="sum-formulas">
          <h2><span className="num">03</span>핵심 공식 모음</h2>
          {formulas.map((f, i) => (
            <div key={i} className="formula-row">
              <div className="fname">{f.name}</div>
              <div className="fbody">
                <code className="fcode">{f.f}</code>
                <div className="fmean">{f.mean}</div>
              </div>
            </div>
          ))}
        </section>

        {/* 04 일차별 핵심 */}
        <section className="section" id="sum-days">
          <h2><span className="num">04</span>일차별 핵심 정리</h2>
          {dayPoints.map((d, i) => (
            <div key={i} className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ color: 'var(--accent)' }}>{d.day}</h3>
              <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                {d.points.map((p, j) => (
                  <li key={j} style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: 6 }}>{md(p)}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 05 용어 사전 */}
        <section className="section" id="sum-glossary">
          <h2><span className="num">05</span>용어 사전</h2>
          {glossary.map((g, i) => (
            <div key={i} style={{ marginBottom: 26 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 10px' }}>{g.cat}</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="sum-table">
                  <tbody>
                    {g.terms.map((t, j) => (
                      <tr key={j}>
                        <td style={{ fontWeight: 800, whiteSpace: 'nowrap', width: 130 }}>{t.ko}</td>
                        <td style={{ color: 'var(--text-dim)', whiteSpace: 'nowrap', width: 190, fontSize: '0.82rem' }}>{t.en}</td>
                        <td>{t.def}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
