import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
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
            <NavLink to="/day/1">1일차</NavLink>
            <NavLink to="/day/2">2일차</NavLink>
            <NavLink to="/day/3">3일차</NavLink>
            <NavLink to="/quiz">복습퀴즈</NavLink>
            <NavLink to="/extra">심화학습</NavLink>
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
