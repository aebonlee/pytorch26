import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import DayPage from './pages/DayPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ExtraPage from './pages/ExtraPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayId" element={<DayPage />} />
        <Route path="/day/:dayId/:slot" element={<SessionPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/extra" element={<ExtraPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
