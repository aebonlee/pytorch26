import { Link } from 'react-router-dom'
import { days, course, sessionKey } from '../data/curriculum.js'
import useProgress from '../hooks/useProgress.js'

export default function Home() {
  const { progress } = useProgress()

  return (
    <>
      <section className="hero">
        <div className="container">
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
      </section>

      <section className="section">
        <div className="container">
          <h2><span className="num">01</span>3일 커리큘럼</h2>
          <div className="card-grid">
            {days.map((day) => {
              const done = day.sessions.filter((s) => progress[sessionKey(day.id, s.slot)]).length
              const pct = Math.round((done / day.sessions.length) * 100)
              return (
                <Link key={day.id} to={`/day/${day.id}`} className="day-card">
                  <span className="day-label">DAY {day.id} · {day.date}</span>
                  <h3>{day.theme}</h3>
                  <p className="theme">{day.desc}</p>
                  <div className="progress-line">
                    학습 진행 {done}/{day.sessions.length} 교시
                    <div className="progress-bar"><div style={{ width: `${pct}%` }} /></div>
                  </div>
                </Link>
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
