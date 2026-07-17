// ============================================================
// 미니 프로젝트 (/projects) — 실습 강화 페이지
// 데이터는 data/projects.js (8개: 기본2·응용3·심화2·자유1)
// 이전 과정 패들렛의 "미니프로젝트+결과 인증" 운영 패턴을 반영:
// 각 프로젝트에 결과 인증 기준이 있고, 수업 중 안내하는
// 패들렛/게시판에 결과를 공유하는 흐름을 전제로 한다.
// 카드 우하단 "완성 소스 보기" 토글로 solution 코드를 열고 닫는다
// — 스스로 먼저 풀어보게 기본은 닫힘 상태.
// ============================================================
import { useState } from 'react'
import projects from '../data/projects.js'
import SideNav from '../components/SideNav.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import md, { stars } from '../utils/md.jsx'

const LEVEL_STYLE = {
  기본: { color: 'var(--green)', bg: 'rgba(63, 185, 80, 0.1)' },
  응용: { color: 'var(--blue)', bg: 'rgba(88, 166, 255, 0.1)' },
  심화: { color: 'var(--accent)', bg: 'var(--accent-soft)' },
  자유: { color: 'var(--yellow)', bg: 'rgba(210, 153, 34, 0.1)' },
}

export default function ProjectsPage() {
  // 카드별 코드 토글 상태 — skel(괄호채우기) / sol(완성형) 각각 독립
  const [openSkel, setOpenSkel] = useState({})
  const [openSol, setOpenSol] = useState({})
  const navItems = projects.map((p) => ({
    key: p.id,
    anchor: `proj-${p.id}`,
    sub: p.level,
    label: `#${p.id} ${p.title}`,
  }))

  return (
    <div className="container page-side">
      <SideNav title="프로젝트 책갈피" items={navItems} />
      <div className="page-main">
      <div className="session-head">
        <h1>미니 프로젝트</h1>
        <p className="meta">
          수업 코드에서 출발해 스스로 완성하는 8개의 프로젝트 —
          기본(1일차 수준) → 응용(2일차) → 심화(3일차+) → 자유 순으로 도전하세요
        </p>
      </div>

      <div className="objectives">
        <h4>📢 결과 인증 방법</h4>
        <ul>
          <li>각 프로젝트의 <b>결과 인증 기준</b>을 달성하면, 학습곡선 그래프나 실행 영상을 수업 중 안내하는 공유 보드(패들렛)에 올려 주세요</li>
          <li>수치보다 중요한 것은 <b>시행착오 기록</b>입니다 — 무엇을 바꿨더니 무엇이 달라졌는지 한 줄씩 남기세요</li>
        </ul>
      </div>

      <section className="section">
        {projects.map((p) => {
          const ls = LEVEL_STYLE[p.level]
          return (
            <div key={p.id} id={`proj-${p.id}`} className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '3px 11px',
                    borderRadius: 999, color: ls.color, background: ls.bg,
                  }}
                >
                  {p.level}
                </span>
                <h3 style={{ fontSize: '1.08rem', margin: 0 }}>
                  <span style={{ color: 'var(--accent)', marginRight: 6 }}>#{p.id}</span>
                  {p.title}
                </h3>
                <span className="meta-badges">
                  <span className="mb">난이도 <b>{stars(p.difficulty)}</b></span>
                  <span className="mb imp">중요도 <b>{stars(p.importance)}</b></span>
                </span>
              </div>

              <p style={{ marginTop: 10, color: 'var(--text-dim)', fontSize: '0.92rem' }}>{md(p.goal)}</p>

              <table className="info-table" style={{ marginTop: 12 }}>
                <tbody>
                  <tr><th>환경</th><td><code style={{ fontSize: '0.85em' }}>{p.env}</code></td></tr>
                  <tr><th>출발 코드</th><td>{p.reuse}</td></tr>
                </tbody>
              </table>

              <div style={{ marginTop: 14 }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 6 }}>🛠 구현 흐름</h4>
                <ol style={{ paddingLeft: 20, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  {p.guide.map((g, i) => <li key={i} style={{ marginBottom: 4 }}>{md(g)}</li>)}
                </ol>
              </div>

              <div
                style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(63, 185, 80, 0.08)', border: '1px solid rgba(63, 185, 80, 0.3)',
                  fontSize: '0.88rem',
                }}
              >
                <b style={{ color: 'var(--green)' }}>✅ 결과 인증:</b>{' '}
                <span style={{ color: 'var(--text-dim)' }}>{md(p.cert)}</span>
              </div>

              {p.stretch && (
                <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  <b style={{ color: 'var(--yellow)' }}>➕ 더 도전:</b> {p.stretch.join(' · ')}
                </p>
              )}

              {/* 코드 토글 2종 — 카드 우하단, 기본 닫힘 (먼저 스스로 풀어보게)
                  ① 괄호채우기(스켈레톤): 핵심 수식이 ________ 빈칸
                  ② 완성형 코드: 전체 정답 소스 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {p.skeleton && (
                  <button
                    type="button"
                    className="sol-btn"
                    onClick={() => setOpenSkel((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                  >
                    {openSkel[p.id] ? '괄호채우기 닫기 ▲' : '🧩 괄호채우기 보기 ▼'}
                  </button>
                )}
                {p.solution && (
                  <button
                    type="button"
                    className="sol-btn sol-full"
                    onClick={() => setOpenSol((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                  >
                    {openSol[p.id] ? '완성형 코드 닫기 ▲' : '📄 완성형 코드 보기 ▼'}
                  </button>
                )}
              </div>
              {openSkel[p.id] && p.skeleton && <CodeBlock code={p.skeleton} />}
              {openSol[p.id] && p.solution && <CodeBlock code={p.solution} />}
            </div>
          )
        })}
      </section>
      </div>
    </div>
  )
}
