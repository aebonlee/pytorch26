import { useState } from 'react'

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code.source).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div className="code-block">
      <div className="code-head">
        <span>🐍 {code.filename}</span>
        <button className="copy-btn" onClick={copy}>{copied ? '✓ 복사됨' : '복사'}</button>
      </div>
      <pre><code>{code.source}</code></pre>
    </div>
  )
}
