// 2일차 — Value-based methods & Policy-based methods
export default {
  id: 2,
  date: '2026-07-28 (화)',
  theme: 'Value-based & Policy-based Methods',
  desc: '신경망 함수 근사를 도입한 DQN 계열과, 정책을 직접 학습하는 Policy Gradient·A2C를 PyTorch로 구현합니다.',
  sessions: [
    {
      slot: 1,
      time: '09:30 ~ 10:30',
      title: 'DQN 소개',
      kind: 'theory',
      objectives: [
        '테이블 방식의 한계와 함수 근사의 필요성을 이해한다',
        'DQN의 핵심 요소인 경험 재현(Replay Buffer)과 타깃 네트워크를 설명할 수 있다',
      ],
      theory: [
        {
          h: '테이블에서 신경망으로',
          p: `상태가 이미지(아타리: 84×84×4)라면 Q 테이블은 만들 수 없습니다. Q(s,a)를 신경망 Q(s,a;θ)로 근사하는 것이 Deep Q-Network(DQN)입니다. DeepMind가 2013/2015년 아타리 49개 게임을 같은 네트워크·같은 하이퍼파라미터로 사람 수준까지 학습시키며 심층강화학습 시대를 열었습니다.`,
        },
        {
          h: '왜 그냥 신경망 + Q-Learning은 발산하는가',
          p: `① 연속된 샘플 간 강한 상관관계 — SGD는 i.i.d. 데이터를 가정하는데 궤적 데이터는 시간적으로 강하게 상관되어 있습니다.
② 움직이는 목표 — TD 목표 r + γ max Q(s';θ)가 학습 중인 θ 자신에 의존하므로 목표가 계속 흔들립니다.
이 둘이 겹치면 학습이 불안정해지거나 발산합니다 (deadly triad).`,
        },
        {
          h: 'DQN의 두 가지 처방',
          p: `경험 재현(Experience Replay): 전이 (s, a, r, s')를 버퍼에 쌓아 두고 무작위 미니배치로 샘플링 → 상관관계를 깨고 데이터 재사용 효율도 올립니다.
타깃 네트워크(Target Network): 목표 계산용 네트워크 θ⁻를 별도로 두고 주기적으로만 θ를 복사 → 목표를 일정 기간 고정해 학습을 안정화합니다.
손실 함수: L(θ) = E[( r + γ max_a' Q(s',a';θ⁻) − Q(s,a;θ) )²]`,
        },
      ],
      code: {
        filename: 'replay_buffer.py',
        source: `import random
from collections import deque
import torch

class ReplayBuffer:
    """경험 재현 버퍼 — DQN, DDPG, SAC 3일 내내 재사용합니다"""
    def __init__(self, capacity=100_000):
        self.buffer = deque(maxlen=capacity)

    def push(self, s, a, r, s_next, done):
        self.buffer.append((s, a, r, s_next, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        s, a, r, s_next, done = zip(*batch)
        return (torch.as_tensor(s, dtype=torch.float32),
                torch.as_tensor(a, dtype=torch.int64),
                torch.as_tensor(r, dtype=torch.float32),
                torch.as_tensor(s_next, dtype=torch.float32),
                torch.as_tensor(done, dtype=torch.float32))

    def __len__(self):
        return len(self.buffer)`,
      },
    },
    {
      slot: 2,
      time: '10:30 ~ 11:30',
      title: 'Double DQN 소개',
      kind: 'theory',
      objectives: [
        'Q-Learning의 최대화 편향(maximization bias)이 왜 생기는지 이해한다',
        'Double DQN이 선택과 평가를 분리하는 방식을 설명할 수 있다',
      ],
      theory: [
        {
          h: '최대화 편향',
          p: `max 연산은 노이즈가 있는 추정치들 중 "가장 크게 잘못 추정된 값"을 골라내는 경향이 있습니다. E[max(Q̂)] ≥ max(E[Q̂]) 이기 때문에, Q-Learning의 목표 r + γ max Q(s')는 체계적으로 과대평가됩니다. 동전을 여러 번 던져 가장 운 좋았던 결과를 실력으로 착각하는 것과 같습니다.`,
        },
        {
          h: 'Double DQN — 선택과 평가의 분리',
          p: `해법: 행동 "선택"은 온라인 네트워크 θ로, 그 행동의 "평가"는 타깃 네트워크 θ⁻로 나눕니다.
DQN 목표:        r + γ max_a' Q(s', a'; θ⁻)
Double DQN 목표: r + γ Q(s', argmax_a' Q(s', a'; θ), θ⁻)
두 네트워크가 같은 방향으로 동시에 과대평가할 확률은 낮으므로 편향이 크게 줄어듭니다. 코드 수정은 한 줄이지만 아타리 벤치마크 성능이 유의미하게 오릅니다.`,
        },
        {
          h: '함께 알아두면 좋은 DQN 확장들',
          p: `Dueling DQN: Q(s,a) = V(s) + A(s,a)로 분해해 상태 가치와 행동별 이점을 따로 학습.
Noisy DQN: ε-greedy 대신 가중치에 학습 가능한 노이즈를 넣어 상태 의존적 탐험.
Prioritized Replay: TD 오차가 큰 전이를 더 자주 샘플링.
이들을 모두 결합한 것이 Rainbow(2017)입니다.`,
        },
      ],
      code: {
        filename: 'ddqn_target.py',
        source: `import torch

# DQN vs Double DQN — 목표(target) 계산의 차이
@torch.no_grad()
def dqn_target(q_target, r, s_next, done, gamma=0.99):
    max_q = q_target(s_next).max(dim=1).values          # 타깃넷이 선택+평가
    return r + gamma * max_q * (1 - done)

@torch.no_grad()
def double_dqn_target(q_online, q_target, r, s_next, done, gamma=0.99):
    best_a = q_online(s_next).argmax(dim=1, keepdim=True)   # 선택: 온라인넷
    max_q = q_target(s_next).gather(1, best_a).squeeze(1)   # 평가: 타깃넷
    return r + gamma * max_q * (1 - done)`,
      },
    },
    {
      slot: 3,
      time: '11:30 ~ 12:30',
      title: 'PyTorch 소개 및 구현',
      kind: 'impl',
      objectives: [
        'Tensor, Autograd, nn.Module, Optimizer의 역할을 이해한다',
        'PyTorch 학습 루프의 5단계 정형 패턴을 몸에 익힌다',
      ],
      theory: [
        {
          h: 'PyTorch 핵심 4요소',
          p: `Tensor: GPU 연산이 가능한 다차원 배열 (NumPy와 API 유사, .to("cuda")로 이동).
Autograd: 연산 그래프를 동적으로 기록해 .backward() 한 번으로 모든 기울기 자동 계산.
nn.Module: 레이어와 파라미터를 묶는 모델의 기본 단위. __init__에 레이어 정의, forward에 순전파.
Optimizer: 계산된 기울기로 파라미터 갱신 (SGD, Adam 등).`,
        },
        {
          h: '학습 루프 5단계 — 모든 딥러닝의 공통 패턴',
          p: `① 순전파: pred = model(x)
② 손실 계산: loss = criterion(pred, y)
③ 기울기 초기화: optimizer.zero_grad()
④ 역전파: loss.backward()
⑤ 갱신: optimizer.step()
오늘 오후의 DQN도, 3일차의 SAC도 이 5단계 위에서 손실 함수만 바뀝니다.`,
        },
      ],
      code: {
        filename: 'pytorch_basics.py',
        source: `import torch
import torch.nn as nn

device = "cuda" if torch.cuda.is_available() else "cpu"

# ── 1. Tensor & Autograd ──
x = torch.tensor([2.0], requires_grad=True)
y = x ** 2 + 3 * x          # y = x² + 3x
y.backward()
print(x.grad)               # dy/dx = 2x + 3 = 7

# ── 2. nn.Module로 Q-네트워크 정의 ──
class QNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden=128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, action_dim),
        )
    def forward(self, s):
        return self.net(s)      # 각 행동의 Q값 벡터

# ── 3. 학습 루프 5단계 (회귀 예제로 패턴 익히기) ──
model = QNetwork(4, 2).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.MSELoss()

states = torch.randn(64, 4, device=device)       # 가짜 배치
targets = torch.randn(64, 2, device=device)

for step in range(200):
    pred = model(states)             # ① 순전파
    loss = criterion(pred, targets)  # ② 손실
    optimizer.zero_grad()            # ③ 기울기 초기화
    loss.backward()                  # ④ 역전파
    optimizer.step()                 # ⑤ 갱신
    if step % 50 == 0:
        print(f"step {step:3d}  loss = {loss.item():.4f}")`,
      },
    },
    {
      slot: 4,
      time: '13:30 ~ 14:30',
      title: 'DQN, Double DQN 구현',
      kind: 'impl',
      objectives: [
        'CartPole-v1에서 DQN 전체 파이프라인을 완성한다',
        '플래그 하나로 Double DQN으로 전환해 성능을 비교한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `CartPole-v1(막대 세우기, 500스텝 버티면 성공)에서 DQN을 처음부터 끝까지 조립합니다.
구성 요소: QNetwork(오전 작성) + ReplayBuffer(1교시 작성) + ε 스케줄링 + 타깃 네트워크 동기화.
double=True로 바꾸면 목표 계산만 Double DQN으로 전환됩니다.`,
        },
      ],
      code: {
        filename: 'dqn_cartpole.py',
        source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np

env = gym.make("CartPole-v1")
obs_dim = env.observation_space.shape[0]     # 4
n_actions = env.action_space.n               # 2

q_net = QNetwork(obs_dim, n_actions)
q_target = QNetwork(obs_dim, n_actions)
q_target.load_state_dict(q_net.state_dict())
optimizer = torch.optim.Adam(q_net.parameters(), lr=1e-3)
buffer = ReplayBuffer(50_000)

gamma, batch_size = 0.99, 64
eps, eps_min, eps_decay = 1.0, 0.05, 0.995
DOUBLE = True                                # ← Double DQN 스위치

def train_step():
    s, a, r, s_next, done = buffer.sample(batch_size)
    q = q_net(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        if DOUBLE:   # 선택은 온라인넷, 평가는 타깃넷
            best_a = q_net(s_next).argmax(1, keepdim=True)
            q_next = q_target(s_next).gather(1, best_a).squeeze(1)
        else:        # 타깃넷이 선택+평가 (바닐라 DQN)
            q_next = q_target(s_next).max(1).values
        target = r + gamma * q_next * (1 - done)
    loss = nn.functional.smooth_l1_loss(q, target)
    optimizer.zero_grad(); loss.backward(); optimizer.step()

returns = []
for episode in range(400):
    s, _ = env.reset()
    total, done = 0, False
    while not done:
        if np.random.rand() < eps:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = q_net(torch.as_tensor(s, dtype=torch.float32)).argmax().item()
        s_next, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buffer.push(s, a, r, s_next, float(term))
        s, total = s_next, total + r
        if len(buffer) >= 1000:
            train_step()
    eps = max(eps_min, eps * eps_decay)
    if episode % 20 == 0:                    # 타깃 네트워크 동기화
        q_target.load_state_dict(q_net.state_dict())
    returns.append(total)
    if episode % 20 == 0:
        print(f"ep {episode:3d}  return {np.mean(returns[-20:]):6.1f}  eps {eps:.2f}")
# 평균 리턴이 475를 넘으면 CartPole 해결!`,
      },
    },
    {
      slot: 5,
      time: '14:30 ~ 15:30',
      title: 'Policy Gradient 소개',
      kind: 'theory',
      objectives: [
        '가치 기반과 정책 기반 접근의 차이를 이해한다',
        'REINFORCE 알고리즘과 로그-미분 트릭을 이해한다',
      ],
      theory: [
        {
          h: '정책을 직접 학습하기',
          p: `DQN은 Q를 배우고 정책은 argmax로 유도했습니다. 정책 기반 방법은 정책 자체를 신경망 π(a|s;θ)로 만들고 기대 리턴 J(θ)를 직접 최대화합니다.
장점: ① 확률적 정책을 자연스럽게 표현 ② 연속 행동 공간에 바로 적용 가능 ③ 정책이 부드럽게 변해 수렴이 안정적.
단점: 그래디언트의 분산이 크고 샘플 효율이 낮습니다.`,
        },
        {
          h: '정책 경사 정리와 REINFORCE',
          p: `∇J(θ) = E[ ∇log π(a|s;θ) · G_t ]
"확률의 기울기"를 직접 구하는 대신 "로그 확률의 기울기 × 리턴"의 기대값으로 바꾸는 로그-미분 트릭이 핵심입니다.
직관: 리턴이 좋았던 행동의 로그 확률은 올리고, 나빴던 행동은 내린다.
REINFORCE는 이를 MC 방식(에피소드 종료 후 실제 G_t 사용)으로 구현한 가장 기본 알고리즘입니다.`,
        },
        {
          h: '베이스라인 — 분산 줄이기',
          p: `∇J(θ) = E[ ∇log π(a|s;θ) · (G_t − b(s)) ]
상태에만 의존하는 베이스라인 b(s)를 빼도 기대값은 불변이지만 분산은 크게 줄어듭니다. b(s) = V(s)를 쓰면 (G_t − V(s))는 "그 행동이 평균보다 얼마나 좋았나"를 뜻하는 어드밴티지가 됩니다 — 다음 교시 Actor-Critic의 핵심 아이디어입니다.`,
        },
      ],
      code: {
        filename: 'reinforce_cartpole.py',
        source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np

env = gym.make("CartPole-v1")

policy = nn.Sequential(
    nn.Linear(4, 128), nn.ReLU(),
    nn.Linear(128, 2),          # 행동별 로짓
)
optimizer = torch.optim.Adam(policy.parameters(), lr=1e-3)
gamma = 0.99

for episode in range(600):
    s, _ = env.reset()
    log_probs, rewards, done = [], [], False
    while not done:                              # 1) 에피소드 수집
        logits = policy(torch.as_tensor(s, dtype=torch.float32))
        dist = torch.distributions.Categorical(logits=logits)
        a = dist.sample()
        log_probs.append(dist.log_prob(a))
        s, r, term, trunc, _ = env.step(a.item())
        done = term or trunc
        rewards.append(r)

    G, returns = 0.0, []                         # 2) 리턴 계산 (뒤에서부터)
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    returns = torch.tensor(returns)
    returns = (returns - returns.mean()) / (returns.std() + 1e-8)  # 정규화(간이 베이스라인)

    loss = -(torch.stack(log_probs) * returns).sum()   # 3) ∇logπ · G
    optimizer.zero_grad(); loss.backward(); optimizer.step()

    if episode % 50 == 0:
        print(f"ep {episode:3d}  return {sum(rewards):.0f}")`,
      },
    },
    {
      slot: 6,
      time: '15:30 ~ 16:30',
      title: 'Actor-Critic 소개',
      kind: 'theory',
      objectives: [
        'Actor(정책)와 Critic(가치)의 역할 분담을 이해한다',
        '어드밴티지 함수와 A2C의 구조를 설명할 수 있다',
      ],
      theory: [
        {
          h: 'REINFORCE의 한계와 Critic의 등장',
          p: `REINFORCE는 에피소드가 끝나야 학습할 수 있고 G_t의 분산이 큽니다. 해법: 가치함수를 학습하는 두 번째 네트워크 Critic을 도입해, MC 리턴 대신 TD 부트스트래핑으로 매 스텝 학습합니다.
Actor: 정책 π(a|s;θ) — 행동을 결정
Critic: 가치 V(s;w) — 행동이 얼마나 좋았는지 평가
1일차의 "MC → TD" 전환을 정책 경사에 그대로 적용한 것입니다.`,
        },
        {
          h: '어드밴티지와 A2C',
          p: `어드밴티지 A(s,a) = Q(s,a) − V(s)는 "이 행동이 그 상태의 평균보다 얼마나 좋은가"입니다. 실전에서는 TD 오차 δ = r + γV(s') − V(s)가 어드밴티지의 불편추정치이므로 Critic 하나로 충분합니다.
Actor 손실:  −log π(a|s) · δ  (δ는 상수 취급, detach)
Critic 손실: δ²  (MSE)
A2C(Advantage Actor-Critic)는 여기에 여러 환경 병렬 수집 + 엔트로피 보너스(탐험 유지)를 더한 표준 구현입니다. A3C의 동기(synchronous) 버전이기도 합니다.`,
        },
      ],
      code: {
        filename: 'actor_critic_net.py',
        source: `import torch
import torch.nn as nn

class ActorCritic(nn.Module):
    """몸통을 공유하고 머리만 둘 — A2C의 표준 구조"""
    def __init__(self, state_dim, action_dim, hidden=128):
        super().__init__()
        self.body = nn.Sequential(
            nn.Linear(state_dim, hidden), nn.ReLU(),
        )
        self.actor_head = nn.Linear(hidden, action_dim)   # 정책 로짓
        self.critic_head = nn.Linear(hidden, 1)           # V(s)

    def forward(self, s):
        h = self.body(s)
        return self.actor_head(h), self.critic_head(h).squeeze(-1)

# 손실 구성 미리보기 (다음 교시에 전체 루프 완성)
def a2c_loss(logits, value, action, td_target, entropy_coef=0.01):
    dist = torch.distributions.Categorical(logits=logits)
    advantage = (td_target - value).detach()      # Critic 신호는 Actor로 역전파 금지
    actor_loss = -(dist.log_prob(action) * advantage).mean()
    critic_loss = nn.functional.mse_loss(value, td_target)
    entropy = dist.entropy().mean()               # 탐험 유지 보너스
    return actor_loss + 0.5 * critic_loss - entropy_coef * entropy`,
      },
    },
    {
      slot: 7,
      time: '16:30 ~ 17:30',
      title: 'A2C 구현',
      kind: 'impl',
      objectives: [
        'CartPole-v1에서 n-step A2C를 완성한다',
        'DQN·REINFORCE와 학습 속도·안정성을 비교한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `앞 교시의 ActorCritic 네트워크로 전체 학습 루프를 완성합니다. n-step(여기서는 5스텝) 롤아웃마다 업데이트해 REINFORCE보다 빠르게, DQN보다 부드럽게 학습되는 것을 확인합니다.`,
        },
      ],
      code: {
        filename: 'a2c_cartpole.py',
        source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np

env = gym.make("CartPole-v1")
model = ActorCritic(4, 2)
optimizer = torch.optim.Adam(model.parameters(), lr=7e-4)
gamma, n_steps = 0.99, 5

s, _ = env.reset()
ep_return, returns = 0, []
for update in range(3000):
    # ── n-step 롤아웃 수집 ──
    log_probs, values, rewards, entropies, dones = [], [], [], [], []
    for _ in range(n_steps):
        logits, v = model(torch.as_tensor(s, dtype=torch.float32))
        dist = torch.distributions.Categorical(logits=logits)
        a = dist.sample()
        s_next, r, term, trunc, _ = env.step(a.item())
        done = term or trunc
        log_probs.append(dist.log_prob(a)); values.append(v)
        rewards.append(r); dones.append(done)
        entropies.append(dist.entropy())
        ep_return += r
        s = s_next
        if done:
            returns.append(ep_return); ep_return = 0
            s, _ = env.reset()

    # ── n-step 리턴으로 TD 목표 계산 ──
    with torch.no_grad():
        _, v_last = model(torch.as_tensor(s, dtype=torch.float32))
    R, td_targets = v_last, []
    for r, d in zip(reversed(rewards), reversed(dones)):
        R = r + gamma * R * (1 - d)
        td_targets.insert(0, R)
    td_targets = torch.stack(td_targets).detach()
    values = torch.stack(values)
    advantages = td_targets - values

    actor_loss = -(torch.stack(log_probs) * advantages.detach()).mean()
    critic_loss = advantages.pow(2).mean()
    entropy = torch.stack(entropies).mean()
    loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy

    optimizer.zero_grad(); loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), 0.5)   # 기울기 폭주 방지
    optimizer.step()

    if update % 200 == 0 and returns:
        print(f"update {update:4d}  최근 20ep 평균 {np.mean(returns[-20:]):6.1f}")`,
      },
    },
  ],
}
