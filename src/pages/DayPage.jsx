import { Link, useParams } from 'react-router-dom'
import { getDay, sessionKey } from '../data/curriculum.js'
import useProgress from '../hooks/useProgress.js'

export default function DayPage() {
  const { dayId } = useParams()
  const day = getDay(dayId)
  const { progress } = useProgress()

  if (!day) return <div className="container section"><p>해당 일차를 찾을 수 없습니다.</p></div>

  return (
    <div className="container">
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
  )
}
