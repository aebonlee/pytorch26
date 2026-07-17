// ============================================================
// 왼쪽 사이드바(책갈피) 공용 컴포넌트
// ------------------------------------------------------------
// 두 가지 항목 타입을 지원한다:
//   { to }     → 라우트 이동 (교시 시간표 등, react-router Link)
//   { anchor } → 같은 페이지 안의 섹션으로 스크롤 (책갈피)
// 공통 필드: key, label, sub(작은 보조줄: 시간·난이도 등),
//            active(현재 위치 하이라이트), done(완료 ✔),
//            strong(굵은 그룹 헤더 스타일)
// header: 사이드바 맨 위에 끼워 넣는 노드 (일차 전환 칩 등)
// 데스크톱: 좁은 폭(190px) 스티키 / 모바일(≤860px): 상단 가로 칩.
// 앵커 스크롤은 전역 CSS의 [id]{scroll-margin-top}로 헤더에 안 가림.
// ============================================================
import { Link } from 'react-router-dom'

function scrollTo(anchor) {
  document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function SideNav({ title, items, header }) {
  return (
    <aside className="side-nav">
      {header}
      {title && <div className="side-title">{title}</div>}
      {items.map((it) => {
        const cls = `row${it.active ? ' active' : ''}${it.strong ? ' strong' : ''}`
        const inner = (
          <>
            {it.sub && <span className="sub">{it.sub}</span>}
            <span className="label">
              {it.label}
              {it.done && <span className="done"> ✔</span>}
            </span>
          </>
        )
        return it.to ? (
          <Link key={it.key} to={it.to} className={cls}>{inner}</Link>
        ) : (
          <button key={it.key} type="button" className={cls} onClick={() => scrollTo(it.anchor)}>
            {inner}
          </button>
        )
      })}
    </aside>
  )
}
