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
지도학습처럼 "정답 레이블"이 주어지지 않고, 비지도학습처럼 구조만 찾는 것도 아닙니다.
행동의 결과로 주어지는 **평가적(evaluative) 피드백**만으로 학습한다는 점이 핵심입니다.
평가적 피드백은 "그 행동이 얼마나 좋았는지"만 알려줄 뿐, "무엇이 정답이었는지"는 알려주지 않습니다.
알파고, 로봇 제어, 게임 AI, 추천 시스템, 데이터센터 냉각 최적화, 최근에는 LLM의 RLHF까지 — 순차적 의사결정이 필요한 곳이라면 어디든 적용됩니다.`,
        },
        {
          h: '스케이트장의 두 아이 — 강사의 어린 시절 이야기',
          fig: 'skate',
          p: `어릴 적 아버지께 남동생과 함께 스케이트를 배웠습니다.
저는 ==아버지 손을 꼭 잡고 정석대로== 배웠습니다 — 넘어지기 전에 잡아주시고, 자세가 틀리면 그 자리에서 교정받는, 말하자면 **지도학습**이었지요.
남동생은 달랐습니다.
손을 뿌리치고 혼자 내달리다 ==수없이 엎어지고 넘어지며== 배웠습니다 — 넘어짐이라는 벌점과 미끄러져 나아가는 시원함이라는 보상, 그 **평가적 피드백만으로** 스스로 균형을 찾아간 것입니다.
그런데 얼마 지나지 않아, 남동생이 저보다 훨씬 잘 타고 다녔습니다.
정답을 전달받은 지식은 정답의 범위에서 멈추지만, ==시행착오로 스스로 발견한 전략은 몸에 새겨지고 더 멀리 갑니다== — 강화학습이 정확히 이 방식입니다.
흔히 자전거 배우기로도 같은 설명을 합니다 — 누구도 "핸들을 왼쪽으로 3도 꺾어라"라고 가르쳐주지 않지만, 넘어짐과 나아감의 반복만으로 어느새 균형이 몸에 들어오지요.
3일 내내 이 장면을 기억해 두세요 — ==우리가 만들 에이전트는 모두 "남동생처럼" 배웁니다==.`,
        },
        {
          h: '세 가지 기계학습 패러다임 비교',
          p: `**지도학습**: (입력, 정답) 쌍으로 학습.
피드백이 즉각적이고 지시적(instructive) — "이 사진은 고양이다".
**비지도학습**: 정답 없이 데이터의 구조(군집, 분포)를 발견.
**강화학습**: 피드백이 ==평가적이고, 지연되며, 순차적==입니다.
지금 받은 보상이 10분 전 행동 때문일 수 있고(지연), 지금의 행동이 미래에 만날 상태 분포 자체를 바꿉니다(순차성).
또 하나의 결정적 차이 — **데이터를 에이전트가 스스로 만든다**는 점입니다.
정책이 바뀌면 수집되는 데이터의 분포도 바뀌므로, i.i.d. 데이터를 가정하는 일반 딥러닝과 근본적으로 다른 어려움이 생깁니다 (2일차 DQN에서 이 문제를 정면으로 다룹니다).`,
        },
        {
          h: '에이전트-환경 루프와 기본 용어',
          fig: 'agent-env',
          p: `매 시점 t마다 다음 과정이 반복됩니다.
① 에이전트가 상태 s_t를 관측한다
② 정책 π에 따라 행동 a_t를 선택한다
③ 환경이 보상 r_{t+1}과 다음 상태 s_{t+1}을 돌려준다
목표는 미래 보상의 (할인된) 총합, 즉 **리턴 G_t** = r_{t+1} + γr_{t+2} + γ²r_{t+3} + ... 을 최대화하는 정책을 찾는 것입니다.
용어를 정리해 둡시다.
**에피소드(episode)**: 시작 상태부터 종료 상태까지의 한 판 (게임 한 판, 미로 한 번 탈출).
**궤적(trajectory)**: 에피소드 동안 지나온 (s, a, r) 시퀀스 — τ = (s0, a0, r1, s1, a1, r2, ...).
**정책(policy)**: 상태를 행동으로 매핑하는 함수 — 이것이 강화학습이 최종적으로 얻고자 하는 산출물입니다.`,
        },
        {
          h: '왜 어려운가 — 신용 할당 문제',
          p: `바둑에서 200수 만에 이겼을 때, 승리에 결정적이었던 수는 몇 번째였을까요?
==지연된 보상을 과거의 어느 행동에 귀속시킬 것인가==를 **신용 할당 문제(credit assignment problem)**라고 부릅니다.
강화학습 알고리즘의 역사는 이 문제를 푸는 도구의 발전사입니다.
할인율 γ로 시간적 거리를 반영하고(오늘 오전), 가치함수로 "그 상태가 장기적으로 얼마나 좋은지"를 압축하고(2~3교시), TD 오차로 신용을 한 스텝씩 전파합니다(5교시).
이 관점을 잡고 있으면 3일간 배우는 모든 알고리즘이 하나의 이야기로 연결됩니다.`,
        },
        {
          h: '탐험 vs 활용',
          fig: 'bandit-eps',
          p: `지금까지 알아낸 최선의 행동만 반복하면(활용) 더 좋은 행동을 영영 발견하지 못할 수 있고, 새로운 행동만 시도하면(탐험) 보상을 낭비합니다.
가장 단순한 해법이 **ε-greedy**: 확률 ε로는 무작위 행동(탐험), 1-ε로는 현재 최선의 행동(활용)을 선택합니다.
실전에서는 ==ε을 크게 시작해 점점 줄이는 감쇠(decay) 스케줄==을 흔히 씁니다 — 초반엔 넓게 탐험하고, 학습이 진행되면 활용 위주로.
더 정교한 전략도 있습니다.
**UCB(Upper Confidence Bound)**: 시도 횟수가 적은 행동에 보너스를 줘 "불확실한 것을 우선 탐험".
**볼츠만(softmax) 탐험**: Q값에 비례하는 확률로 행동을 뽑아, 나쁜 행동일수록 덜 시도.
이 딜레마는 3일 내내 반복해서 등장하고, 3일차 최대 엔트로피 RL은 아예 탐험을 목적함수 안에 넣어버리는 접근입니다.`,
        },
        {
          h: '강화학습의 역사 한눈에',
          p: `1950s **벨만** — 동적계획법과 벨만 방정식 (오늘 오전의 뿌리).
1988 **서튼의 TD 학습**, 1989 **왓킨스의 Q-Learning** — 표 기반 시대의 완성 (오늘 오후).
1992 TD-Gammon — 신경망 + TD로 백개먼 세계 최상위.
2013~2015 **DQN** — 딥러닝 결합으로 아타리 정복 (2일차).
2016 알파고, 2017 알파제로 — 자기대국 강화학습.
2018 **SAC** 등 연속 제어 알고리즘 성숙 (3일차).
2022~ **RLHF** — ChatGPT를 만든 사람 피드백 기반 강화학습.
이번 과정은 이 계보를 3일에 압축해서 따라 올라갑니다.`,
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
          p: `강화학습 문제를 수학적으로 정의하는 틀이 MDP입니다.
5개 요소로 구성됩니다.
· S: 상태 집합 · A: 행동 집합 · P(s'|s,a): 상태 전이 확률 · R(s,a): 보상 함수 · γ: 할인율 (0~1)
P(s'|s,a)는 "상태 s에서 행동 a를 했을 때 s'로 갈 확률"을 뜻하는 조건부 확률 표기입니다.
전이가 확률적이라는 점이 중요합니다 — 같은 상태에서 같은 행동을 해도 결과가 다를 수 있습니다 (로봇 바퀴의 미끄러짐, 상대의 응수).
핵심 가정은 **마르코프 성질** — =="미래는 현재 상태에만 의존하고 과거 경로와는 무관하다"==입니다.
체스에서 지금 기물 배치만 알면 과거 수순은 몰라도 되는 것과 같습니다.`,
        },
        {
          h: '상태 설계가 마르코프 성질을 만든다',
          p: `마르코프 성질은 자연법칙이 아니라 ==상태를 어떻게 정의하느냐에 달린 설계 문제==입니다.
공의 "위치"만 상태로 쓰면 다음 위치를 예측할 수 없지만(어디로 움직이는 중인지 모름), "위치+속도"를 상태로 쓰면 마르코프해집니다.
아타리 게임에서 DQN이 프레임 1장이 아니라 **최근 4프레임을 쌓아서** 상태로 쓰는 것도 같은 이유입니다.
상태가 환경의 전부를 담지 못하는 경우(포커에서 상대의 패)는 **부분 관측 MDP(POMDP)**라고 부르며, 별도의 기법(순환 신경망, 믿음 상태)이 필요합니다.
이번 과정의 환경들은 모두 완전 관측 MDP입니다.`,
        },
        {
          h: '리턴과 할인율 γ',
          fig: 'gamma',
          p: `리턴 G_t = r_{t+1} + γr_{t+2} + γ²r_{t+3} + ... — 미래 보상의 할인 합입니다.
할인율 γ를 두는 이유는 세 가지입니다.
① 수학적: 무한 에피소드에서도 합이 유한하게 수렴 (γ<1이면 등비급수).
② 경제적: 지금의 보상이 미래의 같은 보상보다 가치 있다 (이자율과 같은 직관).
③ 불확실성: 먼 미래 예측일수록 믿음을 줄인다.
γ는 사실상 ==에이전트의 시야(horizon)를 정하는 하이퍼파라미터==입니다.
γ=0.9면 유효 시야가 약 10스텝(1/(1-γ)), γ=0.99면 약 100스텝.
γ가 너무 작으면 근시안적 정책이, 너무 크면 학습이 느리고 불안정해집니다 — 실무 기본값은 0.99입니다.`,
        },
        {
          h: '정책 — 강화학습의 최종 산출물',
          p: `**결정적 정책** a = π(s): 상태마다 행동 하나를 확정 (3일차 DDPG가 이 형태).
**확률적 정책** π(a|s): 상태마다 행동의 확률분포 (2일차 Policy Gradient, 3일차 SAC).
확률적 정책은 탐험을 자연스럽게 내장하고, 가위바위보처럼 ==섞어 내는 것 자체가 최적인 문제==도 표현할 수 있습니다.
오늘 다루는 표 기반 방법에서는 "Q 테이블에서 argmax를 취하는 greedy 정책 + ε 탐험"이 사실상의 정책입니다.`,
        },
        {
          h: '가치함수 — V와 Q',
          p: `**상태가치함수 V^π(s)** = 상태 s에서 정책 π를 따랐을 때 기대 리턴 E[G_t | s_t=s].
**행동가치함수 Q^π(s,a)** = 상태 s에서 행동 a를 먼저 하고 이후 π를 따랐을 때 기대 리턴.
둘의 관계: V^π(s) = Σ_a π(a|s) Q^π(s,a) — ==V는 그 상태에서 가능한 Q들의 정책 가중 평균==입니다.
반대로 Q^π(s,a) = Σ_s' P(s'|s,a)[R + γV^π(s')]로도 씁니다.
왜 Q가 중요한가 — V만 알면 "어느 행동이 좋은지" 고르는 데 모델 P가 필요하지만, ==Q를 알면 argmax_a Q(s,a)만으로 모델 없이 행동을 고를 수 있습니다==.
이것이 뒤에 배울 Q-Learning과 DQN의 출발점입니다.`,
        },
        {
          h: '벨만 방정식',
          fig: 'backup',
          p: `가치함수는 재귀 구조를 가집니다.
V^π(s) = Σ_a π(a|s) Σ_s' P(s'|s,a) [ R + γ V^π(s') ]
=="지금 상태의 가치 = 즉시 보상 + 할인된 다음 상태의 가치"==라는 이 한 줄이 강화학습 전체를 관통합니다.
유도는 간단합니다 — 리턴의 정의에서 G_t = r_{t+1} + γG_{t+1}로 한 스텝을 떼어내고 기대값을 취하면 끝입니다.
최적 가치함수에 대한 **벨만 최적 방정식**은 V*(s) = max_a Σ_s' P(s'|s,a)[R + γV*(s')] — 기대 대신 max가 들어갑니다.
중요한 사실: 유한 MDP에서 벨만 최적 방정식의 해 V*는 유일하게 존재하고, 모든 상태에서 동시에 최적인 정책 π*가 최소 하나 존재합니다.
"해가 반드시 있다"는 이 보장이 있기에, 3교시부터는 그 해를 **어떻게 찾을 것인가**만 고민하면 됩니다.`,
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
          h: '동적계획법과 강화학습 — Planning vs Learning',
          p: `환경 모델 P(s'|s,a)와 R을 완전히 알고 있을 때, 벨만 방정식을 반복 적용해 최적 정책을 구하는 방법이 동적계획법(DP)입니다.
모델을 알고 계산만 하는 것을 **계획(planning)**, 모델 없이 경험으로 배우는 것을 **학습(learning)**이라 구분합니다 — DP는 계획, 오후의 MC/TD부터가 학습입니다.
현실 문제에서는 모델을 모르는 경우가 대부분이지만, ==DP는 모든 강화학습 알고리즘의 이론적 원형==이므로 반드시 짚고 넘어가야 합니다.
실제로 오후에 배울 모든 업데이트 식은 "DP의 기대값 계산을 샘플로 대체한 것"으로 읽을 수 있습니다.`,
        },
        {
          h: '왜 반복하면 수렴하는가 — 벨만 연산자',
          p: `벨만 기대 방정식의 우변을 "현재 V를 받아 새 V를 내놓는 함수"로 보면, 이것이 **벨만 연산자 T**입니다.
정책 평가는 V ← T(V)를 반복하는 것이고, 참값 V^π는 T의 **고정점**(T(V^π) = V^π)입니다.
핵심 성질: T는 ==γ-축약(contraction) 사상==입니다 — 어떤 두 추정치든 T를 한 번 적용하면 서로의 거리가 γ배 이하로 줄어듭니다.
바나흐 고정점 정리에 의해, ==아무 값에서 시작해도 유일한 고정점으로 기하급수적으로 수렴==합니다.
오차가 매 반복 γ배로 줄므로 γ=0.9면 반복당 오차 10% 감소 — "왜 while 루프가 반드시 끝나는가"에 대한 수학적 답입니다.
벨만 최적 연산자(max 버전)도 같은 성질을 가지므로 가치 반복의 수렴도 같은 논리로 보장됩니다.`,
        },
        {
          h: '정책 평가 (Policy Evaluation)',
          p: `주어진 정책 π의 V^π를 구하는 문제입니다.
벨만 기대 방정식은 사실 |S|개의 미지수를 가진 |S|개의 선형 연립방정식이라 역행렬로 한 번에 풀 수도 있습니다 (계산량 O(|S|³)).
하지만 상태가 많으면 비싸므로, 실전에서는 ==반복 적용(iterative policy evaluation)==으로 근사합니다.
수렴 판정은 "한 번의 스윕에서 가장 크게 변한 상태의 변화량 Δ가 임계값 θ보다 작아지면 멈춤" — 오늘 실습 코드의 delta < theta가 바로 이것입니다.`,
        },
        {
          h: '정책 개선 정리 (Policy Improvement Theorem)',
          p: `계산된 V^π로 각 상태에서 greedy 행동을 취하는 새 정책 π'를 만들면, ==π'는 모든 상태에서 π보다 같거나 좋다==는 것이 정책 개선 정리입니다.
증명의 직관: 어떤 상태에서 Q^π(s, π'(s)) ≥ V^π(s)라면(greedy 선택이니 당연히 성립), "첫 걸음만 π'로 걷고 이후 π를 따르는 것"이 이미 π보다 낫습니다.
이 논리를 두 번째, 세 번째 걸음에 반복 적용하면 "끝까지 π'를 따르는 것"이 낫다는 결론에 도달합니다.
더 이상 개선되지 않는 순간 벨만 최적 방정식을 만족하므로 — ==그 정책이 바로 최적 정책==입니다.`,
        },
        {
          h: '일반화된 정책 반복 (GPI)',
          fig: 'gpi',
          p: `평가(정책에 맞게 가치를 갱신)와 개선(가치에 맞게 정책을 갱신)을 번갈아 수행하는 큰 그림을 **일반화된 정책 반복(GPI)**이라 부릅니다.
두 과정은 서로를 향해 움직이는 경쟁이자 협력 관계 — 평가는 정책을 쫓아가고, 개선은 가치를 앞서갑니다.
==거의 모든 강화학습 알고리즘이 GPI의 사례==입니다.
Q-Learning도, 3일차의 SAC도 "평가를 얼마나 대충 하고 개선하느냐"의 정도만 다를 뿐 같은 구조입니다.
이 틀을 잡아 두면 새 알고리즘을 만나도 "평가는 무엇으로? 개선은 무엇으로?"라는 두 질문으로 해부할 수 있습니다.`,
        },
        {
          h: '정책 반복 vs 가치 반복, 그리고 한계',
          p: `**정책 반복(PI)**: 평가를 완전히 수렴시킨 뒤 개선.
정책 갱신 횟수는 적지만(GridWorld는 보통 2~4회) 한 번의 평가가 무겁습니다.
**가치 반복(VI)**: 평가를 1스텝만 하고 바로 max를 취해 개선을 겸합니다.
V(s) ← max_a Σ P[R + γV(s')] — 구현이 간단하고 실전에서 많이 쓰입니다.
절충안으로 평가를 k번만 하는 수정 정책 반복, 스윕 순서를 자유롭게 하는 **비동기(asynchronous) DP**도 있습니다.
공통 한계: 계산량이 상태 수에 비례해 폭발합니다 — 바둑 10^170, 체스 10^47 상태는 테이블 자체가 불가능.
이 =="차원의 저주"==가 함수 근사(딥러닝)를 도입하는 2일차의 출발 동기입니다.`,
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
**구현 포인트**: ① 평가→개선 루프의 종료 조건(정책이 더 이상 바뀌지 않을 때) ② VI에서 max 연산이 평가와 개선을 동시에 수행한다는 점 ③ ==두 방법이 같은 최적 정책에 도달하는지 확인==.
핵심 헬퍼는 q_from_v — "V가 있을 때 상태 s의 각 행동 Q값"을 계산하는 함수로, 평가·개선·정책 추출에 모두 재사용됩니다.`,
        },
        {
          h: '구현 디테일 — 스윕 방식과 수렴 판정',
          p: `**동기(two-array) 스윕**: 이전 V를 복사해 두고 새 배열에 쓰기 — 교과서의 정의 그대로.
**비동기(in-place) 스윕**: 배열 하나로 갱신하며 이미 갱신된 이웃 값을 바로 사용 — 이번 실습 PI 코드가 이 방식입니다.
==in-place가 보통 더 빨리 수렴==하며(새 정보가 즉시 전파), 수렴 보장도 유지됩니다.
수렴 판정 θ는 1e-6처럼 작게 — 너무 크면 덜 수렴한 V로 greedy를 취해 잘못된 정책이 나올 수 있습니다.
γ=1.0을 쓸 수 있는 이유: 이 GridWorld는 모든 정책이 유한 스텝 안에 종료하는 **에피소딕 문제**이기 때문입니다 (지속 문제라면 반드시 γ<1).`,
        },
        {
          h: '디버깅 체크리스트',
          p: `구현이 이상할 때 순서대로 점검하세요.
① **종료 상태 처리** — TERMINALS의 V는 0으로 고정했는가 (건드리면 가치가 무한히 새어나감).
② **보상 부호와 시점** — R은 전이할 때 받는가, 도착해서 받는가를 코드와 수식이 일치시켰는가.
③ **argmax 동률** — 같은 Q값이 여러 개면 np.argmax는 첫 번째를 고름 — PI/VI의 정책이 달라 보여도 ==가치함수가 일치하면 정상==입니다 (최적 정책은 유일하지 않을 수 있음).
④ **delta 초기화 위치** — 스윕마다 0으로 리셋해야 함 (한 번만 초기화하면 영원히 안 끝남).`,
        },
        {
          h: '확장 실험 (여유가 있다면)',
          p: `① γ를 1.0 → 0.9 → 0.5로 낮춰 보세요 — ==먼 목표의 영향이 줄어 가치 지형이 평평해지는 것==을 관찰할 수 있습니다.
② step 함수에 "의도대로 안 움직일 확률 20%"를 넣어 확률 전이로 바꿔 보세요 — P[s][a]가 (다음상태, 보상) 목록이 되고, 기대값 계산이 진짜 Σ가 됩니다.
③ PI의 정책 갱신 횟수와 VI의 스윕 횟수를 세어 비교해 보세요 — "PI는 겉 루프가 짧고 VI는 한 바퀴가 싸다"를 수치로 확인합니다.`,
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
          p: `DP는 전이확률 P를 알아야 합니다.
현실에선 모르는 경우가 대부분이므로, 실제로 행동해 보고 얻은 경험 샘플로 가치를 추정해야 합니다.
대표적인 두 방법이 **몬테카를로(MC)**와 **시간차(TD) 학습**입니다.
관점 전환의 핵심: DP의 기대값 Σ P(s'|s,a)[...]를 ==실제로 겪은 샘플 하나로 대체==하는 것입니다.
기대값 자리에 샘플을 넣으면 평균적으로는 맞는(불편) 추정이 되고, 여러 번 반복하면 대수의 법칙으로 참값에 다가갑니다.`,
        },
        {
          h: '몬테카를로(MC) 방법',
          p: `에피소드가 끝난 뒤 실제로 받은 리턴 G_t의 평균으로 가치를 추정합니다.
V(s_t) ← V(s_t) + α [ G_t − V(s_t) ]
이 식은 "지금까지 평균에 새 샘플을 α만큼 섞는" **증분 평균**입니다 — α=1/N이면 정확한 표본평균, 고정 α면 최근 샘플에 가중을 두는 이동평균이 됩니다.
한 에피소드에서 같은 상태를 여러 번 방문하면 — 첫 방문만 세는 **first-visit MC**와 매번 세는 **every-visit MC**로 나뉘며, 둘 다 참값에 수렴합니다 (실습은 first-visit).
실제 리턴을 쓰므로 ==편향(bias)이 없지만==, 에피소드 전체의 무작위성(수십 스텝의 확률적 전이·행동)이 G_t 하나에 다 들어가므로 ==분산(variance)이 큽니다==.
그리고 반드시 에피소드가 끝나야 학습할 수 있습니다 — 끝나지 않는 지속 과제에는 적용 불가.`,
        },
        {
          h: '시간차(TD) 학습',
          p: `한 스텝만 진행하고 다음 상태의 "현재 추정치"로 목표를 만듭니다 (**부트스트래핑**).
V(s_t) ← V(s_t) + α [ r_{t+1} + γV(s_{t+1}) − V(s_t) ]
괄호 안을 **TD 오차(δ)**라고 부릅니다 — "예상보다 좋았다/나빴다"의 신호이며, 뇌의 도파민 반응과 닮았다는 신경과학 연구로도 유명합니다.
매 스텝 학습이 가능하고(온라인 학습) 분산이 작지만, 부정확한 추정치로 추정치를 갱신하므로 편향이 생깁니다.
이 ==bias-variance 트레이드오프==가 MC vs TD 선택의 핵심입니다.`,
        },
        {
          h: '같은 데이터, 다른 답 — 배치 관점의 차이',
          p: `미묘하지만 중요한 사실: 같은 경험 데이터를 반복 학습시켜도 ==MC와 TD는 서로 다른 값에 수렴==합니다.
MC는 "관측된 리턴들의 평균" — 훈련 데이터의 제곱오차를 최소화하는 답.
TD는 "데이터로 추정한 MDP 모델을 먼저 만들고 그 모델을 정확히 푼 답"(확실성 등가 추정)에 수렴합니다.
상태 간 관계(마르코프 구조)를 활용하는 쪽은 TD — 그래서 ==데이터가 적을 때 TD가 일반화에 유리==한 경우가 많습니다.
서튼의 교과서 예제(A→B 두 상태 문제)가 이 차이를 보여주는 고전적 사례입니다.`,
        },
        {
          h: 'MC와 TD 사이 — n-step과 TD(λ)',
          fig: 'mc-td',
          p: `MC와 TD는 양 극단이고, 사이에 스펙트럼이 있습니다.
**n-step TD**: 실제 보상을 n개 모은 뒤 그 다음은 추정치로 — n=1이면 TD(0), n=∞면 MC.
**TD(λ)**: 모든 n-step 리턴을 λ 가중으로 섞은 것 — 적격 흔적(eligibility trace)으로 효율적으로 구현합니다.
적절한 중간 n(4~10)이 양 극단보다 나은 경우가 많습니다.
이 아이디어는 2일차 A2C의 n-step 롤아웃으로 다시 등장합니다.`,
        },
        {
          h: '어느 것을 언제 쓰나',
          p: `에피소드가 짧고 보상이 끝에만 있는 문제(바둑 승패) — MC가 단순하고 확실합니다.
스텝이 길거나 끝나지 않는 문제, 온라인 학습이 필요한 문제 — TD.
함수 근사(신경망)와 결합할 때는 ==거의 항상 TD 계열==을 씁니다 — 2일차 DQN도, 3일차 SAC도 모두 TD 목표로 학습합니다.
단, TD+함수근사+off-policy 셋이 겹치면 발산 위험(deadly triad)이 생깁니다 — 2일차에 정면으로 다룹니다.`,
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
          p: `지금까지는 주어진 정책의 가치를 "예측"했습니다.
이제 최적 정책을 직접 "찾는" 제어(control) 문제로 넘어갑니다.
구조는 오전의 GPI 그대로 — 평가를 TD로, 개선을 ε-greedy로 바꾼 것뿐입니다.
모델이 없으므로 ==V 대신 Q(s,a)를 학습해야== greedy 정책을 만들 수 있습니다 (V만으로 행동을 고르려면 모델 P가 필요).
개선을 완전 greedy가 아닌 ε-greedy로 하는 이유 — 탐험을 멈추면 안 가본 (s,a)의 Q가 영영 갱신되지 않기 때문입니다.
이론적으로는 **GLIE 조건**(모든 상태-행동을 무한히 방문 + ε→0)이 최적 수렴의 전제입니다.`,
        },
        {
          h: 'SARSA — On-policy TD 제어',
          p: `Q(s,a) ← Q(s,a) + α [ r + γQ(s',a') − Q(s,a) ]
이름 그대로 (S, A, R, S', A') 5개를 사용합니다.
다음 행동 a'를 실제 행동하는 정책(ε-greedy)에서 뽑으므로, "행동하는 정책"과 "학습하는 정책"이 같은 ==on-policy 방법==입니다.
그 결과 SARSA가 배우는 것은 "ε만큼 실수하는 자기 자신의 가치" — ==탐험의 위험까지 Q값에 반영==되어 보수적인 경로를 학습합니다.
주의할 구현 포인트: a'는 "다음 스텝에 실제로 실행할 그 행동"이어야 합니다 — 업데이트용으로 따로 뽑으면 Expected SARSA도 SARSA도 아닌 것이 됩니다.`,
        },
        {
          h: 'Q-Learning — Off-policy TD 제어',
          p: `Q(s,a) ← Q(s,a) + α [ r + γ max_a' Q(s',a') − Q(s,a) ]
다음 상태에서 실제 취할 행동과 무관하게 max를 사용합니다.
행동은 ε-greedy로 하되 학습 목표는 greedy 정책 — 행동 정책과 목표 정책이 다른 ==off-policy 방법==입니다.
off-policy의 실용적 가치는 큽니다 — ==다른 정책이 만든 경험, 심지어 과거의 경험으로도 학습==할 수 있어, 2일차의 경험 재현 버퍼가 가능해집니다 (on-policy인 SARSA는 원칙적으로 불가).
**Q-Learning의 max 구조는 2일차 DQN으로 직결**됩니다.`,
        },
        {
          h: '수렴 조건과 학습률',
          p: `표 기반 Q-Learning은 다음 조건에서 최적 Q*로 수렴함이 증명되어 있습니다.
① 모든 (s,a) 쌍을 무한히 자주 방문 (탐험이 필요한 이유)
② 학습률이 **Robbins-Monro 조건**을 만족: Σα = ∞ 이면서 Σα² < ∞ (예: α_t = 1/t)
실무에서는 고정 α(0.1 등)를 쓰는데, 이 경우 한 점에 수렴하는 대신 참값 주변을 맴돕니다 — ==비정상(non-stationary) 문제에서는 오히려 고정 α가 낫습니다== (환경이 변하면 계속 적응해야 하므로).
γ는 문제의 정의(시야), α는 학습 속도, ε은 탐험량 — 세 하이퍼파라미터의 역할을 구분해 두세요.`,
        },
        {
          h: '변형: Expected SARSA와 최대화 편향 예고',
          p: `**Expected SARSA**: 다음 행동 샘플 대신 기대값 Σ_a' π(a'|s')Q(s',a')을 사용 — SARSA의 샘플 분산을 제거해 더 안정적이며, greedy 정책 기준으로 계산하면 Q-Learning과 일치합니다.
한편 Q-Learning의 max에는 함정이 있습니다 — 노이즈 낀 추정치들에 max를 취하면 ==운 좋게 과대평가된 값이 선택되는 최대화 편향(maximization bias)==이 생깁니다.
표 기반에서는 Double Q-Learning(테이블 2개로 선택과 평가 분리)이 해법이고, 이 아이디어가 2일차 **Double DQN**의 원형입니다.`,
        },
        {
          h: 'Cliff Walking으로 보는 두 알고리즘의 성격',
          p: `절벽을 따라 걷는 문제에서 — SARSA는 "탐험하다 떨어질 위험"까지 계산해 ==절벽에서 먼 안전한 길==을 배우고, Q-Learning은 greedy 기준의 가치를 배우므로 ==절벽에 붙은 최단 경로==를 배웁니다.
학습 중 평균 보상은 SARSA가 높지만(덜 떨어짐), 탐험을 끈 최종 greedy 정책은 Q-Learning 쪽이 최단입니다.
=="학습 중 성능"과 "최종 정책 성능"은 다른 지표==라는 것 — 다음 교시 실습에서 직접 확인합니다.`,
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
          h: '실습 개요 — CliffWalking 환경 스펙',
          fig: 'cliff',
          p: `Gymnasium의 CliffWalking-v0 환경에서 두 알고리즘을 학습시킵니다.
환경 스펙: 4×12 그리드(상태 48개), 행동 4개(상/우/하/좌), 시작은 좌하단·목표는 우하단.
보상은 스텝마다 -1, ==절벽(아래 줄 가운데 10칸)에 떨어지면 -100==을 받고 시작점으로 리셋됩니다.
최적(최단) 경로의 리턴은 -13 — 학습이 잘 되면 greedy 평가에서 이 근처가 나와야 합니다.
**관찰 포인트**: 학습 곡선에서 SARSA의 에피소드 보상이 더 높게(안전한 길) 나오고, Q-Learning은 탐험 중 절벽에 자주 떨어져 보상이 낮지만 ==최종 greedy 정책은 최단 경로==가 됩니다.`,
        },
        {
          h: '하이퍼파라미터 가이드',
          p: `**α(학습률) = 0.1**: 키우면 빨리 배우지만 Q값이 요동, 줄이면 안정적이지만 느림 — 표 기반에선 0.1~0.5가 무난합니다.
**ε(탐험률) = 0.1**: 이 실습에선 고정 — 두 알고리즘의 성격 차이를 보는 것이 목적이라 일부러 탐험을 유지합니다.
ε을 0.3으로 키우면 SARSA는 더 안전한 위쪽 길로, 격차가 더 벌어집니다 (직접 실험해 보세요).
**γ = 0.99**: 스텝 페널티 문제라 0.9~1.0 어느 값이든 최단 경로가 최적이지만, 습관적으로 0.99를 씁니다.
종료 처리 주의 — TD 목표에 (not done)을 곱해 ==종료 상태 이후의 가치를 0으로 끊는 것==이 표준 패턴입니다 (빠뜨리면 목표 도달의 의미가 사라짐).`,
        },
        {
          h: '학습곡선을 읽는 법',
          p: `에피소드 리턴은 노이즈가 크므로 ==이동평균(50~100 에피소드)으로 부드럽게== 그려서 봐야 추세가 보입니다.
초반: 둘 다 -100 근처(절벽에 자주 추락).
중반: SARSA 곡선이 위로 분리 — 안전 경로를 먼저 확보.
후반: 둘 다 평평해지지만 Q-Learning은 ε 탐험 때문에 이따금 -100대 스파이크가 계속 남습니다.
=="곡선의 평균 높이"는 행동 정책의 성능, "greedy 평가"는 학습된 목표 정책의 성능== — 두 지표를 분리해서 보고하는 습관을 들이세요.`,
        },
        {
          h: '자주 나는 버그 체크리스트',
          p: `① a_next를 뽑기만 하고 다음 루프에서 안 쓰는 경우 — SARSA가 이상해집니다 (s, a = s_next, a_next 갱신 확인).
② target 계산에서 (not done) 누락 — 학습이 되다 마는 대표 원인.
③ Q-Learning 분기에서 a_next를 target 계산 "전에" 뽑으면 — 동작엔 문제없지만 SARSA와 대칭이 안 맞아 비교가 흐려집니다.
④ 평가할 때 ε을 0으로 안 바꾸는 경우 — greedy 정책 성능이 아니라 행동 정책 성능을 재게 됩니다.
확장 실험: ε 감쇠(0.9995)를 넣으면 Q-Learning의 학습 곡선도 종반엔 SARSA를 따라잡습니다 — GLIE의 취지를 눈으로 확인할 수 있습니다.`,
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
