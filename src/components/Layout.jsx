// ============================================================
// 공통 레이아웃: 헤더(로고+메뉴+테마토글) / <Outlet /> / 푸터
// ------------------------------------------------------------
// 테마 전환 동작:
//   1) index.html 인라인 스크립트가 첫 페인트 전에 localStorage
//      값을 <html data-theme>에 넣는다 (깜빡임 방지, 기본 light)
//   2) 이 컴포넌트의 초기 state는 그 DOM 값을 그대로 읽는다
//   3) 토글 시 DOM 속성 + localStorage + state를 함께 갱신
// 즉 "진실의 원본"은 <html data-theme> 속성이다.
// ============================================================
import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const THEME_KEY = 'pytorch26_theme'   // index.html 인라인 스크립트와 반드시 동일해야 함

export default function Layout() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light',
  )

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    localStorage.setItem(THEME_KEY, next)
    setTheme(next)
  }

  return (
    <>
      <header className="site-header">
        <div className="container inner">
          <NavLink to="/" className="logo">
            <span className="flame">🔥</span>
            <span>PyTorch RL</span>
            <span className="sub">멀티캠퍼스 3일 과정</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/prereq">선수학습</NavLink>
            <NavLink to="/day/1">1일차</NavLink>
            <NavLink to="/day/2">2일차</NavLink>
            <NavLink to="/day/3">3일차</NavLink>
            <NavLink to="/quiz">복습퀴즈</NavLink>
            <NavLink to="/extra">심화학습</NavLink>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          PyTorch로 배우는 강화학습 · 멀티캠퍼스 역삼캠퍼스 · 2026.07.27 ~ 07.29
          <br />
          강사 이애본 · DreamIT Biz
        </div>
      </footer>
    </>
  )
}
