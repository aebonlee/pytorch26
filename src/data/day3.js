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
          p: `로봇 관절 토크, 자동차 핸들 각도처럼 행동이 연속값이면 max_a Q(s,a)를 계산할 수 없습니다 — 행동이 무한히 많기 때문입니다.
행동을 이산화하면 차원이 조금만 커져도 조합이 폭발합니다(7자유도 로봇 × 10단계 = 10^7 행동).
게다가 거친 이산화는 정밀 제어를 망칩니다 — 핸들을 10단계로만 꺾을 수 있는 자동차를 상상해 보세요.
매 스텝 경사하강 같은 수치 최적화로 argmax를 푸는 방법도 있지만, ==행동 하나 고를 때마다 내부 최적화 루프를 도는 비용==을 감당하기 어렵습니다.
결국 필요한 것은 "상태 → 연속 행동"을 한 번에 출력하는 무언가 — 2일차의 Actor가 정확히 그것입니다.`,
        },
        {
          h: '결정적 정책 경사 (DPG)',
          p: `**해법**: ==max를 "학습"으로 대체==합니다.
상태를 받아 연속 행동을 직접 출력하는 **결정적 정책 μ(s;θ)**를 두고, Critic이 평가한 Q(s, μ(s))가 커지는 방향으로 Actor를 갱신합니다.
∇J(θ) = E[ ∇_a Q(s,a)|_{a=μ(s)} · ∇_θ μ(s;θ) ]
읽는 법: "행동을 살짝 바꾸면 Q가 얼마나 오르는가(∇_a Q)" × "파라미터를 바꾸면 행동이 어떻게 변하는가(∇_θ μ)" — ==연쇄법칙으로 Critic을 통과해 Actor까지 기울기가 흐르는== 구조입니다.
구현은 놀랍게 단순해집니다: loss = −Q(s, μ(s))를 backward하면 PyTorch의 autograd가 이 연쇄법칙을 자동으로 수행합니다.
2일차 확률적 정책 경사와의 관계 — 가우시안 정책의 분산을 0으로 보내면 확률적 PG가 DPG로 수렴함이 증명되어 있고, ==행동 샘플링에 의한 분산이 사라져 저분산 추정==이 됩니다 (대신 탐험을 따로 챙겨야 함).`,
        },
        {
          h: 'DDPG = DPG + DQN 기법',
          p: `DDPG(Deep DPG, 2015)는 DPG에 DQN의 안정화 기법을 결합해 심층 연속 제어를 처음으로 실용화한 알고리즘입니다.
① 경험 재현 버퍼 — DPG는 off-policy라 버퍼 사용이 정당합니다 (2일차의 복선 회수).
② 타깃 네트워크 — 단, 하드 카피 대신 **소프트 업데이트** θ⁻ ← τθ + (1−τ)θ⁻ (τ≈0.005).
매 스텝 0.5%씩만 따라가므로 목표가 연속적으로 천천히 움직입니다 — Actor와 Critic이 서로 물고 도는 구조에서는 계단식 하드 카피보다 부드러운 추적이 안정적입니다.
**총 4개 네트워크**: Actor, Critic, Target Actor, Target Critic.`,
        },
        {
          h: '탐험 — 결정적 정책의 숙제',
          p: `결정적 정책은 같은 상태에서 늘 같은 행동 — ==스스로는 탐험을 전혀 하지 않습니다==.
그래서 행동에 노이즈를 더해 탐험합니다: a = μ(s) + N.
원논문은 관성이 있는 **OU(Ornstein-Uhlenbeck) 노이즈**를 썼지만, 후속 연구에서 ==단순 가우시안 노이즈로 충분==함이 확인되어 요즘은 대부분 가우시안을 씁니다 (실습도 가우시안, σ=0.1×max_action).
σ가 크면 넓게 탐험하지만 좋은 행동 근처를 못 지키고, 작으면 국소 탐색만 — 프로젝트 #5에서 σ 민감도를 직접 실험합니다.
"탐험을 수동 노이즈로 해결해야 한다"는 이 어색함이 오후 SAC(엔트로피 내장 탐험)의 복선입니다.`,
        },
        {
          h: 'DDPG의 한계와 TD3',
          p: `DDPG는 강력하지만 두 가지 고질병이 있습니다.
① **Q 과대평가**: Actor가 "Critic이 과대평가한 방향"으로 정책을 밀어붙입니다 — 2일차 최대화 편향이 연속 공간에서 더 교묘하게 재발 (max 대신 gradient ascent가 과대평가 지점을 찾아냄).
② **하이퍼파라미터 민감성**: 시드·학습률에 따라 성능이 널뛰는 것으로 악명 높습니다.
후속작 **TD3(2018)**의 3가지 처방 — 트윈 Q의 min 사용(Clipped Double-Q), 타깃 정책 스무딩(목표 행동에 노이즈), Actor 지연 업데이트(Critic 2번당 1번).
이 중 ==트윈 Q는 오후의 SAC가 그대로 채택==합니다 — DDPG의 한계가 SAC로 이어지는 동기입니다.`,
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
          h: '실습 개요 — Pendulum 환경 스펙',
          p: `Pendulum-v1(진자를 거꾸로 세워 유지하기)에서 DDPG를 완성합니다.
상태 3차원: (cos θ, sin θ, 각속도) — 각도를 cos/sin으로 넣는 것은 ==0°와 360°가 같은 상태임을 연속 표현==하기 위한 표준 기법입니다.
행동 1차원: 토크 u ∈ [−2, 2] (연속!).
보상: −(θ² + 0.1·각속도² + 0.001·u²) — 항상 0 이하이며, ==곧게 서서(θ=0) 가만히(각속도 0) 힘 안 들이고(u≈0) 있을 때 최대==입니다.
에피소드 200스텝 고정 — 무작위 정책은 리턴 −1200 근처, ==−200 근처까지 오르면 성공==적으로 학습된 것입니다.`,
        },
        {
          h: '구현 디테일 — 업데이트 순서와 부호',
          p: `한 train_step의 순서: ==① Critic 업데이트 → ② Actor 업데이트 → ③ 소프트 업데이트==.
① Critic: 목표 y는 반드시 **타깃 네트워크들**로 계산(no_grad) — 온라인넷으로 만들면 "움직이는 목표"가 재발합니다.
② Actor: loss = −critic(s, actor(s)).mean() — ==마이너스 부호가 "Q 최대화"를 "손실 최소화"로 바꾸는 전부==입니다.
이때 critic 파라미터에도 기울기가 계산되지만, actor_opt에는 actor 파라미터만 등록되어 있으므로 Critic은 갱신되지 않습니다 (옵티마이저 분리가 안전장치).
③ soft_update 두 번 — Actor 타깃과 Critic 타깃 모두.
학습률 비대칭(Actor 1e-4 < Critic 1e-3)에 주목 — ==평가자(Critic)가 행동자(Actor)보다 빨리 배워야== 부정확한 Q로 정책을 밀어붙이는 사고를 줄일 수 있습니다.`,
        },
        {
          h: '학습곡선 읽기와 디버깅',
          p: `정상 패턴: 초반 20~30 에피소드는 −1200 부근(버퍼 채우기+탐험) → 빠르게 상승 → −200 안팎에서 진동.
DDPG 특유의 증상 — 올라갔다가 ==갑자기 −1000대로 무너지는 성능 붕괴==가 종종 옵니다 (Q 과대평가가 임계점을 넘는 순간).
**증상별 처방**:
전혀 안 오름 — Actor 손실 부호, 타깃넷으로 y 계산 여부, 노이즈 clip 확인.
심하게 요동 — τ를 줄이거나(0.001) Critic lr을 낮추기.
붕괴 반복 — 트윈 Q(min)를 붙여 보세요 (TD3 처방, 프로젝트 #5·#6에서 SAC와 비교).
관찰 실험: 노이즈 σ를 0으로 끄고 학습해 보면 — ==탐험 없는 결정적 정책이 국소해에 갇히는 것==을 직접 볼 수 있습니다.`,
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
결정적 정책은 하나의 해에 조기 수렴하기 쉽습니다.
탐험이 부족해지고, 환경이 조금만 바뀌어도 무너지며, 동일하게 좋은 여러 경로가 있어도 하나만 배웁니다.
지금까지의 탐험 장치들을 돌아보면 — ε-greedy(1일차), 엔트로피 보너스(2일차 A2C), 행동 노이즈(오전 DDPG) — 모두 ==목적함수 바깥에서 덧붙인 임시방편==이었습니다.
최대 엔트로피 RL의 질문: 탐험을 아예 최적화 목표 안에 넣으면 어떨까?`,
        },
        {
          h: '엔트로피 복습',
          p: `엔트로피 H(π) = −Σ_a π(a|s) log π(a|s) — ==분포의 "무작위함"을 재는 척도==입니다.
한 행동에 확률이 몰리면(결정적) H = 0, 균등분포일 때 최대(log|A|).
연속 분포에서는 가우시안의 σ가 클수록 엔트로피가 큽니다 — "정책의 엔트로피를 유지하라"는 곧 "σ를 너무 빨리 좁히지 말라"는 뜻이 됩니다.
2일차 A2C의 엔트로피 보너스와의 차이 — A2C는 손실에 살짝 얹는 정규화였지만, 지금부터는 ==보상과 같은 자격으로 목적함수에 들어가 가치함수의 정의 자체를 바꿉니다==.`,
        },
        {
          h: '최대 엔트로피 목적함수',
          p: `==J(π) = E[ Σ r_t + α·H(π(·|s_t)) ]==
매 스텝 정책의 엔트로피 H를 보상에 더합니다.
=="보상을 최대화하되, 가능한 한 무작위로 행동하라"==는 뜻입니다.
**α(온도)**가 보상과 엔트로피의 균형을 조절합니다: α가 크면 탐험적, 0이면 표준 RL로 환원.
효과: ① 탐험이 목적함수에 내장됨 ② 여러 좋은 해를 모두 포착 ③ 방해·변화에 강건 ④ 더 나은 초기화로 전이 학습 유리.
④의 직관 — 한 가지 해만 외운 정책보다 "좋은 행동의 분포"를 배운 정책이 새 과제에 재적응하기 쉽습니다.`,
        },
        {
          h: 'Soft 가치함수와 볼츠만 최적 정책',
          p: `엔트로피가 더해지면 벨만 방정식도 "soft" 버전이 됩니다.
soft V(s) = E_a[ Q(s,a) − α log π(a|s) ]
soft Q(s,a) = r + γ E[ V(s') ]
고정된 Q에서 soft V를 최대화하는 정책을 풀면(라그랑주 승수법) — 최적해는 ==π(a|s) ∝ exp(Q(s,a)/α)==.
Q값이 높은 행동일수록 지수적으로 자주 선택하되 결코 확률 0이 되지 않는 **볼츠만 분포**입니다.
이때 soft V(s) = α·log Σ_a exp(Q(s,a)/α) — ==max의 부드러운 버전(log-sum-exp)==이 됩니다.
α→0이면 진짜 max로 수렴 — "soft"라는 이름이 여기서 옵니다 (hard max를 부드럽게 만든 것).`,
        },
        {
          h: '이론적 뿌리와 계보',
          p: `최대 엔트로피 RL은 **제어를 확률적 추론으로 보는 관점**(control as inference)과 동치입니다 — "최적 행동의 사후분포를 추론"하는 문제로 쓰면 정확히 이 목적함수가 나옵니다.
물리학의 에너지 기반 모델과도 연결됩니다 — exp(Q/α)는 에너지 −Q, 온도 α의 볼츠만 분포 그 자체.
강건성 결과도 있습니다 — 최대 엔트로피 정책은 ==보상이나 동역학의 최악의 교란에 대비하는 로버스트 제어==와 연결됩니다.
계보: soft Q-Learning(2017, 볼츠만 정책을 근사 샘플링) → **SAC(2018, Actor로 볼츠만 정책을 직접 근사)** — 다음 교시가 바로 이 실용판입니다.`,
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
DDPG와의 비교: off-policy + 재현 버퍼 + 소프트 업데이트는 같지만, ① 결정적 → 확률적(가우시안) 정책 ② 탐험 노이즈 불필요(엔트로피가 담당) ③ ==하이퍼파라미터에 훨씬 덜 민감==합니다.
③이 실무에서 SAC가 사랑받는 진짜 이유입니다 — DDPG는 시드마다 널뛰는데 SAC는 기본 설정으로도 넓은 범위의 문제에서 안정적으로 돌아갑니다.
구성: GaussianActor 1개 + Q 네트워크 2개 + Q 타깃 2개 + 학습되는 α — 총 5개 네트워크와 스칼라 1개.`,
        },
        {
          h: '요소 ① 확률적 Actor — tanh-squashed Gaussian',
          p: `상태를 받아 가우시안의 평균 μ와 로그 표준편차 log σ를 출력하고, 샘플 u ~ N(μ, σ)를 **tanh로 눌러** 행동 범위 [−1,1]에 맞춥니다.
log σ를 [−20, 2]로 clamp — σ가 0이나 무한대로 폭주하는 것을 막는 실전 안전장치입니다.
tanh로 변수를 변환했으므로 ==로그 확률에 보정항이 필요==합니다 (change of variables): log π(a) = log N(u) − Σ log(1 − tanh²(u)).
실습 코드의 "log_prob −= log(1 − a² + 1e-6)" 한 줄이 바로 이 보정 — ==빼먹으면 α 자동조절이 엉뚱한 엔트로피를 보고 학습 전체가 무너지는== 대표 버그입니다.`,
        },
        {
          h: '요소 ② 트윈 Q (Clipped Double-Q)',
          p: `Q 네트워크 2개를 독립적으로 학습하고, ==목표 계산 시 min(Q1', Q2')를 사용==합니다.
2일차 Double DQN이 "선택과 평가 분리"로 편향을 줄였다면, 트윈 Q는 더 공격적으로 ==둘 중 작은 쪽을 믿는 비관주의==로 과대평가를 누릅니다.
연속 행동에서는 Actor가 Q의 과대평가 지점을 gradient ascent로 정확히 찾아내므로, 이산 경우보다 강한 처방이 필요합니다 (TD3에서 도입, SAC가 채택).
두 Q는 같은 목표에 회귀하지만 초기화가 달라 서로 다른 오차 패턴을 가짐 — min이 노이즈의 아래쪽 포락선을 취하는 효과입니다.`,
        },
        {
          h: '요소 ③ 자동 온도 조절',
          p: `α를 고정하면 문제·학습 단계마다 최적값이 달라 튜닝 부담이 큽니다.
SAC의 해법: =="평균 엔트로피 ≥ 목표 엔트로피" 제약이 있는 최적화==로 문제를 다시 쓰고, 그 라그랑주 승수가 바로 α가 되도록 학습합니다.
α 손실: −α · (log π + target_entropy)의 평균 — 현재 엔트로피가 목표보다 낮으면 α가 커지고(탐험 강화), 높으면 작아집니다.
목표 엔트로피의 관례값은 **−action_dim** (행동 차원당 −1) — Pendulum이면 −1.
학습 중 α 궤적을 보면 보통 ==초반에 크다가 정책이 자신감을 얻으며 감소== — 탐험→활용 전환이 자동으로 일어나는 것을 볼 수 있습니다.`,
        },
        {
          h: '재매개변수화 트릭',
          p: `Actor 손실 E[ α log π(a|s) − Q(s,a) ]를 줄이려면 샘플링 연산을 통과해 기울기를 흘려야 합니다.
a = tanh( μ(s) + σ(s) ⊙ ε ),  ε ~ N(0, I)
무작위성을 파라미터와 무관한 ε으로 분리하면 μ, σ에 대해 미분 가능해집니다 — VAE에서 쓰는 것과 같은 트릭입니다.
대안인 REINFORCE-식 추정(∇log π × 값)도 불편추정이지만 분산이 훨씬 큽니다 — ==미분 가능한 경로가 있으면 재매개변수화가 항상 우월==합니다.
PyTorch에서는 ==dist.rsample()이 이 역할==을 합니다 (**sample()과의 차이에 주의!** — sample()은 그래프를 끊어 Actor에 기울기가 흐르지 않습니다).`,
        },
        {
          h: '손실 3종 정리',
          p: `**Q 손실**: MSE( Q_i(s,a), r + γ(1−d)·[min Q'(s',a') − α log π(a'|s')] ), a'는 현재 정책에서 샘플 — i=1,2 각각.
**Actor 손실**: E[ α log π(a|s) − min Q(s, a) ], a는 rsample — "Q 높은 곳으로, 단 엔트로피를 잃지 말며".
**α 손실**: −α · E[log π + H_target].
업데이트 순서는 Q → Actor → α → 소프트 업데이트 — 다음다음 교시(SAC 구현)에서 이 순서 그대로 조립합니다.`,
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
          p: `SAC의 softmax 정책 π ∝ exp(Q/α)는 모든 행동에 0이 아닌 확률을 부여합니다.
Q값이 명백히 낮은 나쁜 행동도 계속 시도한다는 뜻입니다.
행동 공간이 크거나 위험한 행동이 있는 문제에서는 이 "끝까지 남는 꼬리 확률"이 성능을 갉아먹습니다.
근본 원인 — 샤논 엔트로피의 −log는 확률이 0에 가까워질 때 무한대로 발산하므로, ==어떤 행동의 확률을 정확히 0으로 만드는 것이 무한히 비싸집니다==.
"모든 행동에 조금씩은 확률을 남겨라"가 샤논 엔트로피에 내장된 강제 조항인 셈입니다.`,
        },
        {
          h: 'Tsallis 엔트로피 — 엔트로피의 일반화',
          p: `Tsallis 엔트로피는 통계물리학자 Tsallis가 제안한 일반화 엔트로피로, q-로그(log_q)로 정의됩니다.
S_q(π) = E[ −log_q π(a|s) ],  log_q(x) = (x^{q−1} − 1)/(q − 1)
==q → 1이면 샤논 엔트로피로 수렴(즉 SAC는 TAC의 특수 사례)==, q = 2이면 sparse 엔트로피가 됩니다.
핵심 성질 — q>1이면 log_q가 ==확률 0 근처에서 발산하지 않고 유한==합니다: 확률을 0으로 만드는 비용이 유한해져, 가망 없는 행동을 "포기"할 수 있게 됩니다.
q > 1일수록 최적 정책이 **sparsemax** 형태 — 가망 없는 행동의 확률을 정확히 0으로 잘라내고 ==유망한 소수 행동에만 확률을 배분(지지집합 축소)== — 에 가까워집니다.
sparsemax는 어텐션 연구에서도 쓰이는 "softmax의 희소 버전"입니다.`,
        },
        {
          h: 'TAC (Tsallis Actor-Critic)',
          p: `TAC는 SAC의 엔트로피 항을 Tsallis 엔트로피로 교체한 알고리즘입니다 (Lee et al., 2019).
수정은 정확히 두 곳 — soft TD 목표와 Actor 손실에서 ==log π를 log_q π로 바꾸는 것==이 전부입니다 (마지막 교시에서 직접 확인).
**q가 하나의 다이얼**이 됩니다: q=1(SAC, 모든 행동 탐험) ↔ q=2(유망한 행동에만 집중 탐험).
벨만 방정식·수렴 보장 등 이론 골격은 일반화된 형태로 그대로 성립합니다 — "엔트로피의 모양만 갈아끼운" 깨끗한 일반화입니다.`,
        },
        {
          h: '언제 어떤 q를 쓰나',
          p: `**q>1이 유리**: 행동 공간이 크고 보상이 밀집된 문제 — 나쁜 행동에 낭비하는 샘플이 줄어 학습이 빨라집니다.
**q≈1이 유리**: sparse reward 문제 — 어떤 행동이 좋을지 모르니 꼬리 확률(넓은 탐험)을 유지하는 편이 안전합니다.
==문제 특성에 맞게 "엔트로피의 모양"을 선택한다==는 관점이 핵심 — 탐험 전략도 설계 대상이라는 것이 이 교시의 메시지입니다.
같은 계열의 확장 흐름 — 일반화 Tsallis RL(q를 실수 전체로), 엔트로피 함수 자체를 학습하는 연구들이 이어지고 있습니다.
저차원 행동(Pendulum)에서는 q의 효과가 작고, ==고차원(HalfCheetah 17차원 등)일수록 뚜렷==해집니다 — 프로젝트 #6의 실험 포인트.`,
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
          p: `4교시의 GaussianActor와 DDPG 실습의 Critic·버퍼·soft_update를 재사용해 SAC를 조립합니다.
트윈 Q와 자동 α 조절이 새로 추가되는 부분입니다.
탐험 노이즈 코드가 사라진 것에 주목 — ==행동 샘플링 자체가 탐험==이라 DDPG의 σ 튜닝이 필요 없습니다.
==DDPG보다 적은 에피소드로 안정적으로 수렴==하는 것을 확인하세요 (같은 Pendulum 기준 150 vs 200 에피소드).`,
        },
        {
          h: '업데이트 순서와 기울기 흐름',
          p: `train_step 한 번의 순서: ==① 트윈 Q 업데이트 → ② Actor 업데이트 → ③ α 업데이트 → ④ 소프트 업데이트==.
① 목표 y 계산은 통째로 no_grad — a'와 log π(a')는 **현재 정책**에서 새로 샘플합니다 (버퍼의 낡은 행동이 아니라!).
② Actor 손실의 Q는 **온라인 트윈의 min** — 타깃이 아닙니다 (타깃은 목표 계산 전용).
③ α 손실에서 log π는 detach — ==α 업데이트가 Actor를 흔들면 안 됩니다==.
두 Q의 옵티마이저를 하나로 묶고(파라미터 합집합), Actor·α는 각자 옵티마이저 — 기울기 흐름의 분리를 옵티마이저 등록으로 보장하는 패턴입니다.`,
        },
        {
          h: '하이퍼파라미터 가이드',
          p: `**lr 3e-4 통일**(Actor·Q·α 모두) — SAC의 유명한 미덕으로, DDPG처럼 비대칭 튜닝이 필요 없습니다.
**배치 256**: DDPG(128)보다 큰 것이 관례 — 확률적 정책의 기울기 분산을 배치로 눌러줍니다.
**τ=0.005, γ=0.99**: DDPG와 동일.
**target_entropy = −action_dim**: Pendulum이면 −1 — 바꿀 일이 거의 없는 값입니다.
지켜볼 로그 두 가지: 리턴 곡선과 ==α 궤적== — α가 초반 상승(또는 유지) 후 서서히 감소하면 탐험→활용 전환이 정상 작동하는 것입니다.`,
        },
        {
          h: '디버깅 체크리스트',
          p: `① 리턴이 늘 −1200 부근 — tanh log-prob 보정 누락 여부부터 확인 (가장 흔한 원인).
② α가 폭주(수십~수백) — log π 부호 실수 또는 target_entropy 부호 실수.
③ Q 손실이 발산 — 목표 계산에서 min을 빼먹고 단일 Q를 썼는지, no_grad 빠졌는지 확인.
④ 학습이 너무 느림 — 배치를 키우거나 스텝당 train_step 횟수를 2로.
비교 실험: 어제·오늘 배운 세 가지(DQN류는 불가) 중 ==DDPG와 SAC를 같은 시드로 겹쳐 그리는 것==이 프로젝트 #5 — 밴드 폭(분산)의 차이가 SAC의 가치를 한눈에 보여줍니다.`,
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
          p: `TAC의 아름다운 점: ==SAC 구현에서 log π를 log_q π로 바꾸는 것이 수정의 전부==입니다.
수정 지점은 정확히 두 곳 — soft TD 목표의 엔트로피 항과 Actor 손실의 엔트로피 항.
q_log_prob 함수에서 확률 복원 시 clamp(min=1e-8)를 거는 이유 — log_prob.exp()가 0이 되면 0의 거듭제곱에서 수치 문제가 생기기 때문입니다.`,
        },
        {
          h: '실험 프로토콜 — 회귀 테스트부터',
          p: `순서가 중요합니다.
① ==q=1.0으로 두고 SAC와 완전히 동일하게 동작하는지 먼저 검증==합니다 (**회귀 테스트**) — 같은 시드에서 두 곡선이 겹쳐야 합니다.
"일반화를 구현하면 특수 사례로 원본을 재현해 본다" — 연구·실무 공통의 검증 습관입니다.
② q=1.5, 2.0으로 올려 학습 곡선을 비교합니다.
③ 학습된 정책의 행동 분포 히스토그램을 q별로 겹쳐 그려 보세요 — ==q가 클수록 분포가 좁아지는(집중 탐험)== 것이 이론의 예측입니다.
Pendulum(행동 1차원)에서는 차이가 작게 보이는 것이 정상 — 고차원 확장은 프로젝트 #6에서.`,
        },
        {
          h: '3일 과정 종합 — 알고리즘 계보 한 장',
          p: `**표 기반**(1일차): MDP·벨만 → DP(모델 有) → MC/TD(모델 無) → SARSA/Q-Learning.
**가치 기반**(2일차 오전): Q테이블 → 신경망 근사 + 재현버퍼·타깃넷(DQN) → 선택/평가 분리(DDQN).
**정책 기반**(2일차 오후): 정책 직접 미분(REINFORCE) → Critic 결합(A2C).
**연속 제어**(3일차 오전): Actor-Critic + DQN 기법(DDPG) → 비관적 트윈 Q(TD3).
**최대 엔트로피**(3일차 오후): 탐험을 목적함수로(SAC) → 엔트로피 일반화(TAC).
관통하는 세 질문 — ==목표(target)를 무엇으로 만드는가, 탐험을 어떻게 하는가, 무엇으로 안정화하는가==.
새 논문을 읽을 때도 이 세 질문으로 해부하면 대부분 이 지도 위의 어딘가에 놓입니다.
이후 복습 퀴즈(15문항)와 미니 프로젝트(8종), 심화학습 자료로 이어집니다 — 수고하셨습니다!`,
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
