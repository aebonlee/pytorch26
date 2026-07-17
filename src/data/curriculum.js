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

export function getDay(dayId) {
  return days.find((d) => d.id === Number(dayId))
}

export function getSession(dayId, slot) {
  const day = getDay(dayId)
  return day?.sessions.find((s) => s.slot === Number(slot))
}

export function sessionKey(dayId, slot) {
  return `d${dayId}s${slot}`
}
