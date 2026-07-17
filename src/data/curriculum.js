// ============================================================
// 커리큘럼 데이터 집계 모듈 (콘텐츠의 단일 진입점)
// ------------------------------------------------------------
// 콘텐츠 수정은 여기가 아니라 day1~3.js에서 한다.
//
// 세션 데이터 스키마 (day1~3.js 공통):
//   {
//     slot: 1~7,                 // 교시 번호 (URL의 :slot)
//     time: '09:30 ~ 10:30',
//     title: '강의명',
//     kind: 'theory' | 'impl',   // 목록의 이론/구현 뱃지 구분
//     objectives: [ ... ],       // 학습 목표 (상단 녹색 박스)
//     theory: [{ h: 소제목, p: 본문 }],  // p의 \n은 CSS white-space:
//                                        // pre-line으로 줄바꿈 렌더링
//     code: { filename, source } // 실습 코드 (CodeBlock으로 표시)
//   }
// 새 교시 추가 시: 해당 day 파일에 세션 객체만 추가하면
// 목록·상세·진도·이전/다음 네비게이션이 모두 자동 반영된다.
// ============================================================
import day1 from './day1.js'
import day2 from './day2.js'
import day3 from './day3.js'

export const days = [day1, day2, day3]

export const course = {
  title: 'PyTorch로 배우는 강화학습',
  org: '멀티캠퍼스 공개과정',
  place: '멀티캠퍼스 역삼캠퍼스',
  period: '2026. 07. 27 (월) ~ 07. 29 (수)',
  hours: '09:30 ~ 17:30 · 1일 7시간 · 총 21시간',
  instructor: '이애본 (DreamIT Biz 대표)',
  homepage: 'https://m.multicampus.com/course/crsDetail?corsCd=FA001B',
  prerequisites: [
    '파이썬 프로그래밍 문법 기초 (조건문, 반복문 등)',
    '인공지능·머신러닝 기초 (Neural Network, Gradient Descent, Back-propagation)',
    'NumPy 기초',
  ],
  goals: [
    '강화학습 기초부터 DQN, Double DQN 등 심층 강화학습 알고리즘과 연속 행동 문제를 푸는 DDPG까지 이론을 학습하고 직접 구현한다',
    'PyTorch로 강화학습 알고리즘을 직접 구현하며 알고리즘의 원리를 학습한다',
    '일반적인 알고리즘이 풀지 못하는 문제를 위한 응용 알고리즘(최대 엔트로피 RL, SAC, TAC)을 학습하고 구현한다',
  ],
  audience: [
    '기초적인 딥러닝을 공부한 학습자',
    '딥러닝 모델을 연구하는 Data Scientist 및 AI 개발자',
    'PyTorch 기반의 강화학습 모델을 활용하려는 개발자',
    'PyTorch로 인공지능 서비스를 개발하려는 개발자',
  ],
}

// URL 파라미터(문자열)로 일차 조회 — 없으면 undefined
export function getDay(dayId) {
  return days.find((d) => d.id === Number(dayId))
}

// 일차+교시로 세션 조회 — 없으면 undefined (페이지에서 안내문 처리)
export function getSession(dayId, slot) {
  const day = getDay(dayId)
  return day?.sessions.find((s) => s.slot === Number(slot))
}

// 진도 저장용 키 생성 ("d1s3" 형태) — useProgress의 localStorage 키와 짝
export function sessionKey(dayId, slot) {
  return `d${dayId}s${slot}`
}
