// ============================================================
// 앱 진입점
// ------------------------------------------------------------
// HashRouter를 쓰는 이유: GitHub Pages는 SPA 라우트를 모르므로
// BrowserRouter로 /day/1 같은 경로를 새로고침하면 404가 난다.
// 해시(#/day/1) 방식은 서버에 항상 index.html만 요청하므로
// 404.html 우회 트릭 없이 안전하다. BrowserRouter로 바꾸지 말 것.
// ============================================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
