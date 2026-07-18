// ============================================================
// 요약정리 데이터 (/summary — 3일차 다음 메뉴)
// ------------------------------------------------------------
// lineage   : 3일 알고리즘 계보 (단계별 흐름)
// algoTable : 알고리즘 비교표 (유형/정책/행동공간/탐험/핵심)
// formulas  : 핵심 공식 모음 (식 + 한 줄 의미)
// dayPoints : 일차별 핵심 정리 (교시 순서대로)
// glossary  : 용어 사전 (학습 순서에 맞춘 카테고리별)
// 산문 필드는 인라인 md(**볼드**·==형광펜==) 지원 — 백틱 금지.
// ============================================================

export const lineage = [
  { step: '표 기반', day: '1일차', desc: 'MDP·벨만 방정식 → DP(모델 있음) → MC/TD(모델 없음) → SARSA/Q-Learning' },
  { step: '가치 기반', day: '2일차 오전', desc: 'Q테이블 → 신경망 근사 + 재현버퍼·타깃넷(DQN) → 선택/평가 분리(Double DQN)' },
  { step: '정책 기반', day: '2일차 오후', desc: '정책 직접 미분(REINFORCE) → 베이스라인 → Critic 결합(A2C)' },
  { step: '연속 제어', day: '3일차 오전', desc: 'Actor-Critic + DQN 기법(DDPG) → 비관적 트윈 Q(TD3)' },
  { step: '최대 엔트로피', day: '3일차 오후', desc: '탐험을 목적함수로(SAC) → 엔트로피 일반화(TAC)' },
]

export const algoTable = [
  { name: 'SARSA', type: '가치·표', policy: 'On', action: '이산', explore: 'ε-greedy', core: '실제 다음 행동으로 TD 목표 — 탐험 위험까지 반영한 보수적 정책' },
  { name: 'Q-Learning', type: '가치·표', policy: 'Off', action: '이산', explore: 'ε-greedy', core: 'max로 TD 목표 — greedy 정책을 직접 학습, DQN의 원형' },
  { name: 'DQN', type: '가치·신경망', policy: 'Off', action: '이산', explore: 'ε-greedy', core: 'Q를 신경망 근사 + 재현버퍼·타깃넷으로 안정화' },
  { name: 'Double DQN', type: '가치·신경망', policy: 'Off', action: '이산', explore: 'ε-greedy', core: '선택(온라인)과 평가(타깃) 분리로 최대화 편향 완화' },
  { name: 'REINFORCE', type: '정책', policy: 'On', action: '둘 다', explore: '확률적 정책', core: '∇logπ × 리턴 — 정책을 직접 미분하는 가장 기본형' },
  { name: 'A2C', type: 'Actor-Critic', policy: 'On', action: '둘 다', explore: '확률적+엔트로피 보너스', core: 'TD 오차를 어드밴티지로 — 매 스텝 저분산 학습' },
  { name: 'DDPG', type: 'Actor-Critic', policy: 'Off', action: '연속', explore: '행동 노이즈', core: '결정적 정책 + Critic 통과 기울기, max를 학습으로 대체' },
  { name: 'TD3', type: 'Actor-Critic', policy: 'Off', action: '연속', explore: '행동 노이즈', core: 'DDPG + 트윈Q·타깃 스무딩·지연 업데이트 (참고)' },
  { name: 'SAC', type: 'Actor-Critic', policy: 'Off', action: '연속', explore: '엔트로피 내장', core: '최대 엔트로피 목적 + 트윈Q + 자동 온도 — 연속 제어 표준' },
  { name: 'TAC', type: 'Actor-Critic', policy: 'Off', action: '연속', explore: '엔트로피 내장(q 조절)', core: 'SAC의 엔트로피를 Tsallis로 일반화 — q로 탐험 모양 선택' },
]

export const formulas = [
  { name: '리턴', f: 'G_t = r_{t+1} + γr_{t+2} + γ²r_{t+3} + …', mean: '미래 보상의 할인 합 — 모든 알고리즘이 최대화하려는 것' },
  { name: '벨만 기대 방정식', f: "V^π(s) = Σ_a π(a|s) Σ_s' P(s'|s,a)[ r + γV^π(s') ]", mean: '지금 가치 = 즉시 보상 + 할인된 다음 가치 (정책 평가의 근거)' },
  { name: '벨만 최적 방정식', f: "V*(s) = max_a Σ_s' P(s'|s,a)[ r + γV*(s') ]", mean: '기대 대신 max — 최적 가치의 조건 (가치 반복의 근거)' },
  { name: 'TD(0) 업데이트', f: 'V(s) ← V(s) + α[ r + γV(s′) − V(s) ]', mean: '한 스텝 관측 + 부트스트랩 — 괄호 안이 TD 오차 δ' },
  { name: 'SARSA', f: "Q(s,a) ← Q(s,a) + α[ r + γQ(s',a') − Q(s,a) ]", mean: "a'는 실제 다음 행동 (on-policy)" },
  { name: 'Q-Learning', f: "Q(s,a) ← Q(s,a) + α[ r + γ max_a' Q(s',a') − Q(s,a) ]", mean: 'max — 행동과 무관하게 greedy를 학습 (off-policy)' },
  { name: 'DQN 손실', f: "L(θ) = E[( r + γ max_a' Q(s',a';θ⁻) − Q(s,a;θ) )²]", mean: 'θ⁻는 타깃넷 — 목표를 고정해 회귀를 안정화' },
  { name: 'Double DQN 목표', f: "r + γ Q(s', argmax_a' Q(s',a';θ), θ⁻)", mean: '선택은 온라인 θ, 평가는 타깃 θ⁻ — 과대평가 억제' },
  { name: '정책 경사 정리', f: '∇J(θ) = E[ ∇log π(a|s;θ) · G_t ]', mean: '좋았던 행동의 로그확률을 올려라 — 로그-미분 트릭의 산물' },
  { name: '베이스라인/어드밴티지', f: '∇J = E[ ∇log π · (G_t − V(s)) ],  δ = r + γV(s′) − V(s)', mean: '평균 대비 채점으로 분산 축소 — TD 오차가 어드밴티지 추정치' },
  { name: 'DPG (결정적 정책 경사)', f: '∇J(θ) = E[ ∇_a Q(s,a)|_{a=μ(s)} · ∇_θ μ(s;θ) ]', mean: 'Critic을 통과해 Actor로 흐르는 연쇄법칙 기울기' },
  { name: '소프트 업데이트', f: 'θ⁻ ← τθ + (1−τ)θ⁻  (τ ≈ 0.005)', mean: '타깃넷이 매 스텝 0.5%씩 따라오는 부드러운 동기화' },
  { name: '최대 엔트로피 목적', f: 'J(π) = E[ Σ r_t + α·H(π(·|s_t)) ]', mean: '보상 + 무작위성 — 탐험을 목적함수에 내장' },
  { name: 'Soft V와 볼츠만 정책', f: 'V(s) = α·log Σ_a exp(Q(s,a)/α),  π(a|s) ∝ exp(Q(s,a)/α)', mean: 'max의 부드러운 버전(log-sum-exp)과 그 최적 정책' },
  { name: 'SAC Actor 손실', f: 'E[ α·log π(a|s) − min(Q₁,Q₂)(s,a) ],  a = rsample', mean: 'Q 높은 곳으로, 엔트로피를 잃지 말며 — 트윈 Q의 min으로 비관적으로' },
  { name: 'Tsallis q-로그', f: 'log_q(x) = (x^{q−1} − 1)/(q − 1)  (q→1이면 log x)', mean: 'SAC의 log를 이것으로 바꾸면 TAC — q>1이면 행동 포기 가능' },
]

export const dayPoints = [
  {
    day: 'DAY 1 — Tabular-based Methods',
    points: [
      '강화학습 = ==평가적·지연·순차적 피드백==으로 배우는 순차적 의사결정 (스케이트 일화: 에이전트는 "남동생처럼" 배운다)',
      'MDP(S, A, P, R, γ)가 문제의 틀 — **마르코프 성질**은 상태 설계가 만든다',
      '**벨만 방정식** = "지금 가치 = 즉시 보상 + 할인된 다음 가치" — 3일 전체를 관통',
      'DP(모델 있음): 평가↔개선의 **GPI** 구조, γ-축약으로 수렴 보장',
      '모델이 없으면 샘플로 — **MC**(무편향·고분산·에피소드 종료 필요) vs **TD**(부트스트랩·저분산·편향)',
      '제어는 Q로 — **SARSA**(on-policy, 보수적) vs **Q-Learning**(off-policy, greedy 학습)',
      'Cliff Walking: ==학습 중 성능과 최종 정책 성능은 다른 지표==',
    ],
  },
  {
    day: 'DAY 2 — Value-based & Policy-based',
    points: [
      '함수 근사의 힘은 **일반화** — 대신 상관관계·움직이는 목표로 불안정 (**deadly triad**)',
      '**DQN의 두 처방**: 경험 재현(상관관계 절단, off-policy 전제)과 타깃 네트워크(목표 고정)',
      'max의 **최대화 편향** → Double DQN이 ==선택(온라인)과 평가(타깃)를 분리==',
      'PyTorch 학습 루프 5단계는 모든 알고리즘 공통 — RL은 ==목표를 스스로 만든다==는 점만 다름',
      '**정책 경사**: 로그-미분 트릭으로 모델 없이 정책을 직접 미분 — 좋았던 행동의 확률을 올려라',
      '베이스라인·**어드밴티지**로 분산 축소 → Critic 결합이 **A2C** (MC→TD 전환의 재현)',
      '엔트로피 보너스로 조기 수렴 방지 — 3일차 최대 엔트로피의 예고편',
    ],
  },
  {
    day: 'DAY 3 — Advanced Actor-Critic',
    points: [
      '연속 행동에선 max 불가 → **DPG**: max를 학습으로 대체, Critic 통과 기울기',
      '**DDPG** = DPG + 재현버퍼 + 소프트 업데이트 + 행동 노이즈 (네트워크 4개)',
      'DDPG의 고질병(과대평가·민감성) → **TD3**: 트윈 Q·타깃 스무딩·지연 업데이트',
      '**최대 엔트로피 RL**: 탐험을 목적함수에 내장 — soft V는 log-sum-exp, 최적 정책은 볼츠만',
      '**SAC 3요소**: tanh-squashed 가우시안 Actor(+로그확률 보정) · 트윈 Q min · 자동 온도 α',
      '**재매개변수화(rsample)**로 샘플링을 통과하는 저분산 기울기',
      '**TAC**: log→log_q 두 줄 교체 — ==q>1이면 가망 없는 행동을 포기(sparse 탐험)==',
      '관통 3질문: ==목표를 무엇으로 만드는가 / 탐험을 어떻게 하는가 / 무엇으로 안정화하는가==',
    ],
  },
]

export const glossary = [
  {
    cat: '기초 개념 (1일차 오전)',
    terms: [
      { ko: '에이전트', en: 'Agent', def: '환경과 상호작용하며 행동을 결정하는 학습 주체' },
      { ko: '환경', en: 'Environment', def: '에이전트의 행동을 받아 다음 상태와 보상을 돌려주는 세계' },
      { ko: '상태', en: 'State (s)', def: '의사결정에 필요한 현재 상황의 요약 — 마르코프 성질은 상태 설계에 달림' },
      { ko: '행동', en: 'Action (a)', def: '에이전트의 선택지 — 이산(버튼) 또는 연속(토크)' },
      { ko: '보상', en: 'Reward (r)', def: '행동 직후 환경이 주는 스칼라 평가 신호' },
      { ko: '리턴', en: 'Return (G)', def: '미래 보상의 할인 합 — 최대화의 실제 대상' },
      { ko: '할인율', en: 'Discount (γ)', def: '미래 보상의 가중치이자 에이전트의 유효 시야 (≈1/(1−γ) 스텝)' },
      { ko: '에피소드', en: 'Episode', def: '시작부터 종료 상태까지의 한 판' },
      { ko: '정책', en: 'Policy (π)', def: '상태→행동 매핑 — 강화학습의 최종 산출물 (결정적/확률적)' },
      { ko: 'MDP', en: 'Markov Decision Process', def: '(S, A, P, R, γ)로 정의되는 순차 의사결정 문제의 수학적 틀' },
      { ko: '마르코프 성질', en: 'Markov Property', def: '미래가 현재 상태에만 의존 — 과거 경로와 무관' },
      { ko: '상태가치함수', en: 'V(s)', def: '상태 s에서 정책을 따를 때의 기대 리턴' },
      { ko: '행동가치함수', en: 'Q(s,a)', def: 's에서 a를 하고 이후 정책을 따를 때의 기대 리턴 — argmax로 모델 없이 행동 선택 가능' },
      { ko: '벨만 방정식', en: 'Bellman Equation', def: '가치의 재귀 관계 — 즉시 보상 + 할인된 다음 가치' },
      { ko: '탐험/활용', en: 'Exploration/Exploitation', def: '새로운 시도 vs 아는 최선 — 모든 RL의 근본 딜레마' },
    ],
  },
  {
    cat: '표 기반 학습 (1일차)',
    terms: [
      { ko: '동적계획법', en: 'DP', def: '모델을 알 때 벨만 방정식을 반복 적용해 푸는 계획(planning)' },
      { ko: '정책 평가/개선', en: 'Evaluation/Improvement', def: 'π의 가치 계산 / 가치 기준 greedy로 π 갱신 — 합쳐서 GPI' },
      { ko: 'GPI', en: 'Generalized Policy Iteration', def: '평가와 개선이 번갈아 수렴하는 거의 모든 RL의 뼈대' },
      { ko: '모델 프리', en: 'Model-free', def: '전이확률 P를 모른 채 경험 샘플만으로 학습' },
      { ko: '몬테카를로', en: 'MC', def: '에피소드 종료 후 실제 리턴의 평균으로 추정 — 무편향·고분산' },
      { ko: '시간차 학습', en: 'TD', def: '한 스텝 관측 + 추정치로 목표 구성 — 저분산·편향, 매 스텝 학습' },
      { ko: 'TD 오차', en: 'TD Error (δ)', def: 'r + γV(s′) − V(s) — "예상보다 좋았나"의 신호' },
      { ko: '부트스트래핑', en: 'Bootstrapping', def: '자신의 추정치로 자신의 목표를 만드는 것' },
      { ko: 'ε-greedy', en: 'Epsilon-greedy', def: '확률 ε로 무작위(탐험), 나머지는 최선(활용)' },
      { ko: 'On-policy', en: 'On-policy', def: '행동하는 정책과 학습하는 정책이 같음 (SARSA, A2C)' },
      { ko: 'Off-policy', en: 'Off-policy', def: '행동과 학습 정책이 다름 — 과거·타인의 경험 재사용 가능 (Q-Learning, DQN, SAC)' },
      { ko: '최대화 편향', en: 'Maximization Bias', def: '노이즈 낀 추정치에 max를 취해 생기는 체계적 과대평가' },
    ],
  },
  {
    cat: '심층 가치·정책 학습 (2일차)',
    terms: [
      { ko: '함수 근사', en: 'Function Approximation', def: 'Q·V·π를 신경망으로 표현 — 힘은 일반화, 대가는 불안정' },
      { ko: '경험 재현', en: 'Experience Replay', def: '전이를 버퍼에 쌓아 무작위 배치로 학습 — 상관관계 절단·재사용' },
      { ko: '타깃 네트워크', en: 'Target Network', def: 'TD 목표 계산 전용 복사본 — 움직이는 목표를 고정' },
      { ko: 'Deadly Triad', en: 'Deadly Triad', def: '함수 근사+부트스트랩+off-policy 조합의 발산 위험' },
      { ko: '정책 경사', en: 'Policy Gradient', def: '기대 리턴을 정책 파라미터로 직접 미분 — 로그-미분 트릭' },
      { ko: '베이스라인', en: 'Baseline', def: '기대값을 바꾸지 않고 분산만 줄이는 기준값 (보통 V(s))' },
      { ko: '어드밴티지', en: 'Advantage A(s,a)', def: '그 상태 평균 대비 행동의 상대적 좋음 — TD 오차로 추정' },
      { ko: 'Actor-Critic', en: 'Actor-Critic', def: '정책(Actor)과 가치(Critic)를 함께 학습 — Critic의 δ가 학습 신호' },
      { ko: '엔트로피 보너스', en: 'Entropy Bonus', def: '정책이 조기에 결정적으로 굳는 것을 막는 정규화 항' },
      { ko: 'GAE', en: 'Generalized Advantage Estimation', def: 'n-step 어드밴티지들의 λ 가중 평균 — PPO의 표준 부품 (참고)' },
    ],
  },
  {
    cat: '연속 제어와 최대 엔트로피 (3일차)',
    terms: [
      { ko: '결정적 정책 경사', en: 'DPG', def: 'a=μ(s)로 두고 Critic을 통과해 Actor로 기울기를 흘리는 방법' },
      { ko: '소프트 업데이트', en: 'Soft Update (τ)', def: '타깃넷을 매 스텝 τ만큼만 섞는 부드러운 동기화' },
      { ko: '트윈 Q', en: 'Clipped Double-Q', def: 'Q 2개의 min을 목표로 — 비관주의로 과대평가 억제 (TD3→SAC)' },
      { ko: '최대 엔트로피 RL', en: 'Maximum Entropy RL', def: '보상 + α·엔트로피를 최대화 — 탐험이 목적함수에 내장' },
      { ko: '온도', en: 'Temperature (α)', def: '보상 vs 엔트로피의 균형 다이얼 — SAC는 자동 학습' },
      { ko: '볼츠만 정책', en: 'Boltzmann Policy', def: 'π ∝ exp(Q/α) — soft 최적화의 해, 확률 0이 없는 분포' },
      { ko: '재매개변수화', en: 'Reparameterization', def: 'a = μ + σ⊙ε로 무작위성을 분리해 샘플링을 미분 가능하게 (rsample)' },
      { ko: 'tanh 스쿼싱', en: 'tanh Squashing', def: '가우시안 샘플을 행동 범위로 누르기 — 로그확률 보정 필수' },
      { ko: 'Tsallis 엔트로피', en: 'Tsallis Entropy', def: 'q-로그로 정의되는 일반화 엔트로피 — q=1이면 샤논' },
      { ko: 'Sparsemax', en: 'Sparsemax', def: '가망 없는 선택지의 확률을 정확히 0으로 — q>1 최적 정책의 형태' },
    ],
  },
]
