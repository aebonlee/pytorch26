// ============================================================
// 복습퀴즈 (/quiz) — 문항 데이터는 data/quizzes.js
// ------------------------------------------------------------
// 왼쪽 사이드바 (대표 지정 디자인, 2026-07-17):
//  ① 1~15 번호 버튼 그리드 — 풀이 여부를 색으로 표시
//     (미풀이=회색 / 풀이함=파랑 / 채점 후 정답=초록·오답=빨강),
//     버튼 클릭 시 해당 문항으로 스크롤
//  ② 그 아래 점수 박스 — 진행 중엔 응답 수, 채점 후엔 점수
//  ③ 그 아래 응시 기록 박스 — 1~3회차 점수와 남은 기회
// 동작:
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

  const scrollToQ = (qi) => {
    document.getElementById(`quiz-q${qi}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="container page-side">
      {/* 사이드바: 번호 버튼 그리드 → 점수 → 응시 기록 */}
      <aside className="side-nav">
        <div className="side-title">문항 풀이 현황</div>
        <div className="quiz-nums">
          {quizzes.map((q, qi) => {
            let cls = 'qnum-btn'
            if (submitted) cls += answers[qi] === q.answer ? ' correct' : ' wrong'
            else if (answers[qi] !== undefined) cls += ' answered'
            return (
              <button key={qi} type="button" className={cls} onClick={() => scrollToQ(qi)}>
                {qi + 1}
              </button>
            )
          })}
        </div>
        <div className="quiz-legend">
          {submitted ? (
            <>
              <i style={{ background: 'var(--green)' }} />정답{' '}
              <i style={{ background: 'var(--red)' }} />오답
            </>
          ) : (
            <>
              <i style={{ background: 'var(--blue)' }} />풀이함{' '}
              <i style={{ background: 'var(--border)' }} />미풀이
            </>
          )}
        </div>

        <div className="quiz-side-box">
          {submitted ? (
            <>이번 점수<br /><span className="big">{score} / {quizzes.length}</span></>
          ) : (
            <>응답 진행<br /><span className="big">{answeredCount} / {quizzes.length}</span></>
          )}
        </div>

        <div className="quiz-side-box">
          <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>응시 기록 (최대 {MAX_ATTEMPTS}회)</div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="attempt-row">
              <span>{i + 1}회차</span>
              {attempts[i]
                ? <span className="val">{attempts[i].score} / {attempts[i].total}</span>
                : <span className="val empty">—</span>}
            </div>
          ))}
          <div style={{ marginTop: 6 }}>
            {attemptsLeft > 0
              ? <>남은 기회 <b style={{ color: 'var(--accent)' }}>{attemptsLeft}회</b></>
              : <b style={{ color: 'var(--accent)' }}>응시 완료</b>}
          </div>
        </div>
      </aside>
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
