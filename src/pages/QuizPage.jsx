// ============================================================
// 복습퀴즈 (/quiz) — 문항 데이터는 data/quizzes.js
// 동작: 전 문항 선택 전엔 제출 버튼 비활성 → 제출 시 채점
//       (정답 녹색 / 내 오답 빨강 / 해설 표시) → "다시 풀기"로 초기화
// 점수는 저장하지 않는다(무기명 셀프 체크용 — 의도된 설계).
// ============================================================
import { useState } from 'react'
import quizzes from '../data/quizzes.js'

export default function QuizPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const select = (qi, oi) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qi]: oi }))
  }

  const answeredCount = Object.keys(answers).length
  const score = quizzes.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)

  return (
    <div className="container">
      <div className="session-head">
        <h1>복습 퀴즈</h1>
        <p className="meta">3일 전체 범위 · {quizzes.length}문항 · 정답과 해설은 제출 후 공개됩니다</p>
      </div>

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
          <div key={qi} className="quiz-item">
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
                  {String.fromCharCode(9312 + oi)} {opt}
                </button>
              )
            })}
            {submitted && <div className="explain">💡 {quiz.explain}</div>}
          </div>
        ))}

        {!submitted ? (
          <div style={{ textAlign: 'center', margin: '30px 0 60px' }}>
            <button
              className="primary-btn"
              disabled={answeredCount < quizzes.length}
              onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              {answeredCount < quizzes.length
                ? `${answeredCount} / ${quizzes.length} 응답 완료 — 모두 답해주세요`
                : '제출하고 채점하기'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: '30px 0 60px' }}>
            <button className="primary-btn" onClick={() => { setAnswers({}); setSubmitted(false); window.scrollTo(0, 0) }}>
              다시 풀기
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
