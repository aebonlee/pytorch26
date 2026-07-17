// ============================================================
// 1일차 — Tabular-based methods (멀티캠퍼스 공식 목차 7교시)
// ------------------------------------------------------------
// 코드 재사용 흐름: 2교시의 GridWorld(P, TERMINALS, n_states,
// n_actions)를 3~5교시 DP·MC·TD 코드가 그대로 이어 쓴다.
// 수업에서는 하나의 노트북/파일에 이어 붙이며 진행하는 전제.
// 세션 스키마 설명은 curriculum.js 상단 주석 참고.
// ============================================================
export default {
  id: 1,
  date: '2026-07-27 (월)',
  theme: 'Tabular-based Methods',
  desc: '강화학습의 뼈대가 되는 MDP·동적계획법·시간차 학습을 표 기반 방법으로 익힙니다.',
  sessions: [
    {
      slot: 1,
      time: '09:30 ~ 10:30',
      title: '강화학습 소개',
      kind: 'theory',
      difficulty: 2,
      importance: 4,
      objectives: [
        '강화학습이 지도학습·비지도학습과 어떻게 다른지 설명할 수 있다',
        '에이전트-환경 상호작용 루프(상태·행동·보상)를 이해한다',
        '탐험(Exploration)과 활용(Exploitation)의 트레이드오프를 이해한다',
      ],
      theory: [
        {
          h: '강화학습이란?',
          p: `강화학습(Reinforcement Learning)은 에이전트(Agent)가 환경(Environment)과 상호작용하며 ==보상(Reward)을 최대화하는 행동 전략을 스스로 학습==하는 기계학습 패러다임입니다.
지도학습처럼 "정답 레이블"이 주어지지 않고, 비지도학습처럼 구조만 찾는 것도 아닙니다.\n행동의 결과로 주어지는 **평가적(evaluative) 피드백**만으로 학습한다는 점이 핵심입니다.
알파고, 로봇 제어, 게임 AI, 추천 시스템, 최근에는 LLM의 RLHF까지 — 순차적 의사결정이 필요한 곳이라면 어디든 적용됩니다.`,
        },
        {
          h: '에이전트-환경 루프',
          p: `매 시점 t마다 다음 과정이 반복됩니다.
① 에이전트가 상태 s_t를 관측한다
② 정책 π에 따라 행동 a_t를 선택한다
③ 환경이 보상 r_{t+1}과 다음 상태 s_{t+1}을 돌려준다
목표는 미래 보상의 (할인된) 총합, 즉 **리턴 G_t** = r_{t+1} + γr_{t+2} + γ²r_{t+3} + ... 을 최대화하는 정책을 찾는 것입니다.`,
        },
        {
          h: '탐험 vs 활용',
          p: `지금까지 알아낸 최선의 행동만 반복하면(활용) 더 좋은 행동을 영영 발견하지 못할 수 있고, 새로운 행동만 시도하면(탐험) 보상을 낭비합니다.
가장 단순한 해법이 **ε-greedy**: 확률 ε로는 무작위 행동(탐험), 1-ε로는 현재 최선의 행동(활용)을 선택합니다.\n이 딜레마는 3일 내내 모든 알고리즘에서 반복해서 등장합니다.`,
        },
      ],
      code: {
        filename: 'bandit_epsilon_greedy.py',
        source: `import numpy as np

# 10개의 슬롯머신(Multi-Armed Bandit)으로 보는 탐험 vs 활용
np.random.seed(0)
n_arms = 10
true_means = np.random.normal(0, 1, n_arms)   # 각 팔의 실제 평균 보상

def run_bandit(epsilon, steps=2000):
    Q = np.zeros(n_arms)        # 행동가치 추정치
    N = np.zeros(n_arms)        # 각 팔을 당긴 횟수
    rewards = []
    for t in range(steps):
        if np.random.rand() < epsilon:
            a = np.random.randint(n_arms)      # 탐험
        else:
            a = np.argmax(Q)                   # 활용
        r = np.random.normal(true_means[a], 1) # 보상 샘플
        N[a] += 1
        Q[a] += (r - Q[a]) / N[a]              # 증분 평균 업데이트
        rewards.append(r)
    return np.mean(rewards)

for eps in [0.0, 0.01, 0.1, 0.5]:
    print(f"epsilon={eps:4.2f}  평균 보상 = {run_bandit(eps):.3f}")

# epsilon=0(탐험 없음)은 나쁜 팔에 갇히고,
# 0.5(과도한 탐험)는 보상을 낭비합니다. 0.1 근처가 균형점.`,
      },
    },
    {
      slot: 2,
      time: '10:30 ~ 11:30',
      title: 'MDP 소개',
      kind: 'theory',
      difficulty: 3,
      importance: 5,
      objectives: [
        '마르코프 결정 과정(MDP)의 5요소 (S, A, P, R, γ)를 설명할 수 있다',
        '상태가치함수 V(s)와 행동가치함수 Q(s,a)의 차이를 이해한다',
        '벨만 방정식의 재귀 구조를 이해한다',
      ],
      theory: [
        {
          h: '마르코프 결정 과정 (MDP)',
          p: `강화학습 문제를 수학적으로 정의하는 틀이 MDP입니다.\n5개 요소로 구성됩니다.
· S: 상태 집합 · A: 행동 집합 · P(s'|s,a): 상태 전이 확률 · R(s,a): 보상 함수 · γ: 할인율 (0~1)
핵심 가정은 **마르코프 성질** — =="미래는 현재 상태에만 의존하고 과거 경로와는 무관하다"==입니다.\n체스에서 지금 기물 배치만 알면 과거 수순은 몰라도 되는 것과 같습니다.`,
        },
        {
          h: '가치함수 — V와 Q',
          p: `**상태가치함수 V^π(s)** = 상태 s에서 정책 π를 따랐을 때 기대 리턴.
**행동가치함수 Q^π(s,a)** = 상태 s에서 행동 a를 먼저 하고 이후 π를 따랐을 때 기대 리턴.
Q를 알면 각 상태에서 argmax_a Q(s,a)만 취해도 좋은 정책이 됩니다 — 이것이 뒤에 배울 Q-Learning과 DQN의 출발점입니다.`,
        },
        {
          h: '벨만 방정식',
          p: `가치함수는 재귀 구조를 가집니다.
V^π(s) = Σ_a π(a|s) Σ_s' P(s'|s,a) [ R + γ V^π(s') ]
=="지금 상태의 가치 = 즉시 보상 + 할인된 다음 상태의 가치"==라는 이 한 줄이 강화학습 전체를 관통합니다.\n최적 가치함수에 대한 벨만 최적 방정식은 V*(s) = max_a Σ_s' P(s'|s,a)[R + γV*(s')] 형태가 됩니다.`,
        },
      ],
      code: {
        filename: 'gridworld_mdp.py',
        source: `import numpy as np

# 4x4 GridWorld MDP 정의 — 이후 세션에서 계속 재사용합니다
# 상태: 0~15 (왼쪽 위에서 오른쪽 아래로), 0과 15는 종료 상태
# 행동: 0=상, 1=하, 2=좌, 3=우 / 보상: 이동마다 -1

N = 4
n_states = N * N
n_actions = 4
TERMINALS = [0, n_states - 1]

def step(s, a):
    """결정적 전이: (다음상태, 보상) 반환"""
    if s in TERMINALS:
        return s, 0
    r, c = divmod(s, N)
    if a == 0: r = max(r - 1, 0)
    elif a == 1: r = min(r + 1, N - 1)
    elif a == 2: c = max(c - 1, 0)
    elif a == 3: c = min(c + 1, N - 1)
    return r * N + c, -1

# 전이 텐서 P[s][a] = (s', r) 를 미리 만들어 두면 DP가 간단해집니다
P = [[step(s, a) for a in range(n_actions)] for s in range(n_states)]

# 무작위 정책의 한 에피소드 시뮬레이션
s, trajectory = 5, []
rng = np.random.default_rng(42)
while s not in TERMINALS:
    a = rng.integers(n_actions)
    s_next, r = P[s][a]
    trajectory.append((s, a, r))
    s = s_next
print(f"에피소드 길이: {len(trajectory)}, 총 보상: {sum(t[2] for t in trajectory)}")`,
      },
    },
    {
      slot: 3,
      time: '11:30 ~ 12:30',
      title: 'Dynamic Programming 소개',
      kind: 'theory',
      difficulty: 3,
      importance: 4,
      objectives: [
        '정책 평가(Policy Evaluation)와 정책 개선(Policy Improvement)을 구분한다',
        '정책 반복(PI)과 가치 반복(VI)의 차이를 설명할 수 있다',
        'DP가 model-based 방법인 이유와 한계를 이해한다',
      ],
      theory: [
        {
          h: '동적계획법과 강화학습',
          p: `환경 모델 P(s'|s,a)와 R을 완전히 알고 있을 때, 벨만 방정식을 반복 적용해 최적 정책을 구하는 방법이 동적계획법(DP)입니다.
현실 문제에서는 모델을 모르는 경우가 대부분이지만, DP는 모든 강화학습 알고리즘의 이론적 원형이므로 반드시 짚고 넘어가야 합니다.`,
        },
        {
          h: '정책 평가와 정책 개선',
          p: `**정책 평가**: 주어진 정책 π의 V^π를 벨만 기대 방정식을 반복 적용해 계산합니다 (수렴할 때까지).
**정책 개선**: 계산된 V^π를 이용해 각 상태에서 greedy 행동을 취하는 새 정책 π'를 만듭니다.\n정책 개선 정리에 의해 π'는 π보다 항상 같거나 좋습니다.
이 둘을 번갈아 반복하면(일반화된 정책 반복, GPI) 최적 정책에 도달합니다.`,
        },
        {
          h: '정책 반복 vs 가치 반복',
          p: `**정책 반복(PI)**: 평가를 완전히 수렴시킨 뒤 개선. 반복 횟수는 적지만 한 번의 평가가 무겁습니다.
**가치 반복(VI)**: 평가를 1스텝만 하고 바로 max를 취해 개선을 겸합니다.\nV(s) ← max_a Σ P[R + γV(s')]. 구현이 간단하고 실전에서 많이 쓰입니다.
둘 다 상태 공간이 커지면(체스: 10^47) 계산이 불가능해지는 =="차원의 저주"==가 한계이며, 이것이 함수 근사(딥러닝)를 도입하는 이유입니다.`,
        },
      ],
      code: {
        filename: 'policy_evaluation.py',
        source: `import numpy as np

# 무작위 정책에 대한 반복적 정책 평가 (4x4 GridWorld, 앞 세션의 P 재사용)
gamma = 1.0
theta = 1e-6          # 수렴 판정 기준

V = np.zeros(n_states)
iteration = 0
while True:
    delta = 0.0
    V_new = V.copy()
    for s in range(n_states):
        if s in TERMINALS:
            continue
        # 무작위 정책: 4방향 각 0.25 확률
        v = 0.0
        for a in range(n_actions):
            s_next, r = P[s][a]
            v += 0.25 * (r + gamma * V[s_next])
        V_new[s] = v
        delta = max(delta, abs(v - V[s]))
    V = V_new
    iteration += 1
    if delta < theta:
        break

print(f"{iteration}회 반복 후 수렴")
print(np.round(V.reshape(4, 4), 1))
# 종료 상태에서 멀수록 가치가 낮아지는(-22 근처) 것을 확인하세요`,
      },
    },
    {
      slot: 4,
      time: '13:30 ~ 14:30',
      title: 'Policy Iteration, Value Iteration 구현',
      kind: 'impl',
      difficulty: 3,
      importance: 4,
      objectives: [
        '4x4 GridWorld에서 정책 반복을 NumPy로 구현한다',
        '가치 반복을 구현하고 두 방법의 수렴 결과를 비교한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `오전에 배운 정책 평가 코드를 확장해 완전한 정책 반복과 가치 반복을 완성합니다.
**구현 포인트**: ① 평가→개선 루프의 종료 조건(정책이 더 이상 바뀌지 않을 때) ② VI에서 max 연산이 평가와 개선을 동시에 수행한다는 점 ③ ==두 방법이 같은 최적 정책에 도달하는지 확인==.`,
        },
      ],
      code: {
        filename: 'pi_vi_gridworld.py',
        source: `import numpy as np

gamma = 1.0

def q_from_v(V, s):
    """상태 s에서 각 행동의 Q값 계산"""
    return np.array([P[s][a][1] + gamma * V[P[s][a][0]]
                     for a in range(n_actions)])

# ── 정책 반복 (Policy Iteration) ──────────────────
def policy_iteration():
    policy = np.zeros(n_states, dtype=int)      # 모든 상태에서 행동 0
    while True:
        # 1) 정책 평가
        V = np.zeros(n_states)
        while True:
            delta = 0.0
            for s in range(n_states):
                if s in TERMINALS: continue
                s_next, r = P[s][policy[s]]
                v = r + gamma * V[s_next]
                delta = max(delta, abs(v - V[s]))
                V[s] = v
            if delta < 1e-6: break
        # 2) 정책 개선
        stable = True
        for s in range(n_states):
            if s in TERMINALS: continue
            best_a = np.argmax(q_from_v(V, s))
            if best_a != policy[s]:
                stable = False
                policy[s] = best_a
        if stable:
            return policy, V

# ── 가치 반복 (Value Iteration) ───────────────────
def value_iteration():
    V = np.zeros(n_states)
    while True:
        delta = 0.0
        for s in range(n_states):
            if s in TERMINALS: continue
            v = q_from_v(V, s).max()            # max가 곧 개선
            delta = max(delta, abs(v - V[s]))
            V[s] = v
        if delta < 1e-6: break
    policy = np.array([np.argmax(q_from_v(V, s)) for s in range(n_states)])
    return policy, V

arrows = np.array(['↑', '↓', '←', '→'])
pi_policy, pi_V = policy_iteration()
vi_policy, vi_V = value_iteration()
print("PI 최적 정책:"); print(arrows[pi_policy].reshape(4, 4))
print("VI 최적 정책:"); print(arrows[vi_policy].reshape(4, 4))
print("두 가치함수 일치:", np.allclose(pi_V, vi_V))`,
      },
    },
    {
      slot: 5,
      time: '14:30 ~ 15:30',
      title: 'Monte-Carlo 방법, Temporal Difference 방법 소개',
      kind: 'theory',
      difficulty: 3,
      importance: 5,
      objectives: [
        '모델 없이(model-free) 가치를 추정하는 두 접근을 이해한다',
        'MC의 낮은 편향·높은 분산, TD의 부트스트래핑·낮은 분산 특성을 비교한다',
        'TD(0) 업데이트 식을 쓸 수 있다',
      ],
      theory: [
        {
          h: '모델을 모를 때 — 샘플로 배우기',
          p: `DP는 전이확률 P를 알아야 합니다.\n현실에선 모르는 경우가 대부분이므로, 실제로 행동해 보고 얻은 경험 샘플로 가치를 추정해야 합니다.\n대표적인 두 방법이 **몬테카를로(MC)**와 **시간차(TD) 학습**입니다.`,
        },
        {
          h: '몬테카를로(MC) 방법',
          p: `에피소드가 끝난 뒤 실제로 받은 리턴 G_t의 평균으로 가치를 추정합니다.
V(s_t) ← V(s_t) + α [ G_t − V(s_t) ]
실제 리턴을 쓰므로 편향(bias)이 없지만, 에피소드 전체의 무작위성이 반영되어 분산(variance)이 크고, 반드시 에피소드가 끝나야 학습할 수 있습니다.`,
        },
        {
          h: '시간차(TD) 학습',
          p: `한 스텝만 진행하고 다음 상태의 "현재 추정치"로 목표를 만듭니다 (**부트스트래핑**).
V(s_t) ← V(s_t) + α [ r_{t+1} + γV(s_{t+1}) − V(s_t) ]
괄호 안을 **TD 오차(δ)**라고 부릅니다.\n매 스텝 학습이 가능하고 분산이 작지만, 부정확한 추정치로 추정치를 갱신하므로 편향이 생깁니다.\n이 ==bias-variance 트레이드오프==가 MC vs TD 선택의 핵심입니다.`,
        },
      ],
      code: {
        filename: 'mc_vs_td_prediction.py',
        source: `import numpy as np

# 무작위 정책의 V를 MC와 TD(0)로 각각 추정해 비교 (4x4 GridWorld)
rng = np.random.default_rng(0)
alpha, gamma = 0.05, 1.0

def gen_episode():
    s = rng.integers(1, n_states - 1)
    episode = []
    while s not in TERMINALS:
        a = rng.integers(n_actions)
        s_next, r = P[s][a]
        episode.append((s, r))
        s = s_next
    return episode

# ── First-visit Monte-Carlo ──
V_mc = np.zeros(n_states)
for _ in range(5000):
    episode = gen_episode()
    G, visited = 0.0, set()
    for s, r in reversed(episode):     # 뒤에서부터 리턴 누적
        G = r + gamma * G
        if s not in visited:           # first-visit
            visited.add(s)
            V_mc[s] += alpha * (G - V_mc[s])

# ── TD(0) ──
V_td = np.zeros(n_states)
for _ in range(5000):
    s = rng.integers(1, n_states - 1)
    while s not in TERMINALS:
        a = rng.integers(n_actions)
        s_next, r = P[s][a]
        td_error = r + gamma * V_td[s_next] - V_td[s]
        V_td[s] += alpha * td_error
        s = s_next

print("MC 추정:"); print(np.round(V_mc.reshape(4, 4), 1))
print("TD 추정:"); print(np.round(V_td.reshape(4, 4), 1))
# 둘 다 DP 정답(-14, -20, -22...)에 근접하는지 확인하세요`,
      },
    },
    {
      slot: 6,
      time: '15:30 ~ 16:30',
      title: 'SARSA와 Q-Learning 소개',
      kind: 'theory',
      difficulty: 3,
      importance: 5,
      objectives: [
        'TD 제어에서 SARSA와 Q-Learning의 업데이트 식을 구분한다',
        'On-policy와 Off-policy의 차이를 설명할 수 있다',
      ],
      theory: [
        {
          h: '예측에서 제어로',
          p: `지금까지는 주어진 정책의 가치를 "예측"했습니다.\n이제 최적 정책을 직접 "찾는" 제어(control) 문제로 넘어갑니다.\n모델이 없으므로 V 대신 Q(s,a)를 학습해야 greedy 정책을 만들 수 있습니다.`,
        },
        {
          h: 'SARSA — On-policy TD 제어',
          p: `Q(s,a) ← Q(s,a) + α [ r + γQ(s',a') − Q(s,a) ]
이름 그대로 (S, A, R, S', A') 5개를 사용합니다.\n다음 행동 a'를 실제 행동하는 정책(ε-greedy)에서 뽑으므로, "행동하는 정책"과 "학습하는 정책"이 같은 ==on-policy 방법==입니다.\n탐험의 위험까지 Q값에 반영되어 보수적인 경로를 학습합니다.`,
        },
        {
          h: 'Q-Learning — Off-policy TD 제어',
          p: `Q(s,a) ← Q(s,a) + α [ r + γ max_a' Q(s',a') − Q(s,a) ]
다음 상태에서 실제 취할 행동과 무관하게 max를 사용합니다.\n행동은 ε-greedy로 하되 학습 목표는 greedy 정책 — 행동 정책과 목표 정책이 다른 ==off-policy 방법==입니다.
Cliff Walking 예제에서 SARSA는 절벽에서 먼 안전한 길을, Q-Learning은 절벽에 붙은 최단 경로를 배우는 차이가 이 구조에서 나옵니다.\n**Q-Learning의 max 구조는 2일차 DQN으로 직결**됩니다.`,
        },
      ],
      code: {
        filename: 'update_rules.py',
        source: `# 두 알고리즘의 차이는 단 한 줄 — TD 목표(target)의 정의

# SARSA (on-policy): 다음 "실제" 행동 a'의 Q값 사용
def sarsa_update(Q, s, a, r, s_next, a_next, alpha=0.1, gamma=0.99):
    target = r + gamma * Q[s_next][a_next]        # 실제 선택한 a'
    Q[s][a] += alpha * (target - Q[s][a])

# Q-Learning (off-policy): 다음 상태의 "최대" Q값 사용
def q_learning_update(Q, s, a, r, s_next, alpha=0.1, gamma=0.99):
    target = r + gamma * max(Q[s_next])           # max — 실제 행동과 무관
    Q[s][a] += alpha * (target - Q[s][a])

# 행동 선택은 둘 다 epsilon-greedy
import random
def epsilon_greedy(Q, s, n_actions, epsilon=0.1):
    if random.random() < epsilon:
        return random.randrange(n_actions)
    return max(range(n_actions), key=lambda a: Q[s][a])`,
      },
    },
    {
      slot: 7,
      time: '16:30 ~ 17:30',
      title: 'SARSA와 Q-Learning 구현',
      kind: 'impl',
      difficulty: 3,
      importance: 4,
      objectives: [
        'Gymnasium CliffWalking 환경에서 SARSA와 Q-Learning을 완성한다',
        '두 알고리즘이 학습한 경로의 차이를 직접 확인한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `Gymnasium의 CliffWalking-v0 환경(4x12 그리드, 절벽에 떨어지면 -100)에서 두 알고리즘을 학습시킵니다.
**관찰 포인트**: 학습 곡선에서 SARSA의 에피소드 보상이 더 높게(안전한 길) 나오고, Q-Learning은 탐험 중 절벽에 자주 떨어져 보상이 낮지만 ==최종 greedy 정책은 최단 경로==가 됩니다.`,
        },
      ],
      code: {
        filename: 'cliff_sarsa_qlearning.py',
        source: `import gymnasium as gym
import numpy as np

env = gym.make("CliffWalking-v0")
n_states, n_actions = env.observation_space.n, env.action_space.n
alpha, gamma, epsilon = 0.1, 0.99, 0.1
rng = np.random.default_rng(0)

def eps_greedy(Q, s):
    if rng.random() < epsilon:
        return rng.integers(n_actions)
    return int(np.argmax(Q[s]))

def train(method, episodes=500):
    Q = np.zeros((n_states, n_actions))
    returns = []
    for _ in range(episodes):
        s, _ = env.reset()
        a = eps_greedy(Q, s)
        total, done = 0, False
        while not done:
            s_next, r, term, trunc, _ = env.step(a)
            done = term or trunc
            if method == "sarsa":
                a_next = eps_greedy(Q, s_next)
                target = r + gamma * Q[s_next][a_next] * (not done)
            else:  # q-learning
                target = r + gamma * Q[s_next].max() * (not done)
                a_next = eps_greedy(Q, s_next)
            Q[s][a] += alpha * (target - Q[s][a])
            s, a, total = s_next, a_next, total + r
        returns.append(total)
    return Q, returns

Q_sarsa, ret_s = train("sarsa")
Q_qlearn, ret_q = train("qlearning")
print(f"SARSA      마지막 100ep 평균 보상: {np.mean(ret_s[-100:]):.1f}")
print(f"Q-Learning 마지막 100ep 평균 보상: {np.mean(ret_q[-100:]):.1f}")

# greedy 경로 시각화: SARSA는 위쪽 안전 경로, Q-Learning은 절벽 옆 최단 경로
for name, Q in [("SARSA", Q_sarsa), ("Q-Learning", Q_qlearn)]:
    grid = np.full(48, '.', dtype=str)
    s, _ = env.reset()
    for _ in range(30):
        a = int(np.argmax(Q[s]))
        grid[s] = '*'
        s, r, term, trunc, _ = env.step(a)
        if term or trunc: break
    print(f"\\n[{name} greedy 경로]")
    print('\\n'.join(''.join(row) for row in grid.reshape(4, 12)))`,
      },
    },
  ],
}
