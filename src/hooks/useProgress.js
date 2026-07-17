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

  const toggle = useCallback((sessionId) => {
    setProgress((prev) => {
      const next = { ...prev, [sessionId]: !prev[sessionId] }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { progress, toggle }
}
