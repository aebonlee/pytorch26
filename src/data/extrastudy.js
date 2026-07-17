// ============================================================
// 심화학습 데이터 (마지막 날 마무리 + 교육 후 자습 로드맵)
// ------------------------------------------------------------
// challenges: 난이도 순 도전과제 4개 — desc의 \n은 pre-line 렌더링
// resources : 추천 자료 12종 — kind(교재/강의·코드·도구·논문)별 뱃지
// 수업 중 소개한 자료를 추가하려면 여기에 항목만 추가하면 된다.
// ============================================================
export const challenges = [
  {
    level: 'LEVEL 1',
    title: 'LunarLander-v3 착륙시키기',
    desc: `2일차 DQN 코드를 LunarLander-v3(상태 8차원, 행동 4개)에 적용해 보세요.
힌트: 네트워크 크기와 학습률만 조정하면 됩니다. 평균 리턴 200 이상이면 성공.
심화: Double DQN, Dueling 구조를 추가하며 성능 변화를 기록해 보세요.`,
  },
  {
    level: 'LEVEL 2',
    title: 'SAC로 연속 제어 벤치마크 정복',
    desc: `3일차 SAC 코드를 MuJoCo 환경(HalfCheetah-v5, Hopper-v5)에 적용해 보세요.
pip install "gymnasium[mujoco]" 로 설치할 수 있습니다.
심화: TAC의 q 값을 1.0 / 1.5 / 2.0으로 바꿔 학습 곡선을 겹쳐 그려 보세요 — 고차원 행동 공간에서 q>1의 효과가 Pendulum보다 뚜렷하게 나타납니다.`,
  },
  {
    level: 'LEVEL 3',
    title: 'Unity ML-Agents로 나만의 환경 제작',
    desc: `Unity ML-Agents 툴킷으로 직접 강화학습 환경을 만들고, 파이썬 API로 연결해 이번 과정에서 구현한 SAC 에이전트를 학습시켜 보세요.
공식 예제 환경(3DBall)에서 시작해 커스텀 환경으로 확장하는 것을 추천합니다.`,
  },
  {
    level: 'LEVEL 4',
    title: 'Sparse Reward 문제에 도전 — Curiosity 탐험',
    desc: `MountainCar-v0은 정상에 도달하기 전까지 보상이 전혀 없는 대표적 sparse reward 환경입니다.
기본 DQN이 왜 실패하는지 확인한 뒤, ICM(Intrinsic Curiosity Module)의 아이디어 — 예측 오차를 내적 보상으로 사용 — 를 간단히 구현해 비교해 보세요.`,
  },
]

export const resources = [
  {
    kind: '교재/강의',
    title: 'OpenAI Spinning Up in Deep RL',
    desc: '심층강화학습 입문의 표준 — 이론 정리와 검증된 구현체(VPG~SAC)를 함께 제공',
    url: 'https://spinningup.openai.com/',
  },
  {
    kind: '교재/강의',
    title: 'Sutton & Barto, Reinforcement Learning: An Introduction (2판)',
    desc: '강화학습의 바이블. 1일차 내용(MDP·DP·MC·TD)의 원전 — 무료 공개',
    url: 'http://incompleteideas.net/book/the-book-2nd.html',
  },
  {
    kind: '코드',
    title: 'CleanRL',
    desc: '알고리즘당 단일 파일 구현체 모음 — DQN부터 SAC·PPO까지, 이번 과정 스타일과 가장 가까운 레퍼런스',
    url: 'https://github.com/vwxyzjn/cleanrl',
  },
  {
    kind: '코드',
    title: 'Stable-Baselines3',
    desc: '검증된 PyTorch RL 라이브러리 — 실무에서 빠르게 베이스라인을 세울 때 사용',
    url: 'https://github.com/DLR-RM/stable-baselines3',
  },
  {
    kind: '도구',
    title: 'Gymnasium',
    desc: '표준 강화학습 환경 인터페이스 (구 OpenAI Gym) — 이번 과정의 모든 실습 환경',
    url: 'https://gymnasium.farama.org/',
  },
  {
    kind: '도구',
    title: 'Unity ML-Agents',
    desc: 'Unity로 커스텀 강화학습 환경을 제작하는 툴킷 — 파이썬 low-level API 제공',
    url: 'https://github.com/Unity-Technologies/ml-agents',
  },
  {
    kind: '논문',
    title: 'Human-level control through deep RL (DQN, Nature 2015)',
    desc: '심층강화학습 시대를 연 DQN 원논문',
    url: 'https://www.nature.com/articles/nature14236',
  },
  {
    kind: '논문',
    title: 'Continuous control with deep RL (DDPG, 2015)',
    desc: '연속 행동 공간 제어의 출발점',
    url: 'https://arxiv.org/abs/1509.02971',
  },
  {
    kind: '논문',
    title: 'Soft Actor-Critic (SAC, 2018)',
    desc: '최대 엔트로피 RL의 대표 실용 알고리즘',
    url: 'https://arxiv.org/abs/1801.01290',
  },
  {
    kind: '논문',
    title: 'Tsallis Actor-Critic (TAC, 2019)',
    desc: 'Tsallis 엔트로피로 SAC를 일반화 — 3일차 마지막 실습의 원논문',
    url: 'https://arxiv.org/abs/1902.00137',
  },
  {
    kind: '논문',
    title: 'A Distributional Perspective on RL (C51, 2017)',
    desc: '기대값 대신 리턴의 분포를 학습하는 Distributional RL — 확률적 환경에서 강력',
    url: 'https://arxiv.org/abs/1707.06887',
  },
  {
    kind: '논문',
    title: 'Curiosity-driven Exploration (ICM, 2017)',
    desc: 'Sparse reward 환경을 위한 호기심 기반 탐험 — LEVEL 4 도전과제의 원논문',
    url: 'https://arxiv.org/abs/1705.05363',
  },
]
