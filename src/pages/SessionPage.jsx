// ============================================================
// 교시 상세 (/day/:dayId/:slot)
// 구성: 학습목표 → 이론 블록들 → 실습 코드 → 완료 버튼
//       → (마지막 교시 한정) 퀴즈/심화 안내 → 이전/다음 네비
// findAdjacent가 일차 경계를 넘어 이전/다음 교시를 찾아 주므로
// 1일차 7교시 "다음"은 자동으로 2일차 1교시가 된다.
// ============================================================
import { Link, useParams } from 'react-router-dom'
import { getDay, getSession, days, sessionKey } from '../data/curriculum.js'
import useProgress from '../hooks/useProgress.js'
import CodeBlock from '../components/CodeBlock.jsx'
import DaySideNav from '../components/DaySideNav.jsx'
import Figure from '../components/figures.jsx'
import md, { stars } from '../utils/md.jsx'

// 이전/다음 교시 탐색 (dir: -1 이전, +1 다음)
// 같은 일차 안에서 먼저 찾고, 없으면 인접 일차의 첫/마지막 교시로 넘어간다.
// 과정의 맨 처음/맨 끝이면 null을 반환해 해당 버튼을 숨긴다.
function findAdjacent(dayId, slot, dir) {
  const day = getDay(dayId)
  const target = Number(slot) + dir
  if (day.sessions.some((s) => s.slot === target)) {
    return { dayId: Number(dayId), slot: target }
  }
  const nextDay = getDay(Number(dayId) + dir)
  if (!nextDay) return null
  const s = dir > 0 ? nextDay.sessions[0] : nextDay.sessions[nextDay.sessions.length - 1]
  return { dayId: nextDay.id, slot: s.slot }
}

export default function SessionPage() {
  const { dayId, slot } = useParams()
  const day = getDay(dayId)
  const session = getSession(dayId, slot)
  const { progress, toggle } = useProgress()

  if (!day || !session) {
    return <div className="container section"><p>세션을 찾을 수 없습니다.</p></div>
  }

  const key = sessionKey(dayId, slot)
  const done = !!progress[key]
  const prev = findAdjacent(dayId, slot, -1)
  const next = findAdjacent(dayId, slot, +1)
  const isLastSession = Number(dayId) === days.length && Number(slot) === day.sessions[day.sessions.length - 1].slot

  return (
    <div className="container page-side">
      <DaySideNav dayId={dayId} currentSlot={slot} progress={progress} />
      <div className="page-main">
      <div className="session-head">
        <div className="crumb">
          <Link to="/">홈</Link> / <Link to={`/day/${dayId}`}>DAY {dayId}</Link> / {slot}교시
        </div>
        <h1>{session.title}</h1>
        <p className="meta">
          DAY {dayId} · {session.time} · {session.kind === 'impl' ? '💻 구현 실습' : '📖 이론'}
          {'   '}
          <span className="meta-badges" style={{ marginLeft: 10 }}>
            <span className="mb">난이도 <b>{stars(session.difficulty)}</b></span>
            <span className="mb imp">중요도 <b>{stars(session.importance)}</b></span>
          </span>
        </p>
      </div>

      <div className="objectives">
        <h4>🎯 학습 목표</h4>
        <ul>{session.objectives.map((o, i) => <li key={i}>{md(o)}</li>)}</ul>
      </div>

      {session.theory.map((block, i) => (
        <div key={i} className="theory-block">
          <h3>{md(block.h)}</h3>
          <p>{md(block.p)}</p>
          {block.fig && <Figure id={block.fig} />}
        </div>
      ))}

      {session.code && <CodeBlock code={session.code} />}

      <button className={`complete-btn ${done ? 'done' : ''}`} onClick={() => toggle(key)}>
        {done ? '✓ 학습 완료! (클릭하면 취소)' : '이 교시 학습 완료로 표시하기'}
      </button>

      {isLastSession && (
        <div className="objectives" style={{ marginTop: 24 }}>
          <h4>🏁 3일 과정을 모두 마쳤습니다!</h4>
          <ul>
            <li><Link to="/summary" style={{ color: 'var(--accent)', fontWeight: 700 }}>요약정리</Link>에서 3일 전체 뼈대·공식·용어를 한 번에 훑어보세요</li>
            <li><Link to="/quiz" style={{ color: 'var(--accent)', fontWeight: 700 }}>복습 퀴즈 15문항</Link>으로 전체 내용을 점검해 보세요</li>
            <li><Link to="/projects" style={{ color: 'var(--accent)', fontWeight: 700 }}>미니 프로젝트 8종</Link>으로 배운 알고리즘을 직접 완성해 보세요</li>
            <li><Link to="/extra" style={{ color: 'var(--accent)', fontWeight: 700 }}>심화학습 자료</Link>로 학습을 이어가세요</li>
          </ul>
        </div>
      )}

      <div className="session-nav">
        {prev ? (
          <Link to={`/day/${prev.dayId}/${prev.slot}`}>
            <span className="dir">← 이전 교시</span>
            {getSession(prev.dayId, prev.slot).title}
          </Link>
        ) : <span className="spacer" />}
        {next ? (
          <Link to={`/day/${next.dayId}/${next.slot}`} className="next">
            <span className="dir">다음 교시 →</span>
            {getSession(next.dayId, next.slot).title}
          </Link>
        ) : <span className="spacer" />}
      </div>
      </div>
    </div>
  )
}
