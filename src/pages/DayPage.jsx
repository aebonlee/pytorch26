// ============================================================
// 일차 페이지 (/day/:dayId): 왼쪽 시간표 사이드바 + 7교시 목록
// 각 행 = 시간 · 제목 · 이론/구현 뱃지 · 완료 체크(진도)
// ============================================================
import { Link, useParams } from 'react-router-dom'
import { getDay, sessionKey } from '../data/curriculum.js'
import useProgress from '../hooks/useProgress.js'
import DaySideNav from '../components/DaySideNav.jsx'

export default function DayPage() {
  const { dayId } = useParams()
  const day = getDay(dayId)
  const { progress } = useProgress()

  if (!day) return <div className="container section"><p>해당 일차를 찾을 수 없습니다.</p></div>

  return (
    <div className="container page-side">
      <DaySideNav dayId={dayId} progress={progress} />
      <div className="page-main">
        <div className="session-head">
          <div className="crumb"><Link to="/">홈</Link> / DAY {day.id}</div>
          <h1>DAY {day.id} — {day.theme}</h1>
          <p className="meta">{day.date} · 09:30 ~ 17:30 (7교시) · {day.desc}</p>
        </div>

        <section className="section">
          {day.sessions.map((s) => (
            <Link key={s.slot} to={`/day/${day.id}/${s.slot}`} className="session-row">
              <span className="time">{s.time}</span>
              <span className="title">{s.slot}교시 · {s.title}</span>
              <span className={`tag ${s.kind === 'impl' ? 'impl' : ''}`}>
                {s.kind === 'impl' ? '💻 구현 실습' : '📖 이론'}
              </span>
              <span className={`check ${progress[sessionKey(day.id, s.slot)] ? 'done' : ''}`}>✔</span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
