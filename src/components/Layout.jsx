// ============================================================
// 공통 레이아웃: 헤더(로고+메뉴+테마토글) / <Outlet /> / 푸터
// ------------------------------------------------------------
// 테마 전환 동작:
//   1) index.html 인라인 스크립트가 첫 페인트 전에 localStorage
//      값을 <html data-theme>에 넣는다 (깜빡임 방지, 기본 light)
//   2) 이 컴포넌트의 초기 state는 그 DOM 값을 그대로 읽는다
//   3) 토글 시 DOM 속성 + localStorage + state를 함께 갱신
// 즉 "진실의 원본"은 <html data-theme> 속성이다.
//
// 메뉴 반응형 (2026-07-20):
//   메뉴가 12개라 좁은 화면에서 한 줄에 들어가지 않는다.
//   - ~1100px : 2줄로 줄바꿈 (CSS flex-wrap)
//   - ~760px  : 햄버거 버튼 + 2열 그리드 드롭다운 (아래 open 상태)
//   화면 크기 판정은 CSS가 전담한다. JS로 폭을 재지 않는 이유는
//   리사이즈·회전 때 상태가 어긋나기 때문 — open은 "열려는 의도"만 뜻하고
//   데스크톱에서는 CSS가 .nav를 항상 보이게 해서 무해하다.
// ============================================================
import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'

const THEME_KEY = 'pytorch26_theme'   // index.html 인라인 스크립트와 반드시 동일해야 함

const MENU = [
  ['/about', 'About'],
  ['/prereq', '선수학습'],
  ['/setup', '환경설정'],
  ['/day/1', '1일차'],
  ['/day/2', '2일차'],
  ['/day/3', '3일차'],
  ['/summary', '요약정리'],
  ['/labs', '실습소스'],
  ['/projects', '프로젝트'],
  ['/quiz', '복습퀴즈'],
  ['/extra', '심화학습'],
  ['/vod', 'VOD'],
]

export default function Layout() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light',
  )
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    localStorage.setItem(THEME_KEY, next)
    setTheme(next)
  }

  // 페이지가 바뀌면 드롭다운을 닫는다 (로고 클릭 등 메뉴 밖 이동까지 커버).
  // 같은 메뉴를 다시 누르면 pathname이 안 바뀌므로 <nav>의 onClick도 함께 둔다.
  useEffect(() => { setOpen(false) }, [pathname])

  // ESC로 닫기 — 열려 있을 때만 리스너를 건다
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="site-header">
        <div className="container inner">
          <NavLink to="/" className="logo">
            <span className="flame">🔥</span>
            <span>PyTorch RL</span>
            <span className="sub">멀티캠퍼스 3일 과정</span>
          </NavLink>
          <nav
            id="site-nav"
            className={open ? 'nav open' : 'nav'}
            onClick={() => setOpen(false)}
          >
            {MENU.map(([to, label]) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {/* 햄버거 — 모바일 폭에서만 CSS로 노출된다 */}
            <button
              className="nav-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            >
              <span className={open ? 'bars is-x' : 'bars'} aria-hidden="true">
                <i /><i /><i />
              </span>
            </button>
          </div>
        </div>
      </header>
      {/* 드롭다운 바깥을 눌러도 닫히게 하는 투명 오버레이 (모바일 전용) */}
      {open && <div className="nav-scrim" onClick={() => setOpen(false)} />}
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          PyTorch로 배우는 강화학습 · 멀티캠퍼스 역삼캠퍼스 · 2026.07.27 ~ 07.29
          <div className="footer-contact">
            <span>강사 이애본 · DreamIT Biz</span>
            <a href="mailto:aebon@dreamitbiz.com">✉️ aebon@dreamitbiz.com</a>
            <a href="tel:010-3700-0629">📞 010-3700-0629</a>
            <span>💬 카카오톡 ID: aebon</span>
            <span>🕘 평일 09:00 ~ 18:00</span>
          </div>
        </div>
      </footer>
    </>
  )
}
