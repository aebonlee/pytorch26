# pytorch26 — PyTorch로 배우는 강화학습

멀티캠퍼스 공개과정 3일(21시간) 학습사이트

- **배포 URL**: https://aebonlee.github.io/pytorch26/
- **교육 일정**: 2026. 07. 27(월) ~ 07. 29(수), 09:30~17:30
- **교육 장소**: 멀티캠퍼스 역삼캠퍼스
- **강사**: 이애본 (DreamIT Biz)
- **과정 소개**: https://m.multicampus.com/course/crsDetail?corsCd=FA001B

## 커리큘럼

| Day | 주제 | 내용 |
|-----|------|------|
| 1 | Tabular-based Methods | RL 소개 · MDP · DP · PI/VI 구현 · MC/TD · SARSA/Q-Learning 구현 |
| 2 | Value-based & Policy-based | DQN · Double DQN · PyTorch 기초 · DQN 구현 · Policy Gradient · Actor-Critic · A2C 구현 |
| 3 | Advanced Actor-Critic | DDPG 소개/구현 · Maximum Entropy RL · SAC · TAC 소개/구현 |

마지막 날 복습퀴즈 15문항 + 도전과제 4단계 + 추천자료 12종 포함.

## 기술 스택

- React 19 + Vite 8 (JSX), react-router-dom (HashRouter)
- 인증·DB 없음 — 진도체크는 localStorage (`pytorch26_progress`)
- 콘텐츠는 전부 `src/data/day1~3.js`, `quizzes.js`, `extrastudy.js`에 데이터로 분리

## 개발 & 배포

```bash
npm install
npm run dev      # 로컬 개발
npm run build    # dist/ 생성
```

배포는 **main 푸시 시 GitHub Actions 자동배포** (`.github/workflows/deploy.yml`).
Pages build_type은 workflow 방식 — legacy로 되돌리지 말 것.

vite base는 `/pytorch26/` (프로젝트 페이지). 커스텀 도메인 연결 시 base를 `/`로 변경해야 자산 404가 나지 않음.

## 실습 환경 (수강생 안내)

```bash
pip install torch gymnasium numpy
pip install "gymnasium[mujoco]"   # 심화 도전과제용 (선택)
```
