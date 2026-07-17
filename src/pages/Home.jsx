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
          <h2><span className="num">01</span>일자별 시간표</h2>
          {days.map((day) => {
            const done = day.sessions.filter((s) => progress[sessionKey(day.id, s.slot)]).length
            return (
              <div key={day.id} className="tt-day">
                <div className="tt-head">
                  <Link to={`/day/${day.id}`} className="d">DAY {day.id}</Link>
                  <span className="theme">{day.theme}</span>
                  <span className="date">{day.date} · 진행 {done}/{day.sessions.length}교시</span>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  {day.sessions.map((s) => (
                    <Link key={s.slot} to={`/day/${day.id}/${s.slot}`} className="tt-row">
                      <span className="time">{s.time}</span>
                      <span className="slot">{s.slot}교시</span>
                      <span className="title">{s.title}</span>
                      <span className={`tag ${s.kind === 'impl' ? 'impl' : ''}`}>
                        {s.kind === 'impl' ? '💻 실습' : '📖 이론'}
                      </span>
                      <span className={`check ${progress[sessionKey(day.id, s.slot)] ? 'done' : ''}`}>✔</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
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
