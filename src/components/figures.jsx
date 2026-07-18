// ============================================================
// 강의 도해(SVG) 라이브러리
// ------------------------------------------------------------
// 이론 블록의 fig: '<id>' 필드가 여기 FIGURES의 키를 가리키고,
// SessionPage가 본문 아래에 <Figure id=.../>로 렌더링한다.
// - 색은 전부 CSS 변수(var(--text) 등) → 라이트/다크 자동 대응
// - 곡선/막대 좌표는 렌더 시 JS로 계산 (근사 데이터 하드코딩 없음)
// - marker(화살촉) id는 도해별 접두사로 유일하게 — 한 페이지에
//   도해가 여러 개 떠도 충돌하지 않게
// ============================================================

const DIM = 'var(--text-dim)'
const TXT = 'var(--text)'
const ACC = 'var(--accent)'
const BRD = 'var(--border)'
const GRN = 'var(--green)'
const BLU = 'var(--blue)'
const YLW = 'var(--yellow)'

function ArrowDef({ id, color }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill={color} />
    </marker>
  )
}

// ── 1. 에이전트-환경 상호작용 루프 ──────────────────────────
function AgentEnvLoop() {
  return (
    <svg viewBox="0 0 640 250" fill="none">
      <defs>
        <ArrowDef id="ae-a" color={ACC} />
        <ArrowDef id="ae-d" color={DIM} />
      </defs>
      <rect x="60" y="85" width="190" height="80" rx="14" stroke={ACC} strokeWidth="2.5" fill="var(--accent-soft)" />
      <text x="155" y="120" textAnchor="middle" fill={TXT} fontSize="17" fontWeight="800">에이전트</text>
      <text x="155" y="145" textAnchor="middle" fill={DIM} fontSize="12">정책 π(a|s)</text>

      <rect x="390" y="85" width="190" height="80" rx="14" stroke={BRD} strokeWidth="2.5" fill="var(--bg-soft)" />
      <text x="485" y="120" textAnchor="middle" fill={TXT} fontSize="17" fontWeight="800">환경</text>
      <text x="485" y="145" textAnchor="middle" fill={DIM} fontSize="12">P(s'|s,a), R</text>

      <path d="M 250 100 C 300 55, 340 55, 388 98" stroke={ACC} strokeWidth="2.5" markerEnd="url(#ae-a)" />
      <text x="320" y="52" textAnchor="middle" fill={ACC} fontSize="13.5" fontWeight="700">행동 a_t</text>

      <path d="M 390 152 C 340 197, 300 197, 252 154" stroke={DIM} strokeWidth="2.5" markerEnd="url(#ae-d)" />
      <text x="320" y="215" textAnchor="middle" fill={DIM} fontSize="13.5" fontWeight="700">상태 s_t+1 · 보상 r_t+1</text>

      <text x="320" y="240" textAnchor="middle" fill={DIM} fontSize="11.5">매 시점 t마다 반복 — 목표: 리턴 G = Σ γ^t r 의 최대화</text>
    </svg>
  )
}

// ── 2. ε-greedy 밴딧 평균 보상 막대 ─────────────────────────
function BanditBars() {
  const data = [
    { eps: 'ε = 0', v: 1.02, note: '탐험 없음' },
    { eps: 'ε = 0.01', v: 1.22, note: '' },
    { eps: 'ε = 0.1', v: 1.42, note: '균형점' },
    { eps: 'ε = 0.5', v: 1.1, note: '과잉 탐험' },
  ]
  const max = 1.55
  return (
    <svg viewBox="0 0 640 250" fill="none">
      <line x1="70" y1="200" x2="600" y2="200" stroke={BRD} strokeWidth="1.5" />
      <text x="30" y="110" fill={DIM} fontSize="12" transform="rotate(-90 30 110)" textAnchor="middle">평균 보상</text>
      {data.map((d, i) => {
        const h = (d.v / max) * 160
        const x = 110 + i * 130
        const best = d.eps === 'ε = 0.1'
        return (
          <g key={i}>
            <rect x={x} y={200 - h} width="70" height={h} rx="6" fill={best ? ACC : 'var(--bg-soft)'} stroke={best ? ACC : BRD} strokeWidth="1.5" />
            <text x={x + 35} y={200 - h - 10} textAnchor="middle" fill={best ? ACC : TXT} fontSize="13" fontWeight="700">{d.v.toFixed(2)}</text>
            <text x={x + 35} y="222" textAnchor="middle" fill={TXT} fontSize="13" fontWeight="700">{d.eps}</text>
            {d.note && <text x={x + 35} y="241" textAnchor="middle" fill={best ? ACC : DIM} fontSize="11">{d.note}</text>}
          </g>
        )
      })}
    </svg>
  )
}

// ── 3. 벨만 백업 다이어그램 ────────────────────────────────
function BackupDiagram() {
  return (
    <svg viewBox="0 0 640 260" fill="none">
      <defs><ArrowDef id="bk-d" color={DIM} /></defs>
      {/* 루트 상태 s */}
      <circle cx="320" cy="40" r="16" stroke={TXT} strokeWidth="2.5" fill="var(--bg-card)" />
      <text x="320" y="45" textAnchor="middle" fill={TXT} fontSize="13" fontWeight="800">s</text>
      {/* 행동 노드 */}
      {[
        { x: 180, label: 'a₁' },
        { x: 460, label: 'a₂' },
      ].map((a, i) => (
        <g key={i}>
          <line x1="320" y1="56" x2={a.x} y2="118" stroke={DIM} strokeWidth="2" markerEnd="url(#bk-d)" />
          <circle cx={a.x} cy="130" r="10" fill={ACC} />
          <text x={a.x + (i === 0 ? -26 : 26)} y="134" textAnchor="middle" fill={ACC} fontSize="13" fontWeight="700">{a.label}</text>
        </g>
      ))}
      <text x="228" y="80" fill={DIM} fontSize="11.5">π(a|s)</text>
      {/* 다음 상태 */}
      {[
        { from: 180, x: 100 }, { from: 180, x: 250 },
        { from: 460, x: 390 }, { from: 460, x: 540 },
      ].map((s2, i) => (
        <g key={i}>
          <line x1={s2.from} y1="140" x2={s2.x} y2="205" stroke={DIM} strokeWidth="2" markerEnd="url(#bk-d)" />
          <circle cx={s2.x} cy="218" r="13" stroke={TXT} strokeWidth="2" fill="var(--bg-card)" />
          <text x={s2.x} y="223" textAnchor="middle" fill={TXT} fontSize="11" fontWeight="700">s'</text>
        </g>
      ))}
      <text x="128" y="180" fill={DIM} fontSize="11.5">P(s'|s,a), r</text>
      <text x="320" y="253" textAnchor="middle" fill={DIM} fontSize="12">V(s) = Σ π(a|s) Σ P(s'|s,a) [ r + γV(s') ] — 아래 값들을 위로 "백업"</text>
    </svg>
  )
}

// ── 4. 할인율 γ 곡선 (γ^t) ─────────────────────────────────
function GammaCurves() {
  const W = 520, H = 170, X0 = 80, Y0 = 200
  const curve = (g) =>
    Array.from({ length: 101 }, (_, t) => {
      const x = X0 + (t / 100) * W
      const y = Y0 - Math.pow(g, t) * H
      return (t === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
    }).join(' ')
  return (
    <svg viewBox="0 0 640 250" fill="none">
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={BRD} strokeWidth="1.5" />
      <line x1={X0} y1={Y0} x2={X0} y2="20" stroke={BRD} strokeWidth="1.5" />
      <path d={curve(0.9)} stroke={YLW} strokeWidth="2.5" />
      <path d={curve(0.99)} stroke={ACC} strokeWidth="2.5" />
      <text x={X0 + 108} y="120" fill={YLW} fontSize="13" fontWeight="700">γ = 0.9 (유효시야 ≈ 10스텝)</text>
      <text x={X0 + 260} y="55" fill={ACC} fontSize="13" fontWeight="700">γ = 0.99 (유효시야 ≈ 100스텝)</text>
      <text x={X0 - 12} y={Y0 - H + 5} textAnchor="end" fill={DIM} fontSize="11">1.0</text>
      <text x={X0 - 12} y={Y0 + 4} textAnchor="end" fill={DIM} fontSize="11">0</text>
      <text x={X0 + W} y={Y0 + 20} textAnchor="end" fill={DIM} fontSize="11">t (스텝) → 100</text>
      <text x="320" y="245" textAnchor="middle" fill={DIM} fontSize="12">t스텝 뒤 보상의 가중치 γ^t — γ가 에이전트의 시야를 정한다</text>
    </svg>
  )
}

// ── 5. GPI (평가↔개선 수렴) ────────────────────────────────
function GpiDiagram() {
  const zig = [
    [90, 190], [190, 78], [268, 168], [345, 95], [408, 150], [462, 110], [505, 133], [535, 122],
  ]
  return (
    <svg viewBox="0 0 640 250" fill="none">
      <defs><ArrowDef id="gp-a" color={ACC} /></defs>
      <line x1="60" y1="200" x2="560" y2="118" stroke={BRD} strokeWidth="2" />
      <line x1="60" y1="60" x2="560" y2="118" stroke={BRD} strokeWidth="2" />
      <text x="52" y="205" textAnchor="end" fill={TXT} fontSize="13" fontWeight="700">π (정책)</text>
      <text x="52" y="65" textAnchor="end" fill={TXT} fontSize="13" fontWeight="700">V (가치)</text>
      <path d={zig.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ')} stroke={ACC} strokeWidth="2.5" markerEnd="url(#gp-a)" />
      <circle cx="560" cy="118" r="7" fill={GRN} />
      <text x="578" y="123" fill={GRN} fontSize="13.5" fontWeight="800">π*, V*</text>
      <text x="150" y="128" fill={DIM} fontSize="11.5">평가: V를 π에 맞춤 ↑</text>
      <text x="300" y="215" fill={DIM} fontSize="11.5">개선: π를 V에 대해 greedy ↓</text>
      <text x="320" y="245" textAnchor="middle" fill={DIM} fontSize="12">평가와 개선이 번갈아 당기며 최적점으로 수렴 — 거의 모든 RL 알고리즘의 뼈대</text>
    </svg>
  )
}

// ── 6. MC ↔ TD 스펙트럼 ───────────────────────────────────
function McTdSpectrum() {
  return (
    <svg viewBox="0 0 640 220" fill="none">
      <defs>
        <linearGradient id="mt-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BLU} />
          <stop offset="1" stopColor={ACC} />
        </linearGradient>
        <ArrowDef id="mt-b" color={BLU} />
        <ArrowDef id="mt-a" color={ACC} />
      </defs>
      <rect x="80" y="95" width="480" height="16" rx="8" fill="url(#mt-g)" opacity="0.85" />
      {[
        { x: 88, l: 'TD(0)', c: BLU }, { x: 250, l: 'n-step', c: TXT }, { x: 545, l: 'MC', c: ACC },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy="103" r="7" fill={m.c} stroke="var(--bg-card)" strokeWidth="2" />
          <text x={m.x} y="80" textAnchor="middle" fill={m.c} fontSize="14" fontWeight="800">{m.l}</text>
        </g>
      ))}
      <text x="88" y="140" fill={BLU} fontSize="12" fontWeight="700">← 분산 낮음 · 편향 있음</text>
      <text x="88" y="158" fill={DIM} fontSize="11.5">부트스트래핑 · 매 스텝 학습</text>
      <text x="552" y="140" textAnchor="end" fill={ACC} fontSize="12" fontWeight="700">분산 높음 · 편향 없음 →</text>
      <text x="552" y="158" textAnchor="end" fill={DIM} fontSize="11.5">실제 리턴 · 에피소드 종료 필요</text>
      <text x="320" y="200" textAnchor="middle" fill={DIM} fontSize="12">TD(λ)는 이 스펙트럼 전체를 λ 가중으로 섞은 것 — 중간 지점(n=4~10)이 유리한 경우가 많다</text>
    </svg>
  )
}

// ── 7. Cliff Walking 경로 비교 ─────────────────────────────
function CliffPaths() {
  const cell = 40, ox = 60, oy = 30
  const px = (c) => ox + c * cell + cell / 2
  const py = (r) => oy + r * cell + cell / 2
  const safe = [[3, 0], [0, 0], [0, 11], [3, 11]]
  const fast = [[3, 0], [2, 0], [2, 11], [3, 11]]
  const toPath = (pts) => pts.map((p, i) => (i === 0 ? 'M' : 'L') + px(p[1]) + ',' + py(p[0])).join(' ')
  return (
    <svg viewBox="0 0 640 250" fill="none">
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => {
          const isCliff = r === 3 && c > 0 && c < 11
          return (
            <rect key={r + '-' + c} x={ox + c * cell} y={oy + r * cell} width={cell} height={cell}
              fill={isCliff ? 'rgba(248, 81, 73, 0.25)' : 'var(--bg-soft)'} stroke={BRD} strokeWidth="1" />
          )
        })
      )}
      <text x={px(0)} y={py(3) + 5} textAnchor="middle" fill={TXT} fontSize="14" fontWeight="800">S</text>
      <text x={px(11)} y={py(3) + 5} textAnchor="middle" fill={TXT} fontSize="14" fontWeight="800">G</text>
      <text x={px(5.5)} y={py(3) + 5} textAnchor="middle" fill="var(--red)" fontSize="11.5" fontWeight="700">절벽 (-100)</text>
      <path d={toPath(safe)} stroke={BLU} strokeWidth="3" strokeLinejoin="round" fill="none" opacity="0.9" />
      <path d={toPath(fast)} stroke={ACC} strokeWidth="3" strokeLinejoin="round" fill="none" opacity="0.9" />
      <text x="70" y="222" fill={BLU} fontSize="12.5" fontWeight="700">— SARSA: 안전 경로 (탐험 위험까지 반영)</text>
      <text x="360" y="222" fill={ACC} fontSize="12.5" fontWeight="700">— Q-Learning: 최단 경로 (greedy 기준)</text>
      <text x="320" y="244" textAnchor="middle" fill={DIM} fontSize="12">같은 환경, 같은 데이터 — 목표(target)의 정의가 다른 성격의 정책을 만든다</text>
    </svg>
  )
}

// ── 8. DQN 파이프라인 ──────────────────────────────────────
function DqnPipeline() {
  const box = (x, y, w, h, label, sub, hl) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" stroke={hl ? ACC : BRD} strokeWidth="2" fill={hl ? 'var(--accent-soft)' : 'var(--bg-soft)'} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 5)} textAnchor="middle" fill={TXT} fontSize="13" fontWeight="800">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fill={DIM} fontSize="10.5">{sub}</text>}
    </g>
  )
  return (
    <svg viewBox="0 0 640 260" fill="none">
      <defs><ArrowDef id="dq-d" color={DIM} /><ArrowDef id="dq-a" color={ACC} /></defs>
      {box(20, 30, 110, 52, '환경', 'CartPole')}
      {box(190, 30, 150, 52, '재현 버퍼', "(s, a, r, s') 저장")}
      {box(400, 30, 110, 52, '미니배치', '무작위 64개')}
      {box(80, 160, 170, 56, '온라인 Q(s,a;θ)', '매 스텝 학습', true)}
      {box(380, 160, 170, 56, '타깃 Q(s,a;θ⁻)', 'TD 목표 계산 전용')}
      <line x1="130" y1="56" x2="186" y2="56" stroke={DIM} strokeWidth="2" markerEnd="url(#dq-d)" />
      <line x1="340" y1="56" x2="396" y2="56" stroke={DIM} strokeWidth="2" markerEnd="url(#dq-d)" />
      <path d="M 455 82 L 455 156" stroke={DIM} strokeWidth="2" markerEnd="url(#dq-d)" />
      <path d="M 420 82 C 300 110, 220 120, 175 156" stroke={DIM} strokeWidth="2" markerEnd="url(#dq-d)" />
      <path d="M 380 195 L 258 195" stroke={ACC} strokeWidth="2.2" markerEnd="url(#dq-a)" />
      <text x="318" y="188" textAnchor="middle" fill={ACC} fontSize="11.5" fontWeight="700">TD 목표 → 손실·역전파</text>
      <path d="M 250 205 L 376 205" stroke={DIM} strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#dq-d)" />
      <text x="318" y="222" textAnchor="middle" fill={DIM} fontSize="11">주기적으로 θ 복사 (동기화)</text>
      <text x="320" y="252" textAnchor="middle" fill={DIM} fontSize="12">버퍼가 상관관계를 끊고, 타깃넷이 목표를 고정한다 — DQN의 두 처방</text>
    </svg>
  )
}

// ── 9. Actor-Critic 구조 ───────────────────────────────────
function ActorCriticLoop() {
  return (
    <svg viewBox="0 0 640 270" fill="none">
      <defs><ArrowDef id="ac-d" color={DIM} /><ArrowDef id="ac-a" color={ACC} /><ArrowDef id="ac-g" color={GRN} /></defs>
      <rect x="60" y="40" width="160" height="56" rx="10" stroke={ACC} strokeWidth="2.2" fill="var(--accent-soft)" />
      <text x="140" y="64" textAnchor="middle" fill={TXT} fontSize="13.5" fontWeight="800">Actor π(a|s;θ)</text>
      <text x="140" y="84" textAnchor="middle" fill={DIM} fontSize="10.5">행동 결정</text>
      <rect x="60" y="170" width="160" height="56" rx="10" stroke={BLU} strokeWidth="2.2" fill="var(--bg-soft)" />
      <text x="140" y="194" textAnchor="middle" fill={TXT} fontSize="13.5" fontWeight="800">Critic V(s;w)</text>
      <text x="140" y="214" textAnchor="middle" fill={DIM} fontSize="10.5">행동 평가</text>
      <rect x="440" y="105" width="140" height="56" rx="10" stroke={BRD} strokeWidth="2.2" fill="var(--bg-soft)" />
      <text x="510" y="138" textAnchor="middle" fill={TXT} fontSize="13.5" fontWeight="800">환경</text>
      <path d="M 220 68 C 330 68, 400 95, 438 118" stroke={DIM} strokeWidth="2" markerEnd="url(#ac-d)" />
      <text x="330" y="72" textAnchor="middle" fill={DIM} fontSize="11.5">행동 a</text>
      <path d="M 440 150 C 380 185, 300 198, 224 198" stroke={DIM} strokeWidth="2" markerEnd="url(#ac-d)" />
      <text x="345" y="205" textAnchor="middle" fill={DIM} fontSize="11.5">r, s'</text>
      <rect x="270" y="118" width="110" height="40" rx="8" stroke={GRN} strokeWidth="2" fill="var(--bg-card)" />
      <text x="325" y="143" textAnchor="middle" fill={GRN} fontSize="12.5" fontWeight="800">TD 오차 δ</text>
      <path d="M 220 185 C 250 170, 258 165, 272 152" stroke={GRN} strokeWidth="2" markerEnd="url(#ac-g)" />
      <path d="M 300 118 C 270 100, 245 92, 224 82" stroke={GRN} strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#ac-g)" />
      <text x="252" y="98" textAnchor="end" fill={GRN} fontSize="10.5">정책 갱신 신호</text>
      <path d="M 300 158 C 275 175, 255 182, 226 188" stroke={GRN} strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#ac-g)" />
      <text x="320" y="262" textAnchor="middle" fill={DIM} fontSize="12">Critic이 만든 TD 오차 하나가 두 네트워크의 학습 신호가 된다</text>
    </svg>
  )
}

// ── 10. DDPG 4개 네트워크와 기울기 흐름 ─────────────────────
function DdpgFlow() {
  const box = (x, y, label, sub, dashed, color) => (
    <g>
      <rect x={x} y={y} width="180" height="54" rx="10" stroke={color || BRD} strokeWidth="2"
        strokeDasharray={dashed ? '6 4' : 'none'} fill={dashed ? 'var(--bg-card)' : 'var(--bg-soft)'} />
      <text x={x + 90} y={y + 23} textAnchor="middle" fill={TXT} fontSize="13" fontWeight="800">{label}</text>
      <text x={x + 90} y={y + 41} textAnchor="middle" fill={DIM} fontSize="10.5">{sub}</text>
    </g>
  )
  return (
    <svg viewBox="0 0 640 280" fill="none">
      <defs><ArrowDef id="dd-d" color={DIM} /><ArrowDef id="dd-a" color={ACC} /></defs>
      {box(60, 40, 'Actor μ(s;θ)', '상태 → 연속 행동', false, ACC)}
      {box(400, 40, 'Critic Q(s,a;w)', '(상태, 행동) → 가치', false, BLU)}
      {box(60, 190, 'Target Actor μ′', '소프트 업데이트 τ', true)}
      {box(400, 190, 'Target Critic Q′', 'TD 목표 계산', true)}
      <line x1="240" y1="67" x2="396" y2="67" stroke={DIM} strokeWidth="2" markerEnd="url(#dd-d)" />
      <text x="318" y="60" textAnchor="middle" fill={DIM} fontSize="11.5">a = μ(s)</text>
      <path d="M 400 90 C 330 120, 260 120, 244 94" stroke={ACC} strokeWidth="2.4" markerEnd="url(#dd-a)" />
      <text x="322" y="130" textAnchor="middle" fill={ACC} fontSize="11.5" fontWeight="700">∇a Q — Critic을 통과해 Actor로 흐르는 기울기</text>
      <line x1="150" y1="94" x2="150" y2="186" stroke={DIM} strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#dd-d)" />
      <line x1="490" y1="94" x2="490" y2="186" stroke={DIM} strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#dd-d)" />
      <text x="163" y="145" fill={DIM} fontSize="10.5">τ = 0.005</text>
      <text x="503" y="145" fill={DIM} fontSize="10.5">τ = 0.005</text>
      <line x1="400" y1="217" x2="244" y2="217" stroke={DIM} strokeWidth="2" markerEnd="url(#dd-d)" />
      <text x="322" y="210" textAnchor="middle" fill={DIM} fontSize="11">타깃끼리 y = r + γQ'(s', μ'(s')) 계산</text>
      <text x="320" y="270" textAnchor="middle" fill={DIM} fontSize="12">총 4개 네트워크 — 학습은 위 2개, 아래 타깃 2개는 천천히 따라온다</text>
    </svg>
  )
}

// ── 11. 온도 α에 따른 볼츠만 정책 분포 ──────────────────────
function EntropyAlphaBars() {
  const Q = [1.0, 0.9, 0.2, -1.0]
  const groups = [
    { alpha: 0.05, label: 'α = 0.05 (거의 greedy)' },
    { alpha: 0.5, label: 'α = 0.5 (좋은 해들 포착)' },
    { alpha: 5.0, label: 'α = 5 (탐험 극대화)' },
  ]
  const softmax = (alpha) => {
    const e = Q.map((q) => Math.exp(q / alpha))
    const s = e.reduce((a, b) => a + b, 0)
    return e.map((v) => v / s)
  }
  return (
    <svg viewBox="0 0 640 240" fill="none">
      {groups.map((g, gi) => {
        const probs = softmax(g.alpha)
        const gx = 45 + gi * 200
        return (
          <g key={gi}>
            {probs.map((p, i) => {
              const h = p * 140
              return (
                <g key={i}>
                  <rect x={gx + i * 38} y={175 - h} width="28" height={h} rx="4"
                    fill={i === 0 ? ACC : i === 3 ? 'var(--bg-soft)' : 'var(--accent-soft)'}
                    stroke={i === 3 ? BRD : ACC} strokeWidth="1.2" />
                  <text x={gx + i * 38 + 14} y={168 - h} textAnchor="middle" fill={DIM} fontSize="10">{(p * 100).toFixed(0)}%</text>
                  <text x={gx + i * 38 + 14} y="192" textAnchor="middle" fill={DIM} fontSize="10">a{i + 1}</text>
                </g>
              )
            })}
            <text x={gx + 71} y="212" textAnchor="middle" fill={TXT} fontSize="11.5" fontWeight="700">{g.label}</text>
          </g>
        )
      })}
      <text x="320" y="235" textAnchor="middle" fill={DIM} fontSize="12">π ∝ exp(Q/α), Q = [1.0, 0.9, 0.2, −1.0] — α가 탐험의 양을 연속적으로 조절한다</text>
    </svg>
  )
}

// ── 12. −log vs −log_q (샤논 vs Tsallis) ───────────────────
function QlogCurves() {
  const X0 = 90, Y0 = 190, W = 470, H = 150
  const toXY = (x, y, yMax) => [X0 + x * W, Y0 - (y / yMax) * H]
  const yMax = 4.6
  const shannon = Array.from({ length: 99 }, (_, i) => {
    const x = 0.01 + (i / 98) * 0.99
    const [px, py] = toXY(x, Math.min(-Math.log(x), yMax), yMax)
    return (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1)
  }).join(' ')
  const tsallis = Array.from({ length: 99 }, (_, i) => {
    const x = 0.01 + (i / 98) * 0.99
    const [px, py] = toXY(x, 1 - x, yMax)   // q=2: -log_2(x) = 1 - x
    return (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1)
  }).join(' ')
  return (
    <svg viewBox="0 0 640 240" fill="none">
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={BRD} strokeWidth="1.5" />
      <line x1={X0} y1={Y0} x2={X0} y2="25" stroke={BRD} strokeWidth="1.5" />
      <path d={shannon} stroke={ACC} strokeWidth="2.5" />
      <path d={tsallis} stroke={GRN} strokeWidth="2.5" />
      <text x={X0 + 55} y="48" fill={ACC} fontSize="13" fontWeight="700">−log x (샤논, q=1) — 0 근처에서 발산</text>
      <text x={X0 + 190} y="152" fill={GRN} fontSize="13" fontWeight="700">−log_q x (q=2) = 1 − x — 유한!</text>
      <text x={X0 - 10} y={Y0 + 4} textAnchor="end" fill={DIM} fontSize="11">0</text>
      <text x={X0 + W} y={Y0 + 18} textAnchor="end" fill={DIM} fontSize="11">π(a|s) → 1</text>
      <text x="320" y="232" textAnchor="middle" fill={DIM} fontSize="12">확률을 0으로 만드는 비용 — 샤논은 무한대(모든 행동 유지 강제), Tsallis(q&gt;1)는 유한(행동 포기 가능)</text>
    </svg>
  )
}

// ── 0. 스케이트 배우기 — 두 학습 방식의 학습곡선 ─────────────
function SkateCurves() {
  const X0 = 80, Y0 = 195, W = 480, H = 150
  // 지도학습형(손 잡고 정석): 빠른 출발, 이른 정체
  const guided = Array.from({ length: 101 }, (_, i) => {
    const t = i / 100
    const y = 0.62 * (1 - Math.exp(-6 * t))
    const px = X0 + t * W, py = Y0 - y * H
    return (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1)
  }).join(' ')
  // 시행착오형(넘어지며 스스로): 느린 출발, 늦게 추월
  const trial = Array.from({ length: 101 }, (_, i) => {
    const t = i / 100
    const y = 0.95 / (1 + Math.exp(-9 * (t - 0.45)))
    const px = X0 + t * W, py = Y0 - y * H
    return (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1)
  }).join(' ')
  return (
    <svg viewBox="0 0 640 250" fill="none">
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={BRD} strokeWidth="1.5" />
      <line x1={X0} y1={Y0} x2={X0} y2="25" stroke={BRD} strokeWidth="1.5" />
      <path d={guided} stroke={BLU} strokeWidth="2.5" />
      <path d={trial} stroke={ACC} strokeWidth="2.5" />
      <circle cx={X0 + 0.58 * W} cy={Y0 - 0.6 * H} r="5" fill={GRN} />
      <text x={X0 + 0.58 * W + 12} y={Y0 - 0.6 * H - 8} fill={GRN} fontSize="11.5" fontWeight="700">역전!</text>
      <text x={X0 + 105} y={Y0 - 0.52 * H} fill={BLU} fontSize="12.5" fontWeight="700">손 잡고 정석으로 (지도형)</text>
      <text x={X0 + 105} y={Y0 - 0.52 * H + 16} fill={DIM} fontSize="10.5">빨리 늘지만 이르게 정체</text>
      <text x={X0 + 300} y={Y0 - 0.93 * H} fill={ACC} fontSize="12.5" fontWeight="700">넘어지며 스스로 (시행착오형)</text>
      <text x={X0 + 300} y={Y0 - 0.93 * H + 16} fill={DIM} fontSize="10.5">초반엔 엎어지지만 결국 더 높이</text>
      <text x={X0 + W} y={Y0 + 18} textAnchor="end" fill={DIM} fontSize="11">연습 시간 →</text>
      <text x="30" y="110" fill={DIM} fontSize="12" transform="rotate(-90 30 110)" textAnchor="middle">실력</text>
      <text x="320" y="243" textAnchor="middle" fill={DIM} fontSize="12">넘어짐(벌점)과 나아감(보상)만으로 배운 전략이 결국 더 멀리 간다</text>
    </svg>
  )
}

export const FIGURES = {
  skate: { caption: '그래프 — 스케이트 배우기: 정석 지도 vs 시행착오, 두 학습곡선', C: SkateCurves },
  'agent-env': { caption: '그림 — 에이전트-환경 상호작용 루프', C: AgentEnvLoop },
  'bandit-eps': { caption: '그래프 — ε별 평균 보상 (10-armed bandit, 실습 코드 결과의 전형)', C: BanditBars },
  backup: { caption: '그림 — 벨만 방정식의 백업 다이어그램', C: BackupDiagram },
  gamma: { caption: '그래프 — 할인율 γ에 따른 미래 보상 가중치', C: GammaCurves },
  gpi: { caption: '그림 — 일반화된 정책 반복(GPI)의 수렴', C: GpiDiagram },
  'mc-td': { caption: '그림 — MC와 TD를 잇는 bias-variance 스펙트럼', C: McTdSpectrum },
  cliff: { caption: '그림 — Cliff Walking에서 SARSA vs Q-Learning의 경로', C: CliffPaths },
  dqn: { caption: '그림 — DQN 학습 파이프라인 (재현 버퍼 + 타깃 네트워크)', C: DqnPipeline },
  'actor-critic': { caption: '그림 — Actor-Critic 구조와 TD 오차의 흐름', C: ActorCriticLoop },
  ddpg: { caption: '그림 — DDPG의 4개 네트워크와 기울기 흐름', C: DdpgFlow },
  'entropy-alpha': { caption: '그래프 — 온도 α에 따른 볼츠만 정책 π ∝ exp(Q/α)', C: EntropyAlphaBars },
  qlog: { caption: '그래프 — 샤논 −log vs Tsallis −log_q (q=2)', C: QlogCurves },
}

export default function Figure({ id }) {
  const fig = FIGURES[id]
  if (!fig) return null
  const C = fig.C
  return (
    <figure className="fig-box">
      <C />
      <figcaption className="fig-cap">{fig.caption}</figcaption>
    </figure>
  )
}
