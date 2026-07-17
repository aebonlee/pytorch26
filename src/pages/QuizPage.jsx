// ============================================================
// 복습퀴즈 (/quiz) — 문항 데이터는 data/quizzes.js
// ------------------------------------------------------------
// 동작:
//  - 왼쪽 사이드바 = 문항 책갈피 (선택한 답안 ①~④ 표시,
//    채점 후에는 정답/오답 표시)
//  - 전 문항 선택 전엔 제출 버튼 비활성 → 제출 시 채점
//    (정답 녹색 / 내 오답 빨강 / 해설 표시)
//  - **응시는 최대 3회** — 회차별 점수를 localStorage
//    'pytorch26_quiz_attempts'에 [{score,total,at}]로 기록,
//    3회를 다 쓰면 "다시 풀기" 비활성 (마지막 결과는 계속 열람 가능)
// ※ 보기 지문에 "정답"이라는 단어를 쓰지 말 것 — 정답이
//   노출된 것처럼 보인다는 대표 피드백으로 Q1 지문 수정(2026-07-17)
// ============================================================
import { useState } from 'react'
import quizzes from '../data/quizzes.js'
import md from '../utils/md.jsx'
import SideNav from '../components/SideNav.jsx'

const ATTEMPTS_KEY = 'pytorch26_quiz_attempts'
const MAX_ATTEMPTS = 3
const CIRCLED = ['①', '②', '③', '④']

function loadAttempts() {
  try {
    const v = JSON.parse(localStorage.getItem(ATTEMPTS_KEY))
    return Array.isArray(v) ? v.slice(0, MAX_ATTEMPTS) : []
  } catch {
    return []
  }
}

export default function QuizPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState(loadAttempts)

  const answeredCount = Object.keys(answers).length
  const score = quizzes.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
  const attemptsLeft = MAX_ATTEMPTS - attempts.length

  const select = (qi, oi) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qi]: oi }))
  }

  const submit = () => {
    const next = [...attempts, { score, total: quizzes.length, at: new Date().toISOString().slice(0, 16).replace('T', ' ') }]
    setAttempts(next)
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next))
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo(0, 0)
  }

  // 사이드바: 문항별 선택 상태 (채점 후에는 정답/오답)
  const navItems = quizzes.map((q, qi) => {
    const picked = answers[qi]
    let sub
    if (submitted) sub = picked === q.answer ? '정답 ✔' : `오답 (내 답 ${CIRCLED[picked]})`
    else sub = picked !== undefined ? `선택 ${CIRCLED[picked]}` : '미선택'
    return {
      key: qi,
      anchor: `quiz-q${qi}`,
      sub,
      label: `Q${qi + 1}. ${q.q.length > 22 ? q.q.slice(0, 22) + '…' : q.q}`,
      done: submitted ? picked === q.answer : picked !== undefined,
    }
  })

  return (
    <div className="container page-side">
      <SideNav title={`복습퀴즈 · 응답 ${answeredCount}/${quizzes.length}`} items={navItems} />
      <div className="page-main">
      <div className="session-head">
        <h1>복습 퀴즈</h1>
        <p className="meta">
          3일 전체 범위 · {quizzes.length}문항 · 정답과 해설은 제출 후 공개 ·
          응시 기회 <b style={{ color: 'var(--accent)' }}>{MAX_ATTEMPTS}회</b> 중 <b>{attempts.length}회</b> 사용
        </p>
      </div>

      {/* 회차별 채점결과 */}
      {attempts.length > 0 && (
        <div className="objectives" style={{ marginTop: 8 }}>
          <h4>📊 회차별 채점결과</h4>
          <ul>
            {attempts.map((a, i) => (
              <li key={i}>
                <b>{i + 1}회차</b> — {a.score} / {a.total}점
                <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}> ({a.at})</span>
              </li>
            ))}
            {attemptsLeft > 0
              ? <li style={{ color: 'var(--text-dim)' }}>남은 응시 기회: {attemptsLeft}회</li>
              : <li style={{ color: 'var(--accent)', fontWeight: 700 }}>3회 응시를 모두 마쳤습니다 — 해설을 보며 복습하세요</li>}
          </ul>
        </div>
      )}

      <section className="section">
        {submitted && (
          <div className="quiz-score">
            <div className="score">{score} / {quizzes.length}</div>
            <p style={{ whiteSpace: 'pre-line' }}>
              {score === quizzes.length ? '완벽합니다! 🎉' :
               score >= quizzes.length * 0.8 ? '훌륭합니다!\n틀린 문항의 해설을 확인해 보세요.' :
               score >= quizzes.length * 0.5 ? '좋은 출발입니다.\n해당 교시로 돌아가 복습을 추천합니다.' :
               '해설을 읽고 각 교시 자료로 다시 복습해 보세요.'}
            </p>
          </div>
        )}

        {quizzes.map((quiz, qi) => (
          <div key={qi} id={`quiz-q${qi}`} className="quiz-item">
            <p className="q"><span className="qnum">Q{qi + 1}.</span>{quiz.q}</p>
            {quiz.options.map((opt, oi) => {
              let cls = 'opt'
              if (!submitted && answers[qi] === oi) cls += ' selected'
              if (submitted) {
                if (oi === quiz.answer) cls += ' correct'
                else if (answers[qi] === oi) cls += ' wrong'
              }
              return (
                <button key={oi} className={cls} onClick={() => select(qi, oi)}>
                  {CIRCLED[oi]} {opt}
                </button>
              )
            })}
            {submitted && <div className="explain">💡 {md(quiz.explain)}</div>}
          </div>
        ))}

        <div style={{ textAlign: 'center', margin: '30px 0 60px' }}>
          {!submitted ? (
            <button
              className="primary-btn"
              disabled={answeredCount < quizzes.length || attemptsLeft <= 0}
              onClick={submit}
            >
              {attemptsLeft <= 0
                ? '3회 응시를 모두 마쳤습니다'
                : answeredCount < quizzes.length
                  ? `${answeredCount} / ${quizzes.length} 응답 완료 — 모두 답해주세요`
                  : `제출하고 채점하기 (${attempts.length + 1}회차)`}
            </button>
          ) : attemptsLeft > 0 ? (
            <button className="primary-btn" onClick={retry}>
              다시 풀기 (남은 기회 {attemptsLeft}회)
            </button>
          ) : (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              3회 응시를 모두 마쳤습니다 — 위 해설을 보며 복습하세요
            </p>
          )}
        </div>
      </section>
      </div>
    </div>
  )
}
