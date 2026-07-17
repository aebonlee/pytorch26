// ============================================================
// 홈: 히어로(과정 요약) → 일자별 시간표(첫 콘텐츠, 각 행이
//     교시 페이지로 연결 + 완료 체크) → 학습목표 →
//     사전지식/학습대상 → 교육 개요 표
// 2026-07-17 대표 지시로 "일자별 시간표"를 첫 페이지의 중심으로
// 재구성 — 기존 3일 카드 그리드를 시간표로 교체했다.
// 과정 메타 정보(일정·장소·목표 등) 수정은 curriculum.js의
// course 객체에서 한다 — 이 파일은 렌더링만.
// ============================================================
import { Link } from 'react-router-dom'
import { days, course, sessionKey } from '../data/curriculum.js'
import useProgress from '../hooks/useProgress.js'

// 히어로 우측 파이토치 불꽃 모티프 SVG
// — 링+점(파비콘과 같은 모티프)을 크게, 바깥 점선 궤도(.orbit)는
//   천천히 회전, 뒷배경 글로우(.glow)는 펄스 (CSS 애니메이션)
function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 320 320" fill="none">
        <defs>
          <radialGradient id="haGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ee4c2c" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ee4c2c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="haRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff7a55" />
            <stop offset="1" stopColor="#ee4c2c" />
          </linearGradient>
        </defs>

        {/* 배경 글로우 (펄스) */}
        <circle className="glow" cx="160" cy="170" r="140" fill="url(#haGlow)" />

        {/* 바깥 점선 궤도 + 컬러 노드 (천천히 회전) — 에이전트-환경 루프 모티프 */}
        <g className="orbit">
          <circle cx="160" cy="170" r="132" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 9" />
          <circle cx="160" cy="38" r="7" fill="#3fb950" />
          <circle cx="292" cy="170" r="5.5" fill="#58a6ff" />
          <circle cx="160" cy="302" r="6" fill="#d29922" />
          <circle cx="28" cy="170" r="4.5" fill="#ee4c2c" opacity="0.7" />
        </g>

        {/* 파이토치 불꽃 모티프: 위가 트인 링 + 대각선 점 */}
        <circle
          cx="160" cy="170" r="86"
          stroke="url(#haRing)" strokeWidth="30" strokeLinecap="round"
          strokeDasharray="472 68"
          transform="rotate(-43 160 170)"
        />
        <circle cx="224" cy="104" r="14" fill="url(#haRing)" />
      </svg>
    </div>
  )
}

// 히어로 아래 띠줄에 흐르는 3일 알고리즘 키워드
const TICKER = [
  'Reinforcement Learning', 'MDP', 'Bellman Equation', 'Dynamic Programming',
  'Monte-Carlo', 'TD Learning', 'SARSA', 'Q-Learning', 'DQN', 'Double DQN',
  'Policy Gradient', 'Actor-Critic', 'A2C', 'DDPG', 'Maximum Entropy RL',
  'Soft Actor-Critic', 'TAC', 'PyTorch',
]

export default function Home() {
  const { progress } = useProgress()

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="badge">멀티캠퍼스 공개과정 · 2026. 07. 27 ~ 07. 29</span>
            <h1>
              <span className="accent">PyTorch</span>로 배우는 강화학습
            </h1>
            <p className="lede">
              강화학습의 기초 이론부터 DQN, A2C, DDPG, SAC, TAC까지 —
              3일 21시간 동안 직접 구현하며 원리를 몸에 익히는 집중 과정입니다.
            </p>
            <div className="meta-row">
              <span className="meta-chip">📍 <b>{course.place}</b></span>
              <span className="meta-chip">🕘 <b>{course.hours}</b></span>
              <span className="meta-chip">👨‍🏫 <b>{course.instructor}</b></span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {/* 알고리즘 키워드 띠줄 — 무한 흐름, 호버 시 일시정지 (2배 복제로 이음새 없는 루프) */}
      <div className="hero-ticker" aria-hidden="true">
        <div className="ticker-track">
          {TICKER.concat(TICKER).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2><span className="num">01</span>일자별 시간표</h2>
          {/* 2×2 박스: [3일 소개(주제만) | 1일차] / [2일차 | 3일차] — 대표 지정 배치 */}
          <div className="tt-grid">
            <div className="tt-day tt-intro">
              <div className="tt-head">
                <span className="d">3일 한눈에</span>
                <span className="date">총 21교시 · 매일 09:30 ~ 17:30</span>
              </div>
              <div className="tt-box">
                {days.map((day) => (
                  <Link key={day.id} to={`/day/${day.id}`} className="tt-row">
                    <span className="slot" style={{ flexBasis: 64 }}>DAY {day.id}</span>
                    <span className="title">
                      {day.theme}
                      <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-dim)', marginTop: 2 }}>
                        {day.date}
                      </span>
                    </span>
                  </Link>
                ))}
                <div style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  표 기반 기초 → 신경망(DQN·A2C) → 연속 제어(DDPG·SAC·TAC)로
                  3일간 알고리즘 계보를 따라 올라갑니다.
                </div>
              </div>
            </div>

            {days.map((day) => {
              const done = day.sessions.filter((s) => progress[sessionKey(day.id, s.slot)]).length
              return (
                <div key={day.id} className="tt-day">
                  <div className="tt-head">
                    <Link to={`/day/${day.id}`} className="d">DAY {day.id}</Link>
                    <span className="theme">{day.theme}</span>
                    <span className="date">{day.date} · 진행 {done}/{day.sessions.length}교시</span>
                  </div>
                  <div className="tt-box">
                    {/* 이론/실습은 이모지·체크 대신 단어 뱃지로 (대표 지정) */}
                    {day.sessions.map((s) => (
                      <Link key={s.slot} to={`/day/${day.id}/${s.slot}`} className="tt-row">
                        <span className="time">{s.time}</span>
                        <span className="slot">{s.slot}교시</span>
                        <span className="title">{s.title}</span>
                        <span className={`tag ${s.kind === 'impl' ? 'impl' : ''}`}>
                          {s.kind === 'impl' ? '실습' : '이론'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2><span className="num">02</span>학습 목표</h2>
          <div className="card-grid">
            {course.goals.map((g, i) => (
              <div key={i} className="card"><p>{g}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2><span className="num">03</span>사전 지식 & 학습 대상</h2>
          <div className="card-grid">
            <div className="card">
              <h3>✅ 사전 지식</h3>
              <ul>{course.prerequisites.map((p, i) => <li key={i}>{p}</li>)}</ul>
              <p style={{ marginTop: 10 }}>
                <Link to="/prereq" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  → 선수학습 페이지에서 셀프체크 해보기
                </Link>
              </p>
            </div>
            <div className="card">
              <h3>🎯 학습 대상</h3>
              <ul>{course.audience.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2><span className="num">04</span>과정 안내</h2>
          <div className="card">
            <table className="info-table">
              <tbody>
                <tr><th>교육 과정</th><td>{course.title} ({course.org})</td></tr>
                <tr><th>교육 일정</th><td>{course.period}</td></tr>
                <tr><th>교육 시간</th><td>{course.hours}</td></tr>
                <tr><th>교육 장소</th><td>{course.place}</td></tr>
                <tr>
                  <th>과정 페이지</th>
                  <td><a href={course.homepage} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>멀티캠퍼스 과정 소개 바로가기 ↗</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
