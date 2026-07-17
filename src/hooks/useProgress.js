// ============================================================
// 학습 진도 훅 (로그인 없음 — 브라우저 localStorage에만 저장)
// ------------------------------------------------------------
// 저장 형식: { "d1s3": true, "d2s7": true, ... }
//   키는 curriculum.js의 sessionKey(dayId, slot)가 만든다.
// 소규모 공개과정(7명)이라 Supabase 같은 서버 저장을 쓰지 않는
// 것이 의도된 설계 — 서버 진도 저장을 추가하려면 이 훅만 교체하면
// 되도록 사용처(Home/DayPage/SessionPage)는 모두 이 훅을 통한다.
// ============================================================
import { useState, useCallback } from 'react'

const KEY = 'pytorch26_progress'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export default function useProgress() {
  const [progress, setProgress] = useState(load)

  // 완료 <-> 미완료 토글. 상태와 localStorage를 동시에 갱신한다.
  const toggle = useCallback((sessionId) => {
    setProgress((prev) => {
      const next = { ...prev, [sessionId]: !prev[sessionId] }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { progress, toggle }
}
