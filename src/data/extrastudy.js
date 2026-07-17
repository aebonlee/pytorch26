// ============================================================
// 심화학습 데이터 (교육 후 자습 로드맵)
// ------------------------------------------------------------
// resources: 추천 자료 13종 — kind(교재/강의·코드·도구·논문)별 뱃지
// 수업 중 소개한 자료를 추가하려면 여기에 항목만 추가하면 된다.
// ※ 기존 challenges(도전과제 4단계)는 2026-07-17에
//   data/projects.js 미니 프로젝트 8종으로 통합·확장되어 삭제됨.
// ============================================================
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
    kind: '교재/강의',
    title: '파이토치 한국 사용자 모임 — 예제로 배우는 PyTorch',
    desc: 'PyTorch 공식 튜토리얼 한국어 번역 — 2일차 PyTorch 기초를 한국어로 복습할 때 최적',
    url: 'https://tutorials.pytorch.kr/beginner/pytorch_with_examples.html',
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
