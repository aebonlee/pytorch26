// ============================================================
// 라우트 맵 (모든 페이지는 Layout의 <Outlet /> 안에 렌더링)
// ------------------------------------------------------------
//   /                → Home        과정 소개 + 3일 카드(진도율)
//   /about           → AboutPage   개발취지 + 강사소개(SKALA 기준)
//   /prereq          → PrereqPage  선수학습 4영역 셀프체크
//   /setup           → SetupPage   환경설정 5단계(설치·Colab·VS Code)
//   /day/:dayId      → DayPage     해당 일차의 7교시 목록
//   /day/:dayId/:slot→ SessionPage 교시 상세(이론+코드+완료버튼)
//   /summary         → SummaryPage 요약정리(계보·비교표·공식·용어사전)
//   /labs            → LabsPage    실습소스 모음(21교시 코드 집약)
//   /projects        → ProjectsPage 미니 프로젝트 8종(결과 인증)
//   /quiz            → QuizPage    복습퀴즈 15문항(제출 후 해설)
//   /extra           → ExtraPage   추천자료 13종
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
import LabsPage from './pages/LabsPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import SetupPage from './pages/SetupPage.jsx'
import SummaryPage from './pages/SummaryPage.jsx'
import VodPage from './pages/VodPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prereq" element={<PrereqPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/day/:dayId" element={<DayPage />} />
        <Route path="/day/:dayId/:slot" element={<SessionPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/extra" element={<ExtraPage />} />
        <Route path="/vod" element={<VodPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
