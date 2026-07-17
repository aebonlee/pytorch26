// ============================================================
// 실습소스 모음 (/labs)
// ------------------------------------------------------------
// 21교시 커리큘럼에 흩어져 있는 실습 코드를 한 페이지에 모아
// 일차별로 나열한다 (이전 과정 패들렛의 "강의안 및 실습소스"
// 섹션 역할). 데이터를 따로 두지 않고 curriculum.js의 days에서
// 파생하므로, 교시 코드를 수정하면 여기에도 자동 반영된다.
// ============================================================
import { Link } from 'react-router-dom'
import { days } from '../data/curriculum.js'
import CodeBlock from '../components/CodeBlock.jsx'
import SideNav from '../components/SideNav.jsx'

export default function LabsPage() {
  const totalCodes = days.reduce((n, d) => n + d.sessions.filter((s) => s.code).length, 0)

  // 책갈피: DAY 헤더(굵게) + 코드 있는 교시들 (앵커 스크롤)
  const navItems = days.flatMap((d) => [
    { key: `d${d.id}`, anchor: `labs-day${d.id}`, label: `DAY ${d.id} — ${d.theme}`, strong: true },
    ...d.sessions.filter((s) => s.code).map((s) => ({
      key: `d${d.id}s${s.slot}`,
      anchor: `labs-d${d.id}s${s.slot}`,
      sub: `${s.slot}교시- ${s.code.filename}`,
      label: s.title,
    })),
  ])

  return (
    <div className="container page-side">
      <SideNav title="실습소스 책갈피" items={navItems} />
      <div className="page-main">
      <div className="session-head">
        <h1>실습소스 모음</h1>
        <p className="meta">
          3일 과정의 실습 코드 {totalCodes}개를 한 곳에 모았습니다 —
          복사해서 로컬·Colab에서 바로 실행하세요. 이론 설명은 각 교시 페이지에 있습니다
        </p>
      </div>

      <div className="card-grid" style={{ marginBottom: 8 }}>
        <a
          href="https://github.com/aebonlee/pytorch26"
          target="_blank"
          rel="noreferrer"
          className="extra-card"
        >
          <span className="kind">GitHub</span>
          <h3>강의 및 실습자료 리포지토리 ↗</h3>
          <p>github.com/aebonlee/pytorch26 — 이 사이트의 전체 소스와 실습 코드</p>
        </a>
        <div className="extra-card" style={{ cursor: 'default' }}>
          <span className="kind">환경 준비</span>
          <h3>pip install torch gymnasium numpy</h3>
          <p>GPU 불필요 (전체 실습 CPU 충분) · 설치가 어려우면 Colab 사용 — 자세한 안내는 <Link to="/setup" style={{ color: 'var(--accent)', fontWeight: 700 }}>환경설정</Link> 참고</p>
        </div>
      </div>

      <div className="objectives">
        <h4>🧩 코드는 이어집니다</h4>
        <ul>
          <li>1일차: 2교시 GridWorld를 3~5교시 DP·MC·TD가 재사용</li>
          <li>2일차: ReplayBuffer(1교시) + QNetwork(3교시) → DQN(4교시), ActorCritic(6교시) → A2C(7교시)</li>
          <li>3일차: Actor/Critic/soft_update(1교시) → DDPG(2교시), GaussianActor(4교시) → SAC(6교시) → TAC(7교시)</li>
          <li>즉, 위에서부터 순서대로 실행하는 것을 전제로 작성되어 있습니다</li>
        </ul>
      </div>

      {days.map((day) => (
        <section key={day.id} id={`labs-day${day.id}`} className="section">
          <h2>
            <span className="num">DAY {day.id}</span>
            {day.theme}
          </h2>
          {day.sessions.filter((s) => s.code).map((s) => (
            <div key={s.slot} id={`labs-d${day.id}s${s.slot}`} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', margin: '18px 0 -14px' }}>
                <h3 style={{ fontSize: '0.98rem' }}>
                  {day.id}일차 {s.slot}교시 · {s.title}
                </h3>
                <Link
                  to={`/day/${day.id}/${s.slot}`}
                  style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}
                >
                  이론 보기 →
                </Link>
              </div>
              <CodeBlock code={s.code} />
            </div>
          ))}
        </section>
      ))}
      </div>
    </div>
  )
}
