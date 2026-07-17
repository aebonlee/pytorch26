# 04. About·선수학습 페이지 추가 (2026-07-17)

## 추가된 메뉴 (헤더 좌측 2개)

1. **About** (`/about`, AboutPage.jsx)
   - 개발 취지 3단락: 강의 흐름 그대로 한 곳에 / 코드 복사 즉시 실행·교시 간 부품 재사용 설계 / 수업 후에도 남는 자료(퀴즈·도전과제)
   - 강사 소개: 이애본 DreamIT Biz 대표 — PyTorch 저서·대학/기업 교육 이력·수업 철학. **저서명·상세 약력은 일반 서술로 둠 — 대표가 정확한 문안 주면 교체할 것**
   - 교육 개요 표 + 선수학습 연결

2. **선수학습** (`/prereq`, PrereqPage.jsx + `src/data/prereq.js`)
   - 5개 영역: 파이썬(필수) / NumPy(필수) / AI·ML 기초(필수) / 확률·통계(권장) / 실습환경 준비(준비)
   - 각 영역: 요약 → 필요한 수준 목록 → 셀프체크 코드(정답 주석 포함) 또는 개념 체크리스트 → 보충 자료 링크
   - 실습환경: pip install torch gymnasium numpy, GPU 불필요, Colab 대안 안내

## 구조 변경

- CodeBlock을 SessionPage 내부 정의 → `src/components/CodeBlock.jsx` 공용 컴포넌트로 추출 (SessionPage·PrereqPage 공용)
- 홈 사전지식 카드에서 /prereq 링크 추가
