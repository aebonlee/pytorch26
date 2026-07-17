// ============================================================
// 3일차 — Advanced actor-critic methods (공식 목차 7교시)
// ------------------------------------------------------------
// 코드 재사용 흐름: 1교시 Actor/Critic/soft_update →
// 2교시 DDPG 실습 → 4교시 GaussianActor → 6교시 SAC 실습
// (Critic·버퍼·soft_update 재사용) → 7교시 TAC(SAC에서
// log π → q-log π 두 줄만 교체).
// 마지막 교시(7교시)가 전체 과정의 종착점 — SessionPage가
// 이 교시에서만 퀴즈/심화학습 안내 박스를 추가로 띄운다.
// ============================================================
export default {
  id: 3,
  date: '2026-07-29 (수)',
  theme: 'Advanced Actor-Critic Methods',
  desc: '연속 행동 공간을 다루는 DDPG부터 최대 엔트로피 계열의 SAC·TAC까지, 최신 심층강화학습 알고리즘을 구현합니다.',
  sessions: [
    {
      slot: 1,
      time: '09:30 ~ 10:30',
      title: 'DDPG 소개',
      kind: 'theory',
      difficulty: 4,
      importance: 5,
      objectives: [
        '연속 행동 공간에서 DQN이 동작하지 않는 이유를 이해한다',
        '결정적 정책 경사와 DDPG의 4개 네트워크 구조를 설명할 수 있다',
      ],
      theory: [
        {
          h: '연속 행동 공간의 문제',
          p: `로봇 관절 토크, 자동차 핸들 각도처럼 행동이 연속값이면 max_a Q(s,a)를 계산할 수 없습니다 — 행동이 무한히 많기 때문입니다.\n행동을 이산화하면 차원이 조금만 커져도 조합이 폭발합니다(7자유도 로봇 × 10단계 = 10^7 행동).`,
        },
        {
          h: '결정적 정책 경사 (DPG)',
          p: `**해법**: ==max를 "학습"으로 대체==합니다.\n상태를 받아 연속 행동을 직접 출력하는 **결정적 정책 μ(s;θ)**를 두고, Critic이 평가한 Q(s, μ(s))가 커지는 방향으로 Actor를 갱신합니다.
∇J(θ) = E[ ∇_a Q(s,a)|_{a=μ(s)} · ∇_θ μ(s;θ) ]
Critic을 통과해 Actor까지 기울기가 흐르는 구조입니다.`,
        },
        {
          h: 'DDPG = DPG + DQN 기법',
          p: `DDPG(Deep DPG)는 DPG에 DQN의 안정화 기법을 결합합니다.
① 경험 재현 버퍼 (off-policy) ② 타깃 네트워크 — 단, 하드 카피 대신 **소프트 업데이트** θ⁻ ← τθ + (1−τ)θ⁻ (τ≈0.005)
③ 탐험: 결정적 정책이므로 행동에 노이즈를 더합니다 (OU 노이즈 또는 단순 가우시안).
**총 4개 네트워크**: Actor, Critic, Target Actor, Target Critic. 강력하지만 하이퍼파라미터에 민감하고 Q 과대평가에 취약합니다 — 이것이 오후의 SAC로 이어지는 동기입니다.`,
        },
      ],
      code: {
        filename: 'ddpg_networks.py',
        source: `import torch
import torch.nn as nn

class Actor(nn.Module):
    """상태 → 연속 행동 (결정적)"""
    def __init__(self, state_dim, action_dim, max_action):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
            nn.Linear(256, action_dim), nn.Tanh(),   # [-1, 1]
        )
        self.max_action = max_action

    def forward(self, s):
        return self.net(s) * self.max_action         # 행동 범위로 스케일

class Critic(nn.Module):
    """(상태, 행동) → Q값 — 행동을 입력으로 받는 점이 DQN과 다름"""
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim + action_dim, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
            nn.Linear(256, 1),
        )

    def forward(self, s, a):
        return self.net(torch.cat([s, a], dim=-1)).squeeze(-1)

def soft_update(target, source, tau=0.005):
    """타깃 네트워크 소프트 업데이트 — DDPG·SAC 공용"""
    for tp, sp in zip(target.parameters(), source.parameters()):
        tp.data.copy_(tau * sp.data + (1 - tau) * tp.data)`,
      },
    },
    {
      slot: 2,
      time: '10:30 ~ 11:30',
      title: 'DDPG 구현',
      kind: 'impl',
      difficulty: 4,
      importance: 4,
      objectives: [
        'Pendulum-v1(연속 행동)에서 DDPG 학습 루프를 완성한다',
        '소프트 업데이트와 탐험 노이즈의 효과를 확인한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `Pendulum-v1(진자 세우기, 행동 = 토크 1차원 연속값, 보상 최대 0)에서 DDPG를 완성합니다.\n==리턴이 -200 근처까지 오르면 성공==적으로 학습된 것입니다.`,
        },
      ],
      code: {
        filename: 'ddpg_pendulum.py',
        source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import copy

env = gym.make("Pendulum-v1")
state_dim = env.observation_space.shape[0]   # 3
action_dim = env.action_space.shape[0]       # 1
max_action = float(env.action_space.high[0]) # 2.0

actor = Actor(state_dim, action_dim, max_action)
critic = Critic(state_dim, action_dim)
actor_t, critic_t = copy.deepcopy(actor), copy.deepcopy(critic)
actor_opt = torch.optim.Adam(actor.parameters(), lr=1e-4)
critic_opt = torch.optim.Adam(critic.parameters(), lr=1e-3)
buffer = ReplayBuffer(100_000)
gamma, batch_size, noise_std = 0.99, 128, 0.1

def train_step():
    s, a, r, s_next, done = buffer.sample(batch_size)
    # ── Critic 업데이트: TD 목표는 타깃 네트워크들로 ──
    with torch.no_grad():
        target_q = critic_t(s_next, actor_t(s_next))
        y = r + gamma * target_q * (1 - done)
    critic_loss = nn.functional.mse_loss(critic(s, a), y)
    critic_opt.zero_grad(); critic_loss.backward(); critic_opt.step()

    # ── Actor 업데이트: Q(s, μ(s))를 최대화 ──
    actor_loss = -critic(s, actor(s)).mean()
    actor_opt.zero_grad(); actor_loss.backward(); actor_opt.step()

    soft_update(actor_t, actor); soft_update(critic_t, critic)

returns = []
for episode in range(200):
    s, _ = env.reset()
    total, done = 0.0, False
    while not done:
        with torch.no_grad():
            a = actor(torch.as_tensor(s, dtype=torch.float32)).numpy()
        a += np.random.normal(0, noise_std * max_action, action_dim)   # 탐험 노이즈
        a = a.clip(-max_action, max_action)
        s_next, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buffer.push(s, a, r, s_next, float(term))
        s, total = s_next, total + r
        if len(buffer) >= 1000:
            train_step()
    returns.append(total)
    if episode % 10 == 0:
        print(f"ep {episode:3d}  최근 10ep 평균 리턴 {np.mean(returns[-10:]):7.1f}")
# -1500 근처에서 시작해 -200 근처까지 오르면 성공`,
      },
    },
    {
      slot: 3,
      time: '11:30 ~ 12:30',
      title: 'Maximum Entropy RL 소개',
      kind: 'theory',
      difficulty: 4,
      importance: 4,
      objectives: [
        '최대 엔트로피 목적함수가 표준 RL 목적함수와 어떻게 다른지 이해한다',
        '엔트로피 보너스가 탐험·강건성에 주는 효과를 설명할 수 있다',
      ],
      theory: [
        {
          h: '보상만 최대화하면 생기는 문제',
          p: `표준 RL 목적: J(π) = E[ Σ r_t ]
결정적 정책은 하나의 해에 조기 수렴하기 쉽습니다.\n탐험이 부족해지고, 환경이 조금만 바뀌어도 무너지며, 동일하게 좋은 여러 경로가 있어도 하나만 배웁니다.`,
        },
        {
          h: '최대 엔트로피 목적함수',
          p: `==J(π) = E[ Σ r_t + α·H(π(·|s_t)) ]==
매 스텝 정책의 엔트로피 H를 보상에 더합니다.\n=="보상을 최대화하되, 가능한 한 무작위로 행동하라"==는 뜻입니다.
**α(온도)**가 보상과 엔트로피의 균형을 조절합니다: α가 크면 탐험적, 0이면 표준 RL로 환원.
효과: ① 탐험이 목적함수에 내장됨 ② 여러 좋은 해를 모두 포착 ③ 방해·변화에 강건 ④ 더 나은 초기화로 전이 학습 유리.`,
        },
        {
          h: 'Soft 가치함수',
          p: `엔트로피가 더해지면 벨만 방정식도 "soft" 버전이 됩니다.
soft V(s) = E_a[ Q(s,a) − α log π(a|s) ]
soft Q(s,a) = r + γ E[ V(s') ]
soft 정책 개선의 최적해는 π(a|s) ∝ exp(Q(s,a)/α) — Q값이 높은 행동일수록 지수적으로 자주 선택하되 결코 확률 0이 되지 않는 볼츠만 분포입니다.\n이 이론 위에 세워진 실용 알고리즘이 다음 교시의 SAC입니다.`,
        },
      ],
      code: {
        filename: 'entropy_intuition.py',
        source: `import torch
import torch.nn.functional as F

# 엔트로피가 정책 분포에 주는 효과 직관 잡기
q_values = torch.tensor([1.0, 0.9, 0.2, -1.0])   # 행동 4개의 Q값

for alpha in [0.01, 0.5, 5.0]:
    # 최대 엔트로피 최적 정책: softmax(Q/alpha)
    pi = F.softmax(q_values / alpha, dim=0)
    entropy = -(pi * pi.log()).sum()
    print(f"alpha={alpha:4.2f}  pi={pi.numpy().round(3)}  H={entropy:.3f}")

# alpha=0.01 → 거의 greedy (첫 행동에 몰빵)
# alpha=0.5  → Q가 비슷한 행동 1,2를 골고루 선택  ← 여러 해를 포착
# alpha=5.0  → 거의 균등분포 (탐험 극대화)`,
      },
    },
    {
      slot: 4,
      time: '13:30 ~ 14:30',
      title: 'SAC 소개',
      kind: 'theory',
      difficulty: 4,
      importance: 5,
      objectives: [
        'SAC의 3가지 핵심 구성요소(확률적 Actor, 트윈 Q, 자동 온도조절)를 이해한다',
        '재매개변수화 트릭이 왜 필요한지 설명할 수 있다',
      ],
      theory: [
        {
          h: 'Soft Actor-Critic (SAC)',
          p: `SAC(2018)는 최대 엔트로피 프레임워크의 대표 실용 알고리즘으로, 연속 제어 벤치마크의 사실상 표준입니다.
DDPG와의 비교: off-policy + 재현 버퍼 + 소프트 업데이트는 같지만, ① 결정적 → 확률적(가우시안) 정책 ② 탐험 노이즈 불필요(엔트로피가 담당) ③ 하이퍼파라미터에 훨씬 덜 민감합니다.`,
        },
        {
          h: '3가지 핵심 요소',
          p: `① **확률적 Actor**: 상태를 받아 가우시안의 평균·표준편차를 출력하고, tanh로 눌러 행동 범위에 맞춥니다.
② **트윈 Q (Clipped Double-Q)**: Q 네트워크 2개를 두고 목표 계산 시 min(Q1, Q2)를 사용 — Q 과대평가를 억제합니다 (TD3에서 도입된 기법).
③ **자동 온도 조절**: α도 학습합니다.\n목표 엔트로피(보통 −action_dim)를 정해 두고, 현재 정책의 엔트로피가 그보다 낮으면 α를 키워 탐험을 늘리는 방향으로 자동 조정됩니다.`,
        },
        {
          h: '재매개변수화 트릭',
          p: `Actor 손실 E[ α log π(a|s) − Q(s,a) ]를 줄이려면 샘플링 연산을 통과해 기울기를 흘려야 합니다.
a = tanh( μ(s) + σ(s) ⊙ ε ),  ε ~ N(0, I)
무작위성을 파라미터와 무관한 ε으로 분리하면 μ, σ에 대해 미분 가능해집니다 — VAE에서 쓰는 것과 같은 트릭입니다.\nPyTorch에서는 ==dist.rsample()이 이 역할==을 합니다 (**sample()과의 차이에 주의!**).`,
        },
      ],
      code: {
        filename: 'sac_actor.py',
        source: `import torch
import torch.nn as nn

LOG_STD_MIN, LOG_STD_MAX = -20, 2

class GaussianActor(nn.Module):
    """SAC의 확률적 정책: tanh-squashed Gaussian"""
    def __init__(self, state_dim, action_dim, max_action):
        super().__init__()
        self.body = nn.Sequential(
            nn.Linear(state_dim, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
        )
        self.mu_head = nn.Linear(256, action_dim)
        self.log_std_head = nn.Linear(256, action_dim)
        self.max_action = max_action

    def forward(self, s):
        h = self.body(s)
        mu = self.mu_head(h)
        log_std = self.log_std_head(h).clamp(LOG_STD_MIN, LOG_STD_MAX)
        dist = torch.distributions.Normal(mu, log_std.exp())

        u = dist.rsample()              # 재매개변수화 샘플 (기울기 통과!)
        a = torch.tanh(u)
        # tanh 변환에 따른 log-prob 보정 (change of variables)
        log_prob = dist.log_prob(u).sum(-1)
        log_prob -= torch.log(1 - a.pow(2) + 1e-6).sum(-1)
        return a * self.max_action, log_prob`,
      },
    },
    {
      slot: 5,
      time: '14:30 ~ 15:30',
      title: 'TAC 소개',
      kind: 'theory',
      difficulty: 5,
      importance: 3,
      objectives: [
        '샤논 엔트로피의 한계와 Tsallis 엔트로피의 일반화를 이해한다',
        'TAC의 q 파라미터가 탐험 스타일에 주는 영향을 설명할 수 있다',
      ],
      theory: [
        {
          h: '샤논 엔트로피의 한계',
          p: `SAC의 softmax 정책 π ∝ exp(Q/α)는 모든 행동에 0이 아닌 확률을 부여합니다.\nQ값이 명백히 낮은 나쁜 행동도 계속 시도한다는 뜻입니다.\n행동 공간이 크거나 위험한 행동이 있는 문제에서는 이 "끝까지 남는 꼬리 확률"이 성능을 갉아먹습니다.`,
        },
        {
          h: 'Tsallis 엔트로피 — 엔트로피의 일반화',
          p: `Tsallis 엔트로피는 q-로그(log_q)로 정의되는 일반화 엔트로피입니다.
S_q(π) = E[ −log_q π(a|s) ],  log_q(x) = (x^{q−1} − 1)/(q − 1)
==q → 1이면 샤논 엔트로피로 수렴(즉 SAC는 TAC의 특수 사례)==, q = 2이면 sparse 엔트로피가 됩니다.
q > 1일수록 최적 정책이 **sparsemax** 형태 — 가망 없는 행동의 확률을 정확히 0으로 잘라내는 분포 — 에 가까워집니다.`,
        },
        {
          h: 'TAC (Tsallis Actor-Critic)',
          p: `TAC는 SAC의 엔트로피 항을 Tsallis 엔트로피로 교체한 알고리즘입니다 (Lee et al., 2019).
**q가 하나의 다이얼**이 됩니다: q=1(SAC, 모든 행동 탐험) ↔ q=2(유망한 행동에만 집중 탐험).
효과: 행동 공간이 크고 보상이 밀집된 문제에서 나쁜 행동에 낭비하는 샘플이 줄어 학습이 빨라집니다.\n반대로 sparse reward 문제라면 넓은 탐험(q≈1)이 유리할 수 있습니다 — 문제 특성에 맞게 엔트로피의 "모양"을 선택한다는 관점이 핵심입니다.`,
        },
      ],
      code: {
        filename: 'q_log_intuition.py',
        source: `import torch

def q_log(x, q):
    """Tsallis q-logarithm: q→1이면 자연로그로 수렴"""
    if abs(q - 1.0) < 1e-6:
        return torch.log(x)
    return (x.pow(q - 1) - 1) / (q - 1)

# 같은 Q값에 대해 q에 따라 정책 분포가 어떻게 달라지는가 (수치 근사)
q_values = torch.tensor([1.0, 0.9, 0.2, -1.0])
alpha = 0.5

for q in [1.0, 1.5, 2.0]:
    # 정책 최적화를 경사하강으로 근사: max E[Q] + alpha * S_q(pi)
    logits = torch.zeros(4, requires_grad=True)
    opt = torch.optim.Adam([logits], lr=0.05)
    for _ in range(2000):
        pi = torch.softmax(logits, dim=0)
        entropy_q = -(pi * q_log(pi, q)).sum()
        loss = -((pi * q_values).sum() + alpha * entropy_q)
        opt.zero_grad(); loss.backward(); opt.step()
    print(f"q={q:.1f}  pi={pi.detach().numpy().round(3)}")

# q=1.0 → 모든 행동에 확률 배분 (SAC와 동일)
# q=2.0 → 나쁜 행동(Q=-1)의 확률이 사실상 0으로 — sparse한 탐험`,
      },
    },
    {
      slot: 6,
      time: '15:30 ~ 16:30',
      title: 'SAC 구현',
      kind: 'impl',
      difficulty: 5,
      importance: 4,
      objectives: [
        'Pendulum-v1에서 자동 온도조절을 포함한 SAC를 완성한다',
        'DDPG 대비 학습 안정성을 비교한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `4교시의 GaussianActor와 DDPG 실습의 Critic·버퍼·soft_update를 재사용해 SAC를 조립합니다.\n트윈 Q와 자동 α 조절이 새로 추가되는 부분입니다.\n==DDPG보다 적은 에피소드로 안정적으로 수렴==하는 것을 확인하세요.`,
        },
      ],
      code: {
        filename: 'sac_pendulum.py',
        source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import copy

env = gym.make("Pendulum-v1")
state_dim, action_dim = 3, 1
max_action = float(env.action_space.high[0])

actor = GaussianActor(state_dim, action_dim, max_action)
q1, q2 = Critic(state_dim, action_dim), Critic(state_dim, action_dim)   # 트윈 Q
q1_t, q2_t = copy.deepcopy(q1), copy.deepcopy(q2)
actor_opt = torch.optim.Adam(actor.parameters(), lr=3e-4)
q_opt = torch.optim.Adam(list(q1.parameters()) + list(q2.parameters()), lr=3e-4)

# 자동 온도 조절: log_alpha를 학습, 목표 엔트로피 = -action_dim
log_alpha = torch.zeros(1, requires_grad=True)
alpha_opt = torch.optim.Adam([log_alpha], lr=3e-4)
target_entropy = -action_dim

buffer = ReplayBuffer(100_000)
gamma, batch_size = 0.99, 256

def train_step():
    s, a, r, s_next, done = buffer.sample(batch_size)
    alpha = log_alpha.exp().detach()

    # ── 트윈 Q 업데이트: min(Q1',Q2') − α·logπ 로 soft TD 목표 ──
    with torch.no_grad():
        a_next, logp_next = actor(s_next)
        q_next = torch.min(q1_t(s_next, a_next), q2_t(s_next, a_next))
        y = r + gamma * (1 - done) * (q_next - alpha * logp_next)
    q_loss = nn.functional.mse_loss(q1(s, a), y) + nn.functional.mse_loss(q2(s, a), y)
    q_opt.zero_grad(); q_loss.backward(); q_opt.step()

    # ── Actor 업데이트: E[α·logπ − min(Q1,Q2)] 최소화 ──
    a_new, logp = actor(s)
    q_new = torch.min(q1(s, a_new), q2(s, a_new))
    actor_loss = (alpha * logp - q_new).mean()
    actor_opt.zero_grad(); actor_loss.backward(); actor_opt.step()

    # ── 온도 α 업데이트: 엔트로피를 목표치로 유지 ──
    alpha_loss = -(log_alpha.exp() * (logp + target_entropy).detach()).mean()
    alpha_opt.zero_grad(); alpha_loss.backward(); alpha_opt.step()

    soft_update(q1_t, q1); soft_update(q2_t, q2)

returns = []
for episode in range(150):
    s, _ = env.reset()
    total, done = 0.0, False
    while not done:
        with torch.no_grad():
            a, _ = actor(torch.as_tensor(s, dtype=torch.float32))
        s_next, r, term, trunc, _ = env.step(a.numpy())
        done = term or trunc
        buffer.push(s, a.numpy(), r, s_next, float(term))
        s, total = s_next, total + r
        if len(buffer) >= 1000:
            train_step()
    returns.append(total)
    if episode % 10 == 0:
        print(f"ep {episode:3d}  평균 {np.mean(returns[-10:]):7.1f}  alpha {log_alpha.exp().item():.3f}")`,
      },
    },
    {
      slot: 7,
      time: '16:30 ~ 17:30',
      title: 'TAC 구현',
      kind: 'impl',
      difficulty: 5,
      importance: 3,
      objectives: [
        'SAC 코드에서 엔트로피 항을 Tsallis q-log로 교체해 TAC를 완성한다',
        'q 값을 바꿔가며 탐험 스타일의 변화를 관찰한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `TAC의 아름다운 점: ==SAC 구현에서 log π를 log_q π로 바꾸는 것이 수정의 전부==입니다.\nq=1.0으로 두면 SAC와 완전히 동일하게 동작하는지 먼저 검증하고(**회귀 테스트**), q=1.5, 2.0으로 올려 학습 곡선을 비교합니다.
마무리: 3일 전체 로드맵 복습 — 표 기반(DP·MC·TD) → 가치 기반(DQN 계열) → 정책 기반(PG·A2C) → 연속 제어(DDPG) → 최대 엔트로피(SAC·TAC). 이후 복습 퀴즈와 심화학습 자료로 이어집니다.`,
        },
      ],
      code: {
        filename: 'tac_pendulum.py',
        source: `import torch

# SAC → TAC: 엔트로피 항의 log를 q-log로 교체하는 것이 전부
ENTROPIC_INDEX = 2.0        # q=1.0이면 SAC와 동일

def q_log_prob(log_prob, q=ENTROPIC_INDEX):
    """log π → log_q π 변환 (log_prob은 SAC actor가 주는 값)"""
    if abs(q - 1.0) < 1e-6:
        return log_prob                       # q→1: SAC로 환원
    prob = log_prob.exp().clamp(min=1e-8)
    return (prob.pow(q - 1) - 1) / (q - 1)    # q-logarithm

# ── SAC train_step에서 딱 두 곳만 수정 ──

# ① soft TD 목표 (수정 전: q_next - alpha * logp_next)
#    y = r + gamma * (1 - done) * (q_next - alpha * q_log_prob(logp_next))

# ② Actor 손실 (수정 전: alpha * logp - q_new)
#    actor_loss = (alpha * q_log_prob(logp) - q_new).mean()

# 실험 과제:
#  1. ENTROPIC_INDEX = 1.0으로 SAC와 동일 결과가 나오는지 검증
#  2. q = 1.5, 2.0에서 학습 곡선 비교
#  3. Pendulum은 행동공간이 작아 차이가 작습니다 —
#     HalfCheetah 등 고차원 환경에서 q>1의 효과가 뚜렷해집니다

# 3일 전체 요약
# Day1: MDP·벨만 → DP(모델有) → MC/TD(모델無) → SARSA/Q-Learning
# Day2: Q테이블 → 신경망(DQN·DDQN) / 정책 직접 학습(PG → A2C)
# Day3: 연속 행동(DDPG) → 최대 엔트로피(SAC) → 일반화 엔트로피(TAC)`,
      },
    },
  ],
}
