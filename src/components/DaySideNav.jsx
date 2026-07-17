// ============================================================
// 일차·교시 페이지 전용 왼쪽 시간표 사이드바
// ------------------------------------------------------------
// 맨 위: DAY 1/2/3 전환 칩 → 아래: 해당 일차 7교시 (시간 + 제목,
// 현재 교시 하이라이트, 완료 ✔). DayPage와 SessionPage가 공용.
// ============================================================
import { Link } from 'react-router-dom'
import { days, getDay, sessionKey } from '../data/curriculum.js'
import SideNav from './SideNav.jsx'

export default function DaySideNav({ dayId, currentSlot, progress }) {
  const day = getDay(dayId)
  if (!day) return null

  const header = (
    <div className="side-days">
      {days.map((d) => (
        <Link key={d.id} to={`/day/${d.id}`} className={d.id === Number(dayId) ? 'on' : ''}>
          DAY {d.id}
        </Link>
      ))}
    </div>
  )

  const items = day.sessions.map((s) => ({
    key: s.slot,
    to: `/day/${day.id}/${s.slot}`,
    sub: s.time,
    label: `${s.slot}교시 · ${s.title}`,
    active: Number(currentSlot) === s.slot,
    done: !!progress[sessionKey(day.id, s.slot)],
  }))

  return <SideNav title={`DAY ${day.id} 시간표`} items={items} header={header} />
}
