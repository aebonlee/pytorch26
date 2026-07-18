// ============================================================
// VOD 데이터 (/vod — 메뉴 맨 끝, 심화학습 다음)
// ------------------------------------------------------------
// courseVods: 과정 다시보기(대표 강의 촬영본/보충 영상).
//   { day: 'DAY 1'|..., title, youtubeId, desc } 를 추가하면
//   자동으로 임베드 그리드에 표시된다 — 비어 있으면 준비중 안내.
//   ※ youtubeId는 유튜브 주소의 v= 뒤 11자리.
// lectures: 추천 외부 강의 영상.
//   youtubeId가 있으면 임베드, url만 있으면 링크 카드.
// ============================================================

export const courseVods = [
  // 예시: { day: 'DAY 1', title: '1교시 — 강화학습 소개', youtubeId: 'XXXXXXXXXXX', desc: '...' },
]

export const lectures = [
  {
    title: 'But what is a Neural Network?',
    by: '3Blue1Brown',
    youtubeId: 'aircAruvnKk',
    desc: '신경망의 시각적 직관 — 선수학습(AI·ML 기초) 보충용, 한글 자막 지원',
  },
  {
    title: 'RL Course Lecture 1 — Introduction to RL',
    by: 'David Silver (DeepMind)',
    youtubeId: '2pWv7GOvuf0',
    desc: '강화학습 강의의 고전 — 1일차 전체의 학술적 원전 (영어, 자동 자막)',
  },
  {
    title: '예제로 배우는 파이토치 (한국어 문서)',
    by: '파이토치 한국 사용자 모임',
    url: 'https://tutorials.pytorch.kr/beginner/pytorch_with_examples.html',
    desc: '2일차 PyTorch 기초를 한국어로 복습 — 영상은 아니지만 따라 하기 좋은 실습형 문서',
  },
  {
    title: 'Spinning Up in Deep RL',
    by: 'OpenAI',
    url: 'https://spinningup.openai.com/',
    desc: '심층강화학습의 표준 커리큘럼 — 2~3일차 알고리즘의 이론·구현 레퍼런스',
  },
  {
    title: 'David Silver RL Course 전체 재생목록',
    by: 'Google DeepMind',
    url: 'https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ',
    desc: 'MDP부터 함수 근사·정책 경사까지 10강 — 과정 후 정주행 추천',
  },
  {
    title: 'Unity ML-Agents 시작하기',
    by: 'Unity Technologies',
    url: 'https://github.com/Unity-Technologies/ml-agents',
    desc: '토이 프로젝트(#8)용 — 3D 환경 제작 튜토리얼과 예제 모음',
  },
]
