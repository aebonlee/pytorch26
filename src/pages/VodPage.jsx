// ============================================================
// VOD (/vod) — 메뉴 맨 끝
// 데이터는 data/vod.js — courseVods(과정 다시보기)와
// lectures(추천 영상/자료). youtubeId가 있으면 16:9 임베드,
// url만 있으면 링크 카드로 렌더링.
// ============================================================
import { courseVods, lectures } from '../data/vod.js'
import SideNav from '../components/SideNav.jsx'

const NAV = [
  { key: 'course', anchor: 'vod-course', label: '01 과정 다시보기' },
  { key: 'lectures', anchor: 'vod-lectures', label: '02 추천 강의 영상' },
]

function VideoCard({ v }) {
  return (
    <div className="vod-card">
      {v.youtubeId ? (
        <div className="vod-frame">
          <iframe
            src={'https://www.youtube.com/embed/' + v.youtubeId}
            title={v.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      <div className="vod-meta">
        {v.day && <span className="kind">{v.day}</span>}
        {v.by && <span className="kind">{v.by}</span>}
        <h3>
          {v.url ? (
            <a href={v.url} target="_blank" rel="noreferrer">{v.title} ↗</a>
          ) : v.title}
        </h3>
        <p>{v.desc}</p>
      </div>
    </div>
  )
}

export default function VodPage() {
  return (
    <div className="container page-side">
      <SideNav title="VOD 책갈피" items={NAV} />
      <div className="page-main">
        <div className="session-head">
          <h1>VOD</h1>
          <p className="meta">과정 다시보기와 추천 강의 영상 — 수업 후 복습과 자습에 활용하세요</p>
        </div>

        <section className="section" id="vod-course">
          <h2><span className="num">01</span>과정 다시보기</h2>
          {courseVods.length > 0 ? (
            <div className="vod-grid">
              {courseVods.map((v, i) => <VideoCard key={i} v={v} />)}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '38px 20px' }}>
              <p style={{ fontSize: '1.6rem', marginBottom: 8 }}>🎬</p>
              <p style={{ fontWeight: 700 }}>과정 영상 준비 중입니다</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: 6 }}>
                교육 진행 후 다시보기/보충 영상이 이곳에 업로드됩니다.
                그때까지는 아래 추천 강의 영상으로 예습·복습하세요.
              </p>
            </div>
          )}
        </section>

        <section className="section" id="vod-lectures">
          <h2><span className="num">02</span>추천 강의 영상</h2>
          <div className="vod-grid">
            {lectures.map((v, i) => <VideoCard key={i} v={v} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
