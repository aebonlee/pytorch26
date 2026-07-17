// ============================================================
// 심화학습 (/extra) — 추천자료 모음
// 데이터는 data/extrastudy.js에서 관리 (이 파일은 렌더링만)
// 기존 "도전과제 4단계"는 /projects 미니 프로젝트 8종으로
// 통합·확장되었다 (2026-07-17) — 여기서는 링크로만 안내.
// ============================================================
import { Link } from 'react-router-dom'
import { resources } from '../data/extrastudy.js'

export default function ExtraPage() {
  return (
    <div className="container">
      <div className="session-head">
        <h1>심화학습 자료</h1>
        <p className="meta">3일 과정을 마친 뒤 학습을 이어가기 위한 자료 모음입니다</p>
      </div>

      <div className="objectives">
        <h4>🛠 손으로 이어가려면</h4>
        <ul>
          <li>
            직접 구현하며 심화하는 과제는{' '}
            <Link to="/projects" style={{ color: 'var(--accent)', fontWeight: 700 }}>
              미니 프로젝트 8종
            </Link>
            에 난이도 순으로 정리되어 있습니다
          </li>
        </ul>
      </div>

      <section className="section">
        <h2><span className="num">01</span>추천 학습 자료</h2>
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
