import { challenges, resources } from '../data/extrastudy.js'

export default function ExtraPage() {
  return (
    <div className="container">
      <div className="session-head">
        <h1>심화학습 & 도전과제</h1>
        <p className="meta">3일 과정을 마친 뒤 학습을 이어가기 위한 로드맵입니다</p>
      </div>

      <section className="section">
        <h2><span className="num">01</span>도전과제 — 난이도 순</h2>
        {challenges.map((c, i) => (
          <div key={i} className="challenge">
            <span className="level">{c.level}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <h2><span className="num">02</span>추천 학습 자료</h2>
        <div className="card-grid">
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" className="extra-card">
              <span className="kind">{r.kind}</span>
              <h3>{r.title} ↗</h3>
              <p>{r.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
