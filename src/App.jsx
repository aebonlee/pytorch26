// ============================================================
// 라우트 맵 (모든 페이지는 Layout의 <Outlet /> 안에 렌더링)
// ------------------------------------------------------------
//   /                → Home        과정 소개 + 3일 카드(진도율)
//   /about           → AboutPage   개발취지 + 강사소개(SKALA 기준)
//   /prereq          → PrereqPage  선수학습 5영역 셀프체크
//   /day/:dayId      → DayPage     해당 일차의 7교시 목록
//   /day/:dayId/:slot→ SessionPage 교시 상세(이론+코드+완료버튼)
//   /quiz            → QuizPage    복습퀴즈 15문항(제출 후 해설)
//   /extra           → ExtraPage   도전과제 4단계 + 추천자료 12종
//   그 외            → Home으로 폴백 (404 페이지 없음)
// ============================================================
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import DayPage from './pages/DayPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ExtraPage from './pages/ExtraPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PrereqPage from './pages/PrereqPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prereq" element={<PrereqPage />} />
        <Route path="/day/:dayId" element={<DayPage />} />
        <Route path="/day/:dayId/:slot" element={<SessionPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/extra" element={<ExtraPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
