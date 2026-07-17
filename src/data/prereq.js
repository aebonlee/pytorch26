// ============================================================
// 선수학습 데이터 (멀티캠퍼스 안내의 사전지식 3줄을 4영역으로 확장)
// ------------------------------------------------------------
// 스키마: {
//   id, difficulty(1~5 난이도), level('필수'|'권장' — 중요도 구분),   // level별 뱃지 색은 PrereqPage의 LEVEL_STYLE
//   title, summary,
//   items: [필요한 수준 목록],
//   check: { filename, source },       // 셀프체크 코드 (정답을 주석으로 포함) — 선택
//   checklist: [ ... ],                // 코드 대신 개념 체크리스트를 쓸 때 — 선택
//   resources: [{ title, url }],       // 부족할 때 볼 보충 자료
// }
// ============================================================
export default [
  {
    id: 'python',
    difficulty: 2,
    level: '필수',
    title: '파이썬 프로그래밍 기초',
    summary: '모든 실습 코드는 파이썬으로 작성됩니다.\n문법을 보고 "무엇을 하는 코드인지" 바로 읽을 수 있어야 합니다.',
    items: [
      '변수, 기본 자료형 (숫자·문자열·리스트·딕셔너리·튜플)',
      '조건문(if)과 반복문(for/while)',
      '함수 정의(def), 인자와 반환값',
      '클래스 기본 — PyTorch의 nn.Module을 상속받아 모델을 정의하므로 class·__init__·상속 개념이 필요합니다',
      '리스트 컴프리헨션, zip / enumerate 같은 관용 표현',
    ],
    check: {
      filename: 'selfcheck_python.py',
      source: `# 아래 코드의 출력을 예측할 수 있다면 파이썬 준비 완료입니다

class Agent:
    def __init__(self, name, epsilon=0.1):
        self.name = name
        self.epsilon = epsilon
        self.history = []

    def act(self, q_values):
        best = max(range(len(q_values)), key=lambda a: q_values[a])
        self.history.append(best)
        return best

agent = Agent("learner")
q = [0.5, 1.2, -0.3, 0.9]
print(agent.act(q))                      # ?
print([a * 2 for a in q if a > 0])       # ?
for i, (s, r) in enumerate(zip("abc", [1, 2, 3])):
    print(i, s, r)                       # ?

# 정답: 1 / [1.0, 2.4, 1.8] / 0 a 1, 1 b 2, 2 c 3`,
    },
    resources: [
      { title: '점프 투 파이썬 (무료 전자책)', url: 'https://wikidocs.net/book/1' },
      { title: '파이썬 공식 튜토리얼 (한국어)', url: 'https://docs.python.org/ko/3/tutorial/' },
    ],
  },
  {
    id: 'numpy',
    difficulty: 2,
    level: '필수',
    title: 'NumPy 기초',
    summary: '1일차의 표 기반 알고리즘(GridWorld, Q-테이블)은 전부 NumPy 배열로 구현합니다.\nPyTorch 텐서 API도 NumPy와 거의 같아, NumPy에 익숙하면 2~3일차가 훨씬 수월합니다.',
    items: [
      '배열 생성 (np.zeros, np.array), shape 개념',
      '인덱싱과 슬라이싱 (Q[s], Q[s][a], V.reshape(4, 4))',
      'argmax / max — Q-Learning의 핵심 연산입니다',
      'axis 개념 (행 방향·열 방향 연산)',
      '브로드캐스팅 기초',
    ],
    check: {
      filename: 'selfcheck_numpy.py',
      source: `import numpy as np

# 아래 각 줄의 결과 shape 또는 값을 예측해 보세요
Q = np.zeros((16, 4))            # 16개 상태 x 4개 행동의 Q-테이블
Q[5] = [0.1, 0.7, 0.3, 0.2]

print(Q.shape)                   # ?
print(Q[5].argmax())             # ?  ← "상태 5에서 최선의 행동"
print(Q.max(axis=1).shape)       # ?  ← 상태별 최대 Q값
print(np.arange(12).reshape(3, 4).sum(axis=0))   # ?

# 정답: (16, 4) / 1 / (16,) / [12 15 18 21]`,
    },
    resources: [
      { title: 'NumPy 공식 Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html' },
      { title: 'NumPy: the absolute basics for beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html' },
    ],
  },
  {
    id: 'dl',
    difficulty: 3,
    level: '필수',
    title: '인공지능·머신러닝 기초',
    summary: '2일차부터 Q-테이블을 신경망으로 교체합니다(DQN). 신경망이 "학습된다"는 것이 무슨 뜻인지 개념적으로 알고 있어야 합니다.\n수식 유도까지는 필요 없습니다.',
    items: [
      'Neural Network — 층(layer), 가중치, 활성화 함수(ReLU)가 무엇인지',
      'Gradient Descent — 손실을 줄이는 방향으로 가중치를 조금씩 이동한다는 개념',
      'Back-propagation — 출력의 오차로부터 각 가중치의 기울기를 거꾸로 계산한다는 개념',
      '손실 함수(Loss) — MSE 등, "예측이 얼마나 틀렸는가"의 측정',
      '학습률(learning rate), 배치(batch), 에포크(epoch) 용어',
      '과적합(overfitting)이 무엇인지 정도의 감각',
    ],
    checklist: [
      '"신경망을 학습시킨다 = 손실 함수를 최소화하도록 가중치를 반복 조정한다"를 설명할 수 있다',
      '학습률이 너무 크면/작으면 어떤 일이 생기는지 말할 수 있다',
      'y = Wx + b에서 W와 b가 학습되는 대상임을 안다',
    ],
    resources: [
      { title: '3Blue1Brown — Neural Networks 시리즈 (시각적 직관, 한글 자막)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi' },
      { title: 'PyTorch 공식 튜토리얼 — Learn the Basics', url: 'https://pytorch.org/tutorials/beginner/basics/intro.html' },
    ],
  },
  {
    id: 'math',
    difficulty: 2,
    level: '권장',
    title: '확률·통계 기초',
    summary: '강화학습은 "기대 보상의 최대화"가 목표라 확률 언어가 계속 나옵니다.\n깊은 수학은 필요 없지만 아래 개념에 익숙하면 이론 세션이 편해집니다.',
    items: [
      '확률분포와 샘플링 — "분포에서 행동을 뽑는다"의 의미',
      '기대값 E[X] — 확률 가중 평균',
      '조건부 확률 표기 P(s\'|s,a) 읽는 법',
      '정규분포(가우시안) — 3일차 SAC의 정책이 가우시안입니다',
    ],
    check: {
      filename: 'selfcheck_prob.py',
      source: `import numpy as np
rng = np.random.default_rng(0)

# 1) 기대값: 주사위의 기대값은?  (1+2+...+6)/6 = 3.5
samples = rng.integers(1, 7, size=100_000)
print(samples.mean())            # 3.5 근처면 OK

# 2) 확률적 정책: p = [0.7, 0.2, 0.1]인 분포에서 행동 샘플링
actions = rng.choice(3, size=10, p=[0.7, 0.2, 0.1])
print(actions)                   # 0이 가장 자주 나옵니다

# 3) 가우시안 샘플링 — SAC 정책의 원형
a = rng.normal(loc=0.0, scale=1.0, size=5)
print(a)                         # 평균 0, 표준편차 1의 연속값`,
    },
    resources: [
      { title: 'Khan Academy — 확률과 통계 (한국어)', url: 'https://ko.khanacademy.org/math/statistics-probability' },
    ],
  },
]
