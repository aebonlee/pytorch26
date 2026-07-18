// ============================================================
// 2일차 — Value-based & Policy-based methods (공식 목차 7교시)
// ------------------------------------------------------------
// 코드 재사용 흐름: 1교시 ReplayBuffer + 3교시 QNetwork를
// 4교시 DQN 실습이 조립한다(DOUBLE 플래그로 DDQN 전환).
// 6교시 ActorCritic 네트워크를 7교시 A2C 루프가 사용.
// ReplayBuffer는 3일차 DDPG·SAC에서도 계속 쓰인다.
// ============================================================
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
      difficulty: 3,
      importance: 5,
      objectives: [
        '테이블 방식의 한계와 함수 근사의 필요성을 이해한다',
        'DQN의 핵심 요소인 경험 재현(Replay Buffer)과 타깃 네트워크를 설명할 수 있다',
      ],
      theory: [
        {
          h: '테이블에서 신경망으로',
          p: `상태가 이미지(아타리: 84×84×4)라면 상태 수가 256^28224 — Q 테이블은 만들 수 없습니다.
==Q(s,a)를 신경망 Q(s,a;θ)로 근사하는 것이 Deep Q-Network(DQN)==입니다.
함수 근사의 진짜 힘은 메모리 절약이 아니라 **일반화(generalization)** — 비슷한 상태끼리 학습이 공유되어, 안 가본 상태에서도 그럴듯한 Q를 추정합니다.
테이블은 상태마다 독립된 칸이라 일반화가 0이었다는 점을 떠올려 보세요.
DeepMind가 2013/2015년 아타리 49개 게임을 같은 네트워크·같은 하이퍼파라미터로 사람 수준까지 학습시키며 심층강화학습 시대를 열었습니다.`,
        },
        {
          h: '네트워크 설계 — 입력과 출력의 배치',
          fig: 'qnet-io',
          p: `순진한 설계는 (s, a)를 입력받아 Q값 하나를 출력하는 것이지만, 그러면 ==행동 수만큼 순전파를 반복==해야 argmax를 구할 수 있습니다.
DQN의 설계: ==상태 s만 입력받아 모든 행동의 Q값 벡터를 한 번에 출력== — 순전파 1회로 argmax와 max가 모두 해결됩니다.
이 구조가 오늘 실습 코드의 QNetwork(출력 차원 = 행동 수)이며, 벡터 상태는 MLP, 이미지 상태는 CNN 몸통을 쓰는 것만 다릅니다.
단, 이 설계는 행동이 이산적일 때만 가능 — 연속 행동에서 무너지는 지점이 3일차 DDPG의 출발점입니다.`,
        },
        {
          h: '왜 그냥 신경망 + Q-Learning은 발산하는가',
          p: `① **연속된 샘플 간 강한 상관관계** — SGD는 i.i.d. 데이터를 가정하는데 궤적 데이터는 시간적으로 강하게 상관되어 있습니다.
방금 왼쪽으로 갔다면 다음 샘플도 왼쪽 근처 — 미니배치가 한쪽으로 쏠려 네트워크가 최근 경험에 과적합되고 과거를 잊습니다(catastrophic forgetting).
② **움직이는 목표** — TD 목표 r + γ max Q(s';θ)가 학습 중인 θ 자신에 의존하므로 목표가 계속 흔들립니다.
개를 쫓는 꼬리처럼, 자신을 향해 회귀하는 학습은 오차가 증폭될 수 있습니다.
이론적으로는 ==함수 근사 + 부트스트래핑 + off-policy 세 가지의 조합==이 발산을 일으킬 수 있음이 알려져 있습니다 (**deadly triad**).
DQN은 이 셋을 다 쓰면서도 아래 두 처방으로 실전에서 안정화에 성공한 사례입니다.`,
        },
        {
          h: '처방 ① 경험 재현 (Experience Replay)',
          p: `전이 (s, a, r, s', done)를 큰 버퍼(보통 10만~100만)에 쌓아 두고 ==무작위 미니배치로 샘플링==합니다.
효과 1: 시간 상관관계가 깨져 i.i.d.에 가까운 배치가 됩니다.
효과 2: 한 경험을 여러 번 재사용 — 샘플 효율이 크게 오릅니다.
효과 3: 배치 평균으로 업데이트 분산도 줄어듭니다.
이것이 가능한 전제가 바로 1일차의 **off-policy** — 버퍼 속 경험은 과거의 (더 탐험적인) 정책이 만든 것인데, Q-Learning의 max 목표는 행동 정책과 무관하므로 문제없습니다.
==on-policy 알고리즘(SARSA, 오후의 A2C)은 원칙적으로 재현 버퍼를 쓸 수 없다==는 대비를 기억해 두세요.`,
        },
        {
          h: '처방 ② 타깃 네트워크 (Target Network)',
          fig: 'dqn',
          p: `목표 계산용 네트워크 θ⁻를 별도로 두고 ==일정 주기(수백~수천 스텝)마다만 θ를 복사==합니다.
그 사이 TD 목표는 고정 — "움직이는 목표"가 "계단식으로 움직이는 목표"로 바뀌어 회귀가 안정됩니다.
동기화 주기의 트레이드오프: 길수록 안정적이지만 최신 정보 반영이 느리고, 짧을수록 그 반대입니다 (실습 기본값: 20 에피소드).
3일차의 DDPG·SAC는 하드 카피 대신 매 스텝 조금씩 섞는 **소프트 업데이트**를 씁니다 — 같은 목적의 다른 구현.
손실 함수: L(θ) = E[( r + γ max_a' Q(s',a';θ⁻) − Q(s,a;θ) )²] — θ⁻ 쪽으로는 기울기를 흘리지 않습니다(no_grad).`,
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
      difficulty: 3,
      importance: 4,
      objectives: [
        'Q-Learning의 최대화 편향(maximization bias)이 왜 생기는지 이해한다',
        'Double DQN이 선택과 평가를 분리하는 방식을 설명할 수 있다',
      ],
      theory: [
        {
          h: '최대화 편향',
          fig: 'overest',
          p: `max 연산은 노이즈가 있는 추정치들 중 "가장 크게 잘못 추정된 값"을 골라내는 경향이 있습니다.
E[max(Q̂)] ≥ max(E[Q̂]) 이기 때문에, Q-Learning의 목표 r + γ max Q(s')는 **체계적으로 과대평가**됩니다.
동전을 여러 번 던져 가장 운 좋았던 결과를 실력으로 착각하는 것과 같습니다.
사고 실험 — 참 Q값이 전부 0인 상태에서 추정 노이즈가 ±1이라면, max는 거의 항상 +쪽 노이즈를 골라 목표가 양수로 부풀고, 부트스트래핑을 타고 ==한 상태의 과대평가가 이전 상태들로 전파·누적==됩니다.
표 기반에서는 시간이 지나면 씻겨 나가지만, 함수 근사에서는 일반화 때문에 이웃 상태까지 함께 부풀어 훨씬 심각합니다.
van Hasselt의 실측(2015): 아타리 다수 게임에서 DQN의 Q 추정치가 실제 리턴을 크게 웃돌았고, Double DQN은 참값에 근접했습니다.`,
        },
        {
          h: 'Double DQN — 선택과 평가의 분리',
          p: `**해법**: ==행동 "선택"은 온라인 네트워크 θ로, 그 행동의 "평가"는 타깃 네트워크 θ⁻로 나눕니다==.
DQN 목표:        r + γ max_a' Q(s', a'; θ⁻)
Double DQN 목표: r + γ Q(s', argmax_a' Q(s', a'; θ), θ⁻)
원리: 온라인넷이 운 좋게 과대평가한 행동을 골라도, ==독립적으로 학습된 타깃넷이 같은 행동을 똑같이 과대평가했을 확률은 낮으므로== 평가값이 현실적으로 나옵니다.
원조 Double Q-Learning(2010)은 테이블 2개를 번갈아 썼는데, DQN에는 이미 네트워크가 2개(온라인·타깃) 있으니 그대로 재활용한 것이 Double DQN(2015)입니다.
코드 수정은 한 줄이지만 아타리 벤치마크 성능이 유의미하게 오릅니다.`,
        },
        {
          h: 'Dueling DQN — V와 A의 분해',
          fig: 'dueling',
          p: `Q(s,a) = V(s) + A(s,a)로 분해해, 몸통을 공유하는 두 갈래 머리로 **상태 가치 V**와 **행동별 어드밴티지 A**를 따로 학습합니다.
직관: 어떤 상태에서는 무슨 행동을 하든 결과가 비슷합니다(전방에 장애물이 없는 도로).
그럴 때 행동마다 Q를 따로 배우는 대신 ==V 하나로 모든 행동의 학습이 공유==되니 효율이 오릅니다.
식별성 문제(V에 +10, A에 -10 해도 Q 동일)는 A의 평균을 0으로 강제하는 정규화로 해결합니다.
이 "가치와 어드밴티지 분리" 관점은 A2C의 어드밴티지와도 자연스럽게 이어집니다.`,
        },
        {
          h: 'Prioritized Replay와 Noisy DQN',
          p: `**Prioritized Experience Replay**: 균등 샘플링 대신 ==TD 오차가 큰(놀라웠던) 전이를 더 자주 샘플링==합니다.
배울 것이 많은 경험에 학습을 집중하는 효과 — 단, 샘플 분포가 왜곡되므로 중요도 샘플링(IS) 가중치로 보정해야 합니다.
**Noisy DQN**: ε-greedy 대신 ==가중치 자체에 학습 가능한 노이즈==를 넣어 탐험합니다.
탐험량을 네트워크가 상태별로 스스로 조절하고, 학습이 진행되면 노이즈가 자연히 줄어듭니다.
이들 + Double + Dueling + n-step + Distributional을 모두 결합한 것이 **Rainbow(2017)** — 각 부품의 기여를 절제(ablation)로 검증한 좋은 레퍼런스 논문입니다.`,
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
      difficulty: 2,
      importance: 5,
      objectives: [
        'Tensor, Autograd, nn.Module, Optimizer의 역할을 이해한다',
        'PyTorch 학습 루프의 5단계 정형 패턴을 몸에 익힌다',
      ],
      theory: [
        {
          h: 'PyTorch 핵심 4요소',
          p: `**Tensor**: GPU 연산이 가능한 다차원 배열 (NumPy와 API 유사, .to("cuda")로 이동).
**Autograd**: 연산 그래프를 동적으로 기록해 .backward() 한 번으로 모든 기울기 자동 계산.
**nn.Module**: 레이어와 파라미터를 묶는 모델의 기본 단위.
__init__에 레이어 정의, forward에 순전파 — parameters()가 학습 대상 전체를 옵티마이저에 넘겨줍니다.
**Optimizer**: 계산된 기울기로 파라미터 갱신 (SGD, Adam 등 — 강화학습 실무 기본값은 Adam).`,
        },
        {
          h: '배치 차원 감각 — RL 코드의 shape 읽기',
          fig: 'gather',
          p: `딥러닝 텐서의 첫 차원은 관례적으로 **배치**입니다.
오늘 코드에 나오는 shape을 미리 읽어 둡시다 (B=배치 크기, S=상태 차원, A=행동 수).
상태 배치: (B, S) → QNetwork 통과 → Q값: (B, A).
행동 배치: (B,) — 이걸로 "각 행에서 그 행동의 Q만" 뽑으려면 **gather**를 씁니다: q.gather(1, a.unsqueeze(1)).squeeze(1) → (B,).
==RL 구현 버그의 절반은 shape 불일치==입니다 — (B,)와 (B,1)을 빼면 브로드캐스팅으로 (B,B)가 되는 사고가 대표적.
헷갈리면 즉시 print(x.shape) — 부끄러운 일이 아니라 표준 디버깅입니다.`,
        },
        {
          h: 'Autograd 자세히 — no_grad와 detach',
          p: `PyTorch는 텐서 연산을 할 때마다 **계산 그래프**를 동적으로 기록하고, backward()가 그래프를 거꾸로 타며 연쇄법칙으로 기울기를 계산합니다.
RL에서 특히 중요한 두 도구:
**torch.no_grad()**: 블록 안 연산을 그래프에 기록하지 않음 — ==TD 목표 계산은 반드시 no_grad==로 (목표 쪽으로 기울기가 흐르면 학습이 왜곡).
**detach()**: 이미 만든 텐서를 그래프에서 분리 — A2C에서 어드밴티지를 Actor 손실에 쓸 때 detach하는 이유입니다.
zero_grad를 잊으면 기울기가 **누적**됩니다 — PyTorch가 기본을 누적으로 둔 것은 의도된 설계(그래디언트 누적 기법)지만, 우리 루프에서는 매번 초기화가 맞습니다.`,
        },
        {
          h: '학습 루프 5단계 — 모든 딥러닝의 공통 패턴',
          p: `① 순전파: pred = model(x)
② 손실 계산: loss = criterion(pred, y)
③ 기울기 초기화: optimizer.zero_grad()
④ 역전파: loss.backward()
⑤ 갱신: optimizer.step()
==오늘 오후의 DQN도, 3일차의 SAC도 이 5단계 위에서 손실 함수만 바뀝니다==.
차이가 있다면 지도학습의 y는 고정된 정답이지만, ==RL의 목표(target)는 우리가 매 스텝 직접 만들어내는 추정치==라는 점 — 그래서 목표를 "잘 만들고 잘 고정하는" 기술(타깃넷, no_grad)이 중요해집니다.`,
        },
        {
          h: '실무 팁 — 재현성과 디바이스',
          p: `**시드 고정**: torch.manual_seed + 환경 reset(seed=...) — RL은 분산이 커서 ==시드 하나 차이로 성공/실패가 갈릴 수 있으니== 비교 실험은 반드시 시드 여러 개 평균으로.
**디바이스**: 이번 과정 규모(작은 MLP)는 CPU가 오히려 빠를 수 있습니다 — GPU는 큰 배치·CNN에서 이득.
**item()과 numpy()**: 텐서를 로그로 찍거나 환경에 넘길 때는 스칼라는 item(), 배열은 detach().numpy() — 그래프를 끊지 않고 넘기면 메모리 누수의 원인이 됩니다.`,
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
      difficulty: 4,
      importance: 5,
      objectives: [
        'CartPole-v1에서 DQN 전체 파이프라인을 완성한다',
        '플래그 하나로 Double DQN으로 전환해 성능을 비교한다',
      ],
      theory: [
        {
          h: '실습 개요 — CartPole 환경 스펙',
          p: `CartPole-v1에서 DQN을 처음부터 끝까지 조립합니다.
환경 스펙: 상태 4차원(카트 위치·속도, 막대 각도·각속도), 행동 2개(좌/우로 밀기), 스텝마다 보상 +1.
막대가 12° 이상 기울거나 카트가 트랙을 벗어나면 종료 — ==500스텝을 버티면(리턴 500) 성공==이고, 평균 475 이상이 공식 "해결" 기준입니다.
**구성 요소**: QNetwork(오전 작성) + ReplayBuffer(1교시 작성) + ε 스케줄링 + 타깃 네트워크 동기화.
==DOUBLE=True로 바꾸면 목표 계산만 Double DQN으로 전환==됩니다.`,
        },
        {
          h: '구현 디테일 — 놓치기 쉬운 세 곳',
          p: `① **done 처리의 미묘함**: 버퍼에는 float(term)을 저장합니다 — ==term(진짜 종료)과 trunc(시간 초과)를 구분==해야 합니다.
시간 초과는 "상태가 나빠서 끝난 것"이 아니므로 미래 가치를 0으로 끊으면 안 됩니다 (CartPole 500스텝 도달이 벌점이 되는 버그).
② **학습 시작 시점**: 버퍼가 1000개 쌓인 뒤부터 train_step — 초기 몇 개 샘플로 과적합하는 것을 방지합니다.
③ **gather의 역할**: 네트워크는 모든 행동의 Q를 내놓지만 손실은 "실제 했던 행동의 Q"에만 걸어야 합니다 — 이 한 줄이 Q-Learning 업데이트의 신경망 버전입니다.
손실은 MSE 대신 **Huber(smooth_l1)** — 큰 TD 오차에 덜 민감해 초기 학습이 안정적입니다.`,
        },
        {
          h: '하이퍼파라미터 가이드',
          p: `**lr=1e-3**: 작은 MLP 기준 — 발산하면 가장 먼저 낮춰볼 값 (5e-4, 1e-4).
**ε 감쇠 0.995**: 에피소드당 0.5%씩 — 약 460 에피소드에 ε_min(0.05) 도달.
너무 빨리 줄이면 좋은 정책을 발견하기 전에 탐험이 꺼지고, 너무 느리면 수렴이 늦습니다.
**배치 64 / 버퍼 5만**: 이 규모 문제의 무난한 값 — 버퍼가 너무 작으면 상관관계 제거 효과가 약해집니다.
**타깃 동기화 20 에피소드**: 짧게(5) 하면 요동, 길게(100) 하면 학습 정체 — 직접 바꿔 보며 곡선을 비교해 보세요.`,
        },
        {
          h: '학습곡선 읽기와 흔한 증상',
          p: `정상 패턴: 수십 에피소드 정체(탐험 위주) → 급상승 → 500 근처 유지.
==DQN 곡선은 원래 요동이 큽니다== — 올라갔다 무너지는 구간(성능 붕괴)도 흔하니 한 번의 하락에 놀라지 마세요.
**증상별 처방**:
리턴이 계속 9~20 — ε이 안 줄었거나(감쇠 확인) 학습이 아예 안 도는 것(버퍼 임계 확인).
올라가다 반복 붕괴 — lr을 낮추거나 타깃 동기화 주기를 늘리기.
DOUBLE 켠 뒤 차이 없음 — CartPole은 쉬워서 차이가 작습니다 (프로젝트 #3 LunarLander에서 뚜렷해집니다).
확장 실험: 같은 시드로 DOUBLE True/False 곡선 비교, 타깃넷을 아예 끄면(매 스텝 복사) 어떻게 되는지 관찰.`,
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
      difficulty: 3,
      importance: 5,
      objectives: [
        '가치 기반과 정책 기반 접근의 차이를 이해한다',
        'REINFORCE 알고리즘과 로그-미분 트릭을 이해한다',
      ],
      theory: [
        {
          h: '정책을 직접 학습하기',
          p: `DQN은 Q를 배우고 정책은 argmax로 유도했습니다.
정책 기반 방법은 정책 자체를 신경망 π(a|s;θ)로 만들고 기대 리턴 J(θ) = E[G]를 직접 최대화합니다.
장점: ① 확률적 정책을 자연스럽게 표현(가위바위보처럼 섞는 게 최적인 문제) ② ==연속 행동 공간에 바로 적용 가능==(분포의 파라미터만 출력하면 됨) ③ 정책이 부드럽게 변해 수렴이 안정적(argmax는 Q가 조금만 변해도 행동이 확 바뀜).
단점: 그래디언트의 분산이 크고, on-policy라 샘플 효율이 낮습니다.
가치 기반과 정책 기반은 대립이 아니라 스펙트럼 — 다음 교시의 Actor-Critic이 둘을 결합합니다.`,
        },
        {
          h: '로그-미분 트릭 — 유도 따라가기',
          fig: 'pg-update',
          p: `문제: J(θ) = Σ_τ P(τ;θ) G(τ)를 미분하고 싶은데, 궤적 확률 P(τ;θ)에는 우리가 모르는 환경 전이 P(s'|s,a)가 들어 있습니다.
트릭: ∇P = P · ∇log P 항등식으로 바꿔 쓰면 ∇J = E_τ[ ∇log P(τ;θ) · G(τ) ] — ==기대값 형태라 샘플로 추정 가능==해집니다.
결정적 순간: log P(τ) = Σ log P(s'|s,a) + Σ log π(a|s;θ)에서 ==환경 항은 θ와 무관해 미분하면 사라집니다==.
결과: ∇J(θ) = E[ Σ_t ∇log π(a_t|s_t;θ) · G_t ] — **모델 없이(model-free)** 정책을 직접 미분할 수 있게 됐습니다.
**직관**: ==리턴이 좋았던 행동의 로그 확률은 올리고, 나빴던 행동은 내린다==.
지도학습과의 비교 — cross-entropy 손실에 "정답 대신 자기가 한 행동"을 넣고 "리턴으로 가중"한 것과 정확히 같은 모양입니다.`,
        },
        {
          h: 'REINFORCE와 분산 문제',
          p: `REINFORCE는 정책 경사를 MC 방식(에피소드 종료 후 실제 G_t 사용)으로 구현한 가장 기본 알고리즘입니다.
**인과성(causality) 개선**: 시점 t의 행동은 t 이후의 보상에만 책임이 있습니다 — 전체 리턴 대신 ==reward-to-go(t부터의 리턴)==를 곱하면 기대값은 같고 분산만 줄어듭니다.
그래도 분산은 큽니다 — G_t 하나에 에피소드 전체의 무작위성이 들어 있고, 좋은 에피소드의 "모든" 행동이 칭찬받는(나쁜 행동 포함) 조잡한 신용 할당이기 때문입니다.
1일차 MC의 한계가 정책 경사에서 그대로 재현되는 것 — 해법도 같은 방향(TD로!)입니다.`,
        },
        {
          h: '베이스라인 — 분산 줄이기',
          p: `∇J(θ) = E[ ∇log π(a|s;θ) · (G_t − b(s)) ]
상태에만 의존하는 베이스라인 b(s)를 빼도 ==기대값은 불변==(E[∇logπ · b(s)] = 0 — 확률의 합이 1이라 미분하면 0)이지만 ==분산은 크게 줄어듭니다==.
직관: "절대 점수"가 아니라 "평균 대비 얼마나 잘했나"로 채점하면, 모든 행동이 칭찬받는 인플레이션이 사라집니다.
b(s) = V(s)를 쓰면 (G_t − V(s))는 **어드밴티지** — 다음 교시 Actor-Critic의 핵심 아이디어입니다.
실습 코드의 "리턴 정규화(평균 빼고 표준편차 나누기)"는 배치 통계를 베이스라인처럼 쓰는 간이 기법입니다.
더 발전된 계보: 분산-편향을 조절하는 GAE, 업데이트 폭을 제한하는 TRPO/**PPO**(현재 RLHF의 표준)로 이어집니다.`,
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
      difficulty: 3,
      importance: 5,
      objectives: [
        'Actor(정책)와 Critic(가치)의 역할 분담을 이해한다',
        '어드밴티지 함수와 A2C의 구조를 설명할 수 있다',
      ],
      theory: [
        {
          h: 'REINFORCE의 한계와 Critic의 등장',
          fig: 'actor-critic',
          p: `REINFORCE는 에피소드가 끝나야 학습할 수 있고 G_t의 분산이 큽니다.
해법: 가치함수를 학습하는 두 번째 네트워크 Critic을 도입해, MC 리턴 대신 TD 부트스트래핑으로 매 스텝 학습합니다.
**Actor**: 정책 π(a|s;θ) — 행동을 결정.
**Critic**: 가치 V(s;w) — 행동이 얼마나 좋았는지 평가.
==1일차의 "MC → TD" 전환을 정책 경사에 그대로 적용==한 것입니다.
역할 분담의 묘: Critic은 "예측"만 하면 되니 배우기 쉽고(회귀 문제), Actor는 Critic이 준 저분산 신호로 편하게 배웁니다.
대가는 1일차와 같습니다 — Critic이 부정확한 초기에 편향이 생깁니다 (bias-variance 트레이드오프의 재등장).`,
        },
        {
          h: '어드밴티지와 A2C 손실 구성',
          p: `어드밴티지 A(s,a) = Q(s,a) − V(s)는 "이 행동이 그 상태의 평균보다 얼마나 좋은가"입니다.
실전에서는 ==TD 오차 δ = r + γV(s') − V(s)가 어드밴티지의 불편추정치==이므로 Critic 하나로 충분합니다 (Q 네트워크 별도 불필요).
Actor 손실:  −log π(a|s) · δ  (δ는 상수 취급, **detach 필수** — Critic 신호가 Actor 기울기로 역류하면 안 됨)
Critic 손실: δ²  (MSE — V를 TD 목표에 회귀)
**엔트로피 보너스**: −c·H(π)를 손실에 더해(즉 엔트로피를 높이는 방향으로) ==정책이 조기에 결정적으로 굳는 것을 방지==합니다.
계수 c(보통 0.01)를 키우면 탐험적, 0이면 조기 수렴 위험 — 프로젝트 #4에서 직접 실험합니다.
이 항이 3일차 최대 엔트로피 RL(SAC)의 예고편입니다 — SAC는 보너스가 아니라 목적함수 자체에 엔트로피를 넣습니다.`,
        },
        {
          h: '네트워크 구조와 A2C/A3C 계보',
          p: `실습 구조는 ==몸통(특징 추출)을 공유하고 머리만 둘==(정책 로짓, V) — 표현을 공유해 효율적이지만, 두 손실의 스케일 균형(0.5 계수)이 필요해집니다.
문제가 크면 Actor/Critic을 아예 분리하기도 합니다 (3일차 DDPG·SAC는 분리형).
**A3C(2016)**: 여러 워커가 각자 환경을 굴리며 비동기로 공유 파라미터를 갱신 — 재현 버퍼 없이 상관관계를 "병렬 수집"으로 깬 on-policy의 해법.
**A2C**: A3C의 동기(synchronous) 버전 — 워커들을 배치로 묶어 GPU 효율이 좋고, 오늘 실습은 단일 환경 + n-step 버전입니다.
어드밴티지 추정을 정교화한 **GAE(λ)** — 1일차 TD(λ)의 어드밴티지 버전 — 가 PPO 등 현대 알고리즘의 표준 부품입니다.`,
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
      difficulty: 4,
      importance: 4,
      objectives: [
        'CartPole-v1에서 n-step A2C를 완성한다',
        'DQN·REINFORCE와 학습 속도·안정성을 비교한다',
      ],
      theory: [
        {
          h: '실습 개요',
          p: `앞 교시의 ActorCritic 네트워크로 전체 학습 루프를 완성합니다.
n-step(여기서는 5스텝) 롤아웃마다 업데이트해 ==REINFORCE보다 빠르게, DQN보다 부드럽게 학습==되는 것을 확인합니다.
구조는 "5스텝 수집 → n-step 리턴으로 목표 계산 → 손실 3종 결합 → 갱신"의 반복 — 에피소드 경계와 무관하게 진행되는 것이 REINFORCE와의 큰 차이입니다.`,
        },
        {
          h: '핵심 디테일 — n-step 목표 계산',
          fig: 'nstep',
          p: `롤아웃 마지막 상태의 가치 v_last로 **부트스트랩**하고, 뒤에서부터 R = r + γR(1−done)으로 누적합니다.
==done 마스크 (1−d)가 에피소드 경계에서 미래 가치를 끊는== 역할 — 이게 빠지면 "이전 에피소드의 가치가 다음 에피소드로 새는" 대표 버그가 됩니다.
v_last 계산은 no_grad로 (목표는 상수), advantages는 Actor 손실에서 detach로 (Critic 신호 역류 금지).
n의 의미는 1일차 n-step TD 그대로 — n을 키우면 MC 쪽(저편향·고분산), 줄이면 TD 쪽 — 프로젝트 #4에서 n=1/5/20을 직접 비교합니다.`,
        },
        {
          h: '하이퍼파라미터와 학습곡선',
          p: `**lr=7e-4**: A2C 관례값 — Actor·Critic이 한 옵티마이저를 쓰므로 DQN보다 민감합니다.
**gradient clipping 0.5**: 정책 경사는 이따금 큰 기울기가 튀므로 ==클리핑이 사실상 필수== — 빼고 돌려보면 손실 스파이크를 볼 수 있습니다.
**손실 계수**: critic 0.5, entropy 0.01 — 엔트로피를 0으로 두면 조기 수렴, 0.1로 키우면 수렴이 느려지는 것을 관찰해 보세요.
정상 곡선: DQN보다 완만하고 부드럽게 상승 — ==on-policy라 과거 데이터를 못 쓰니 절대 속도는 느릴 수 있지만 궤적이 안정적==입니다.
2일차 마무리 정리: 가치 기반(DQN 계열)과 정책 기반(PG→A2C)의 두 축을 모두 구현했습니다 — 3일차는 이 둘을 연속 행동 공간에서 결합합니다(DDPG = Actor-Critic + DQN 기법).`,
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
