// ============================================================
// 미니 프로젝트 데이터 (실습 강화용 — /projects)
// ------------------------------------------------------------
// 대표의 이전 파이토치 과정 패들렛 운영 패턴을 강화학습 과정에
// 맞게 재구성한 것: "미니프로젝트 1~7 + 토이 프로젝트" 구조와
// "결과 인증(성능 수치·학습곡선 공유)" 문화를 가져왔다.
//
// 스키마: {
//   id: 1~8,
//   difficulty/importance: 1~5 (별점 표기),
//   level: '기본'(1일차 수준) | '응용'(2일차) | '심화'(3일차+) | '자유',
//   title, env, goal, reuse, guide[], cert, stretch[],
//   skeleton: { filename, source }  // 괄호채우기(빈칸 ________) — fill0N
//   solution: { filename, source }  // 완성형 코드 — sol0N
// }  두 코드는 카드 우하단 버튼 2개로 각각 토글 공개.
// ※ solution.source는 JS 템플릿 리터럴 — 백틱(`)과 달러중괄호를
//   절대 넣지 말 것 (문자열이 깨진다). 파이썬 f-string은 안전.
// ※ #5·#6은 3일차 수업 코드(클래스)를 전제로 한 러너 — 완전
//   독립 실행형이 아님을 주석으로 명시해 둠.
// ============================================================
export default [
  {
    id: 1,
    difficulty: 2,
    importance: 4,
    level: '기본',
    title: 'FrozenLake — 미끄러운 얼음호수 건너기',
    env: 'FrozenLake-v1 (is_slippery=True)',
    goal: '확률적 전이 환경에서 Q-Learning으로 안전한 경로 정책을 학습한다',
    reuse: '1일차 7교시 CliffWalking 코드에서 환경만 교체',
    guide: [
      'is_slippery=False로 먼저 학습해 결정적 환경에서 동작 확인',
      'is_slippery=True로 바꾸면 성공률이 급락하는 것을 관찰',
      'ε 감쇠 스케줄과 학습률 α를 조정해 성공률을 끌어올리기',
      '학습된 Q 테이블을 화살표 격자로 시각화해 정책 해석',
    ],
    cert: '평가 모드(ε=0) 1000 에피소드 평균 성공률 70% 이상 + 정책 화살표 격자 공유',
    stretch: ['8x8 맵으로 확장', '보상 성형(구멍 -1) 적용 전후 비교'],
    skeleton: {
      filename: 'fill01_frozenlake_qlearning.py',
      source: `import gymnasium as gym
import numpy as np

# 괄호채우기: ________ 를 채워 완성하세요 (힌트는 각 줄 주석)
env = gym.make("FrozenLake-v1", map_name="4x4", is_slippery=True)
nS, nA = env.observation_space.n, env.action_space.n

alpha, gamma = 0.1, 0.99
eps, eps_min, eps_decay = 1.0, 0.05, 0.9997
rng = np.random.default_rng(0)
Q = np.zeros((nS, nA))

for ep in range(30000):
    s, _ = env.reset()
    done = False
    while not done:
        if rng.random() < eps:
            a = int(rng.integers(nA))
        else:
            a = ________                     # 빈칸①: greedy 행동 — Q[s]에서 최대인 행동
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        # 빈칸②: Q-Learning 업데이트 — TD 목표(r + gamma * 다음상태 최대Q * (not done))와
        #         현재 추정치의 차이를 alpha만큼 반영
        Q[s][a] += alpha * (________)
        s = s2
    eps = ________                           # 빈칸③: eps_min 아래로 안 내려가게 eps_decay 곱하기

# 평가 (탐험 없이)
wins = 0
for _ in range(1000):
    s, _ = env.reset()
    done = False
    while not done:
        s, r, term, trunc, _ = env.step(________)   # 빈칸④: greedy 행동
        done = term or trunc
    wins += (r > 0)
print(f"greedy 성공률: {wins / 10:.1f}%")

arrows = np.array(['←', '↓', '→', '↑'])
print(arrows[Q.argmax(axis=1)].reshape(4, 4))`,
    },
    solution: {
      filename: 'sol01_frozenlake_qlearning.py',
      source: `import gymnasium as gym
import numpy as np

# 미끄러운 얼음호수: 행동대로 안 움직일 확률이 2/3인 확률적 환경
env = gym.make("FrozenLake-v1", map_name="4x4", is_slippery=True)
nS, nA = env.observation_space.n, env.action_space.n

alpha, gamma = 0.1, 0.99
eps, eps_min, eps_decay = 1.0, 0.05, 0.9997   # 천천히 감쇠 (확률 환경이라 탐험을 오래)
rng = np.random.default_rng(0)
Q = np.zeros((nS, nA))

# ── 학습 ──
for ep in range(30000):
    s, _ = env.reset()
    done = False
    while not done:
        a = int(rng.integers(nA)) if rng.random() < eps else int(Q[s].argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        Q[s][a] += alpha * (r + gamma * Q[s2].max() * (not done) - Q[s][a])
        s = s2
    eps = max(eps_min, eps * eps_decay)

# ── 평가 (탐험 없이 greedy) ──
wins = 0
for _ in range(1000):
    s, _ = env.reset()
    done = False
    while not done:
        s, r, term, trunc, _ = env.step(int(Q[s].argmax()))
        done = term or trunc
    wins += (r > 0)
print(f"greedy 성공률: {wins / 10:.1f}%   (70% 이상이면 인증!)")

# ── 정책 화살표 격자 ──
arrows = np.array(['←', '↓', '→', '↑'])   # FrozenLake 행동 순서
print(arrows[Q.argmax(axis=1)].reshape(4, 4))
# 미끄러운 환경에서는 "구멍 반대쪽으로 미는" 이상해 보이는
# 화살표가 오히려 최적일 수 있습니다 — 왜인지 생각해 보세요`,
    },
  },
  {
    id: 2,
    difficulty: 2,
    importance: 4,
    level: '기본',
    title: 'Taxi — SARSA vs Q-Learning 대결',
    env: 'Taxi-v3',
    goal: '같은 문제에서 on-policy와 off-policy TD 제어의 학습 특성을 비교한다',
    reuse: '1일차 6~7교시 SARSA/Q-Learning 구현 그대로',
    guide: [
      'Taxi-v3(상태 500개)에 두 알고리즘을 동일 하이퍼파라미터로 학습',
      '에피소드별 리턴 곡선을 같은 그래프에 겹쳐 그리기 (matplotlib)',
      '학습 중 곡선과 최종 greedy 정책 성능을 분리해서 비교',
      'ε을 0.3으로 키우면 두 알고리즘의 격차가 어떻게 변하는지 실험',
    ],
    cert: '두 알고리즘 학습곡선 비교 그래프 + greedy 평가 평균 리턴 8 이상',
    stretch: ['α·ε 조합 격자 실험표 만들기'],
    skeleton: {
      filename: 'fill02_taxi_sarsa_vs_ql.py',
      source: `import gymnasium as gym
import numpy as np
import matplotlib.pyplot as plt

# 괄호채우기: ________ 를 채워 완성하세요
def train(method, episodes=4000, alpha=0.1, gamma=0.99, eps=0.1):
    env = gym.make("Taxi-v3")
    nS, nA = env.observation_space.n, env.action_space.n
    Q = np.zeros((nS, nA))
    rng = np.random.default_rng(0)
    returns = []

    def act(s):
        return int(rng.integers(nA)) if rng.random() < eps else int(Q[s].argmax())

    for _ in range(episodes):
        s, _ = env.reset()
        a = act(s)
        done, total = False, 0
        while not done:
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            a2 = act(s2)
            # 빈칸①: 두 알고리즘의 유일한 차이!
            #   SARSA      → 실제 선택한 다음 행동의 Q값
            #   Q-Learning → 다음 상태의 최대 Q값
            nxt = ________ if method == "sarsa" else ________
            # 빈칸②: TD 업데이트 (목표: r + gamma * nxt * (not done))
            Q[s][a] += alpha * (________)
            s, a, total = s2, a2, total + r
        returns.append(total)
    return Q, returns

Q_s, ret_s = train("sarsa")
Q_q, ret_q = train("qlearning")

smooth = lambda x, k=100: np.convolve(x, np.ones(k) / k, "valid")
plt.plot(smooth(ret_s), label="SARSA")
plt.plot(smooth(ret_q), label="Q-Learning")
plt.legend(); plt.show()`,
    },
    solution: {
      filename: 'sol02_taxi_sarsa_vs_ql.py',
      source: `import gymnasium as gym
import numpy as np
import matplotlib.pyplot as plt

def train(method, episodes=4000, alpha=0.1, gamma=0.99, eps=0.1):
    env = gym.make("Taxi-v3")
    nS, nA = env.observation_space.n, env.action_space.n
    Q = np.zeros((nS, nA))
    rng = np.random.default_rng(0)
    returns = []

    def act(s):
        return int(rng.integers(nA)) if rng.random() < eps else int(Q[s].argmax())

    for _ in range(episodes):
        s, _ = env.reset()
        a = act(s)
        done, total = False, 0
        while not done:
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            a2 = act(s2)
            # 유일한 차이: SARSA는 실제 다음 행동 / QL은 max
            nxt = Q[s2][a2] if method == "sarsa" else Q[s2].max()
            Q[s][a] += alpha * (r + gamma * nxt * (not done) - Q[s][a])
            s, a, total = s2, a2, total + r
        returns.append(total)
    return Q, returns

def eval_greedy(Q, n=100):
    env = gym.make("Taxi-v3")
    tot = 0
    for _ in range(n):
        s, _ = env.reset()
        done = False
        while not done:
            s, r, term, trunc, _ = env.step(int(Q[s].argmax()))
            done = term or trunc
            tot += r
    return tot / n

Q_s, ret_s = train("sarsa")
Q_q, ret_q = train("qlearning")

smooth = lambda x, k=100: np.convolve(x, np.ones(k) / k, "valid")
plt.plot(smooth(ret_s), label="SARSA")
plt.plot(smooth(ret_q), label="Q-Learning")
plt.xlabel("episode"); plt.ylabel("return (100ep 이동평균)")
plt.legend(); plt.title("Taxi-v3: SARSA vs Q-Learning")
plt.show()

print(f"greedy 평가 — SARSA: {eval_greedy(Q_s):.1f} / Q-Learning: {eval_greedy(Q_q):.1f}")
# 둘 다 8 이상이면 인증! eps=0.3으로 올려 재실험해 보세요`,
    },
  },
  {
    id: 3,
    difficulty: 3,
    importance: 5,
    level: '응용',
    title: 'LunarLander — 달 착륙선 DQN',
    env: 'LunarLander-v3',
    goal: 'CartPole보다 어려운 8차원 상태·4행동 환경에서 DQN 계열을 튜닝한다',
    reuse: '2일차 4교시 DQN/Double DQN 코드에서 환경·네트워크 크기만 조정',
    guide: [
      '네트워크를 256-256으로 키우고 학습률 5e-4로 시작',
      '바닐라 DQN으로 베이스라인 확보 (평균 리턴 기록)',
      'DOUBLE=True로 전환해 같은 조건에서 재학습, 개선 폭 확인',
      '리플레이 버퍼 크기(1만/10만)가 성능에 주는 영향 실험',
    ],
    cert: '최근 100 에피소드 평균 리턴 200 이상 (해결 기준) + 착륙 영상 or 학습곡선 공유',
    stretch: ['Dueling 구조 추가', 'ε 대신 소프트맥스 탐험으로 교체'],
    skeleton: {
      filename: 'fill03_lunarlander_dqn.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import random
from collections import deque

# 괄호채우기: ________ 를 채워 완성하세요 (Double DQN의 핵심 3줄)
env = gym.make("LunarLander-v3")
obs_dim, n_act = 8, 4
DOUBLE = True

def make_net():
    return nn.Sequential(
        nn.Linear(obs_dim, 256), nn.ReLU(),
        nn.Linear(256, 256), nn.ReLU(),
        nn.Linear(256, n_act),
    )

q, q_t = make_net(), make_net()
q_t.load_state_dict(q.state_dict())
opt = torch.optim.Adam(q.parameters(), lr=5e-4)
buf = deque(maxlen=100_000)
gamma, batch = 0.99, 128
eps, eps_min, decay = 1.0, 0.02, 0.995

def train_step():
    s, a, r, s2, d = zip(*random.sample(buf, batch))
    s = torch.as_tensor(np.array(s), dtype=torch.float32)
    s2 = torch.as_tensor(np.array(s2), dtype=torch.float32)
    a = torch.as_tensor(a); r = torch.as_tensor(r, dtype=torch.float32)
    d = torch.as_tensor(d, dtype=torch.float32)
    qv = q(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        if DOUBLE:
            best = ________       # 빈칸①: "선택" — 온라인넷 q로 s2의 argmax (keepdim=True)
            nxt = ________        # 빈칸②: "평가" — 타깃넷 q_t에서 best 행동의 Q (gather 후 squeeze)
        else:
            nxt = q_t(s2).max(1).values
        y = ________              # 빈칸③: TD 목표 — r + gamma * nxt * (1 - d)
    loss = nn.functional.smooth_l1_loss(qv, y)
    opt.zero_grad(); loss.backward(); opt.step()

rets = []
for ep in range(800):
    s, _ = env.reset()
    done, tot = False, 0.0
    while not done:
        if np.random.rand() < eps:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = int(q(torch.as_tensor(s, dtype=torch.float32)).argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buf.append((s, a, r, s2, float(term)))
        s, tot = s2, tot + r
        if len(buf) >= 2000:
            train_step()
    eps = max(eps_min, eps * decay)
    rets.append(tot)
    if ep % 10 == 0:
        q_t.load_state_dict(________)   # 빈칸④: 타깃 네트워크 동기화 — 어느 네트워크의 가중치?
    if len(rets) >= 100 and np.mean(rets[-100:]) >= 200:
        print(f"해결! ep {ep}")
        break`,
    },
    solution: {
      filename: 'sol03_lunarlander_dqn.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import random
from collections import deque

# pip install "gymnasium[box2d]" 필요
env = gym.make("LunarLander-v3")
obs_dim = env.observation_space.shape[0]   # 8
n_act = env.action_space.n                 # 4
DOUBLE = True                              # ← 바닐라/더블 전환 스위치

def make_net():
    return nn.Sequential(
        nn.Linear(obs_dim, 256), nn.ReLU(),
        nn.Linear(256, 256), nn.ReLU(),
        nn.Linear(256, n_act),
    )

q, q_t = make_net(), make_net()
q_t.load_state_dict(q.state_dict())
opt = torch.optim.Adam(q.parameters(), lr=5e-4)
buf = deque(maxlen=100_000)
gamma, batch = 0.99, 128
eps, eps_min, decay = 1.0, 0.02, 0.995

def train_step():
    s, a, r, s2, d = zip(*random.sample(buf, batch))
    s = torch.as_tensor(np.array(s), dtype=torch.float32)
    s2 = torch.as_tensor(np.array(s2), dtype=torch.float32)
    a = torch.as_tensor(a); r = torch.as_tensor(r, dtype=torch.float32)
    d = torch.as_tensor(d, dtype=torch.float32)
    qv = q(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        if DOUBLE:   # 선택=온라인넷, 평가=타깃넷
            best = q(s2).argmax(1, keepdim=True)
            nxt = q_t(s2).gather(1, best).squeeze(1)
        else:
            nxt = q_t(s2).max(1).values
        y = r + gamma * nxt * (1 - d)
    loss = nn.functional.smooth_l1_loss(qv, y)
    opt.zero_grad(); loss.backward(); opt.step()

rets = []
for ep in range(800):
    s, _ = env.reset()
    done, tot = False, 0.0
    while not done:
        if np.random.rand() < eps:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = int(q(torch.as_tensor(s, dtype=torch.float32)).argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buf.append((s, a, r, s2, float(term)))
        s, tot = s2, tot + r
        if len(buf) >= 2000:
            train_step()
    eps = max(eps_min, eps * decay)
    rets.append(tot)
    if ep % 10 == 0:
        q_t.load_state_dict(q.state_dict())
    if ep % 20 == 0:
        print(f"ep {ep:3d}  avg20 {np.mean(rets[-20:]):7.1f}  eps {eps:.2f}")
    if len(rets) >= 100 and np.mean(rets[-100:]) >= 200:
        print(f"해결! (ep {ep}, 최근 100ep 평균 {np.mean(rets[-100:]):.1f})")
        break`,
    },
  },
  {
    id: 4,
    difficulty: 3,
    importance: 4,
    level: '응용',
    title: 'A2C 하이퍼파라미터 실험실',
    env: 'CartPole-v1',
    goal: 'n-step 길이와 엔트로피 계수가 정책 경사 학습에 주는 영향을 체계적으로 실험한다',
    reuse: '2일차 7교시 A2C 코드에 실험 루프만 추가',
    guide: [
      'n_steps ∈ {1, 5, 20} × entropy_coef ∈ {0, 0.01, 0.1} 9개 조합 실험',
      '각 조합을 시드 3개로 반복해 평균 학습곡선 산출',
      '"n이 길수록 MC에, 짧을수록 TD에 가까워진다"를 곡선으로 확인',
      '엔트로피 0일 때 조기 수렴(국소 최적) 현상 관찰',
    ],
    cert: '9개 조합 결과표(최종 평균 리턴) + 최적 조합과 그 이유 한 줄 공유',
    stretch: ['학습률·gradient clipping 추가 실험'],
    skeleton: {
      filename: 'fill04_a2c_grid_search.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import itertools

# 괄호채우기: ________ 를 채워 완성하세요 (A2C의 핵심 수식 3곳)
class AC(nn.Module):
    def __init__(self):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(4, 128), nn.ReLU())
        self.pi = nn.Linear(128, 2)
        self.v = nn.Linear(128, 1)
    def forward(self, x):
        h = self.body(x)
        return self.pi(h), self.v(h).squeeze(-1)

def train(n_steps, ent_coef, seed=0, updates=1500):
    torch.manual_seed(seed)
    env = gym.make("CartPole-v1")
    model = AC()
    opt = torch.optim.Adam(model.parameters(), lr=7e-4)
    s, _ = env.reset(seed=seed)
    ep_ret, rets = 0, []
    for _ in range(updates):
        logps, vals, rs, ents, ds = [], [], [], [], []
        for _ in range(n_steps):
            logits, v = model(torch.as_tensor(s, dtype=torch.float32))
            dist = torch.distributions.Categorical(logits=logits)
            a = dist.sample()
            s2, r, term, trunc, _ = env.step(a.item())
            d = term or trunc
            logps.append(dist.log_prob(a)); vals.append(v)
            rs.append(r); ds.append(d); ents.append(dist.entropy())
            ep_ret += r; s = s2
            if d:
                rets.append(ep_ret); ep_ret = 0
                s, _ = env.reset()
        with torch.no_grad():
            _, v_last = model(torch.as_tensor(s, dtype=torch.float32))
        R, targets = v_last, []
        for r, d in zip(reversed(rs), reversed(ds)):
            R = ________                     # 빈칸①: n-step 리턴 누적 (r + 0.99*R, 종료(d)면 미래항 0)
            targets.insert(0, R)
        targets = torch.stack(targets).detach()
        vals = torch.stack(vals)
        adv = ________                       # 빈칸②: 어드밴티지 = TD 목표 - 가치 추정
        # 빈칸③: 손실 = actor(-logπ·adv.detach() 평균) + 0.5*critic(adv² 평균) - ent_coef*엔트로피 평균
        loss = ________
        opt.zero_grad(); loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 0.5)
        opt.step()
    return np.mean(rets[-20:]) if len(rets) >= 20 else 0.0

results = {}
for n, e in itertools.product([1, 5, 20], [0.0, 0.01, 0.1]):
    results[(n, e)] = np.mean([train(n, e, seed=sd) for sd in range(3)])
    print(f"n_steps={n:2d}  ent={e:4.2f}  →  {results[(n, e)]:6.1f}")
print("최적:", max(results, key=results.get))`,
    },
    solution: {
      filename: 'sol04_a2c_grid_search.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import itertools

class AC(nn.Module):
    def __init__(self):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(4, 128), nn.ReLU())
        self.pi = nn.Linear(128, 2)
        self.v = nn.Linear(128, 1)
    def forward(self, x):
        h = self.body(x)
        return self.pi(h), self.v(h).squeeze(-1)

def train(n_steps, ent_coef, seed=0, updates=1500):
    torch.manual_seed(seed)
    env = gym.make("CartPole-v1")
    model = AC()
    opt = torch.optim.Adam(model.parameters(), lr=7e-4)
    s, _ = env.reset(seed=seed)
    ep_ret, rets = 0, []
    for _ in range(updates):
        logps, vals, rs, ents, ds = [], [], [], [], []
        for _ in range(n_steps):
            logits, v = model(torch.as_tensor(s, dtype=torch.float32))
            dist = torch.distributions.Categorical(logits=logits)
            a = dist.sample()
            s2, r, term, trunc, _ = env.step(a.item())
            d = term or trunc
            logps.append(dist.log_prob(a)); vals.append(v)
            rs.append(r); ds.append(d); ents.append(dist.entropy())
            ep_ret += r; s = s2
            if d:
                rets.append(ep_ret); ep_ret = 0
                s, _ = env.reset()
        with torch.no_grad():
            _, v_last = model(torch.as_tensor(s, dtype=torch.float32))
        R, targets = v_last, []
        for r, d in zip(reversed(rs), reversed(ds)):
            R = r + 0.99 * R * (1 - d)
            targets.insert(0, R)
        targets = torch.stack(targets).detach()
        vals = torch.stack(vals)
        adv = targets - vals
        loss = (-(torch.stack(logps) * adv.detach()).mean()
                + 0.5 * adv.pow(2).mean()
                - ent_coef * torch.stack(ents).mean())
        opt.zero_grad(); loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 0.5)
        opt.step()
    return np.mean(rets[-20:]) if len(rets) >= 20 else 0.0

# ── 9개 조합 × 시드 3개 격자 실험 ──
results = {}
for n, e in itertools.product([1, 5, 20], [0.0, 0.01, 0.1]):
    scores = [train(n, e, seed=sd) for sd in range(3)]
    results[(n, e)] = np.mean(scores)
    print(f"n_steps={n:2d}  ent={e:4.2f}  →  평균 {results[(n, e)]:6.1f}")

best = max(results, key=results.get)
print(f"최적 조합: n_steps={best[0]}, ent_coef={best[1]}  ({results[best]:.1f}점)")
# ent=0 조합이 유독 낮다면 조기 수렴(탐험 소멸)을 관찰한 것입니다`,
    },
  },
  {
    id: 5,
    difficulty: 3,
    importance: 5,
    level: '응용',
    title: 'Pendulum — DDPG vs SAC 대결',
    env: 'Pendulum-v1',
    goal: '같은 연속 제어 문제에서 결정적 정책과 최대 엔트로피 정책의 안정성을 비교한다',
    reuse: '3일차 2교시 DDPG + 6교시 SAC 코드 그대로',
    guide: [
      '두 알고리즘을 같은 시드 3개로 각각 학습 (에피소드 150)',
      '평균±표준편차 밴드가 있는 학습곡선을 겹쳐 그리기',
      'DDPG의 탐험 노이즈 σ를 0.05/0.1/0.3으로 바꿔 민감도 확인',
      'SAC의 α(온도)가 학습 중 어떻게 변하는지 로그 찍어 관찰',
    ],
    cert: '두 알고리즘 학습곡선 비교(시드 3개 평균) + 어느 쪽이 안정적이었는지 관찰 공유',
    stretch: ['MuJoCo HalfCheetah-v5로 동일 비교 확장'],
    skeleton: {
      filename: 'fill05_ddpg_vs_sac.py',
      source: `# 전제: 3일차 실습 코드(Actor, Critic, GaussianActor, ReplayBuffer,
#        soft_update)가 같은 노트북/파일에 이미 정의되어 있음
# 괄호채우기: ________ 를 채워 완성하세요 (DDPG 학습의 핵심 3곳)
import gymnasium as gym
import torch, copy
import numpy as np
import matplotlib.pyplot as plt

def run_ddpg(seed, episodes=150, noise_std=0.2):
    torch.manual_seed(seed); np.random.seed(seed)
    env = gym.make("Pendulum-v1")
    actor, critic = Actor(3, 1, 2.0), Critic(3, 1)
    actor_t, critic_t = copy.deepcopy(actor), copy.deepcopy(critic)
    a_opt = torch.optim.Adam(actor.parameters(), lr=1e-4)
    c_opt = torch.optim.Adam(critic.parameters(), lr=1e-3)
    buf = ReplayBuffer(100_000)
    rets = []
    for ep in range(episodes):
        s, _ = env.reset(seed=seed * 1000 + ep)
        done, tot = False, 0.0
        while not done:
            with torch.no_grad():
                a = actor(torch.as_tensor(s, dtype=torch.float32)).numpy()
            a = (a + np.random.normal(0, noise_std, 1)).clip(-2, 2)
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            buf.push(s, a, r, s2, float(term))
            s, tot = s2, tot + r
            if len(buf) >= 1000:
                bs, ba, br, bs2, bd = buf.sample(128)
                with torch.no_grad():
                    # 빈칸①: TD 목표 — 타깃넷들로! br + 0.99 * Q'(s2, mu'(s2)) * (1-bd)
                    y = ________
                c_loss = torch.nn.functional.mse_loss(critic(bs, ba), y)
                c_opt.zero_grad(); c_loss.backward(); c_opt.step()
                # 빈칸②: Actor 손실 — Q(s, mu(s))를 "최대화" (부호에 주의!)
                a_loss = ________
                a_opt.zero_grad(); a_loss.backward(); a_opt.step()
                # 빈칸③: 두 타깃 네트워크 소프트 업데이트 (soft_update 두 번 호출)
                ________
        rets.append(tot)
    return rets

def band_plot(all_runs, label):
    arr = np.array(all_runs)
    m, sd = arr.mean(0), arr.std(0)
    plt.plot(m, label=label)
    plt.fill_between(np.arange(len(m)), m - sd, m + sd, alpha=0.2)

band_plot([run_ddpg(sd) for sd in range(3)], "DDPG")
# SAC도 같은 방식으로 함수화해 겹쳐 그리세요
plt.legend(); plt.show()`,
    },
    solution: {
      filename: 'sol05_ddpg_vs_sac.py',
      source: `# 전제: 3일차 실습 코드(Actor, Critic, GaussianActor, ReplayBuffer,
#        soft_update)가 같은 노트북/파일에 이미 정의되어 있음
# 아래는 두 알고리즘을 "함수화 → 시드 3개 → 밴드 그래프"로 비교하는 러너
import gymnasium as gym
import torch, copy
import numpy as np
import matplotlib.pyplot as plt

def run_ddpg(seed, episodes=150, noise_std=0.2):
    torch.manual_seed(seed); np.random.seed(seed)
    env = gym.make("Pendulum-v1")
    actor, critic = Actor(3, 1, 2.0), Critic(3, 1)
    actor_t, critic_t = copy.deepcopy(actor), copy.deepcopy(critic)
    a_opt = torch.optim.Adam(actor.parameters(), lr=1e-4)
    c_opt = torch.optim.Adam(critic.parameters(), lr=1e-3)
    buf = ReplayBuffer(100_000)
    rets = []
    for ep in range(episodes):
        s, _ = env.reset(seed=seed * 1000 + ep)
        done, tot = False, 0.0
        while not done:
            with torch.no_grad():
                a = actor(torch.as_tensor(s, dtype=torch.float32)).numpy()
            a = (a + np.random.normal(0, noise_std, 1)).clip(-2, 2)
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            buf.push(s, a, r, s2, float(term))
            s, tot = s2, tot + r
            if len(buf) >= 1000:
                bs, ba, br, bs2, bd = buf.sample(128)
                with torch.no_grad():
                    y = br + 0.99 * critic_t(bs2, actor_t(bs2)) * (1 - bd)
                c_loss = torch.nn.functional.mse_loss(critic(bs, ba), y)
                c_opt.zero_grad(); c_loss.backward(); c_opt.step()
                a_loss = -critic(bs, actor(bs)).mean()
                a_opt.zero_grad(); a_loss.backward(); a_opt.step()
                soft_update(actor_t, actor); soft_update(critic_t, critic)
        rets.append(tot)
    return rets

def run_sac(seed, episodes=150):
    # 6교시 SAC 코드(트윈 Q + 자동 alpha)를 함수로 감싸 rets를 반환하게
    # 만드세요 — 셋업 블록과 학습 루프를 그대로 옮기면 됩니다.
    raise NotImplementedError("6교시 SAC 코드를 함수로 감싸 넣으세요")

def band_plot(all_runs, label):
    arr = np.array(all_runs)             # (시드 3, 에피소드)
    m, sd = arr.mean(0), arr.std(0)
    x = np.arange(arr.shape[1])
    plt.plot(x, m, label=label)
    plt.fill_between(x, m - sd, m + sd, alpha=0.2)

band_plot([run_ddpg(sd) for sd in range(3)], "DDPG")
band_plot([run_sac(sd) for sd in range(3)], "SAC")
plt.xlabel("episode"); plt.ylabel("return")
plt.legend(); plt.title("Pendulum-v1: DDPG vs SAC (seed 3개 평균±표준편차)")
plt.show()
# 관찰 포인트: SAC 밴드(표준편차)가 좁게 유지되는가?
# noise_std를 0.05/0.1/0.3으로 바꿔 DDPG 민감도도 확인해 보세요`,
    },
  },
  {
    id: 6,
    difficulty: 4,
    importance: 4,
    level: '심화',
    title: 'TAC — 엔트로피 지수 q 실험',
    env: 'Pendulum-v1 (심화: HalfCheetah-v5)',
    goal: 'Tsallis 엔트로피의 q 값이 탐험 스타일과 성능에 주는 영향을 검증한다',
    reuse: '3일차 7교시 TAC 코드 (SAC에서 q-log 두 줄 교체본)',
    guide: [
      '먼저 q=1.0으로 SAC와 결과가 일치하는지 회귀 테스트 (필수!)',
      'q ∈ {1.0, 1.5, 2.0}으로 학습곡선 비교',
      '학습된 정책의 행동 분포 히스토그램을 q별로 비교 — q가 클수록 분포가 좁아지는가?',
      'Pendulum에서 차이가 작다면 왜 그런지(행동공간 크기) 생각해 보기',
    ],
    cert: 'q=1.0 ≒ SAC 검증 결과 + q별 학습곡선 비교 공유',
    stretch: ['고차원 행동 환경(HalfCheetah)에서 재실험 — q>1의 효과가 뚜렷해지는지'],
    skeleton: {
      filename: 'fill06_tac_q_experiment.py',
      source: `# 전제: 6교시 SAC 코드를 train_sac(entropic_index, seed) 함수로 감싸 둠
# 괄호채우기: ________ 를 채워 TAC를 완성하세요
import torch
import numpy as np
import matplotlib.pyplot as plt

def q_log_prob(log_prob, q):
    """log pi → log_q pi (q=1이면 SAC와 동일)"""
    if q is None or abs(q - 1.0) < 1e-6:
        return log_prob
    prob = log_prob.exp().clamp(min=1e-8)
    # 빈칸①: Tsallis q-logarithm — (prob의 (q-1)제곱 - 1) / (q - 1)
    return ________

# train_sac 내부 수정 지점 (SAC → TAC는 딱 두 줄):
#   ① soft TD 목표:
#      y = r + gamma * (1 - done) * ( q_next - alpha * ________ )   # 빈칸②
#   ② Actor 손실:
#      actor_loss = ( alpha * ________ - q_new ).mean()             # 빈칸③
#   (힌트: 두 빈칸 모두 q_log_prob(...)를 사용)

# ── 검증 순서 ──
# 1) q=1.0이 SAC와 같은 결과인지 회귀 테스트 (필수!)
r_sac = train_sac(entropic_index=None, seed=0)
r_q1 = train_sac(entropic_index=1.0, seed=0)
print("|평균 차이| =", abs(np.mean(r_sac[-20:]) - np.mean(r_q1[-20:])))

# 2) q별 학습곡선 비교
for q in [1.0, 1.5, 2.0]:
    runs = [train_sac(entropic_index=q, seed=sd) for sd in range(3)]
    plt.plot(np.mean(runs, axis=0), label=f"q={q}")
plt.legend(); plt.show()`,
    },
    solution: {
      filename: 'sol06_tac_q_experiment.py',
      source: `# 전제: 6교시 SAC 학습 코드를 train_sac(entropic_index, seed) 함수로
#        감싸 두었음 (에피소드 리턴 리스트 반환). 수정 지점은 두 곳뿐.
import torch
import numpy as np
import matplotlib.pyplot as plt

def q_log_prob(log_prob, q):
    """log pi → log_q pi (q=1이면 그대로 = SAC)"""
    if q is None or abs(q - 1.0) < 1e-6:
        return log_prob
    prob = log_prob.exp().clamp(min=1e-8)
    return (prob.pow(q - 1) - 1) / (q - 1)

# train_sac 내부에서 바꿀 두 곳:
#  ① soft TD 목표:  q_next - alpha * q_log_prob(logp_next, ENTROPIC_INDEX)
#  ② Actor 손실:    (alpha * q_log_prob(logp, ENTROPIC_INDEX) - q_new).mean()

# ── 실험 1: q=1.0 회귀 테스트 (SAC와 동일해야 함) ──
r_sac = train_sac(entropic_index=None, seed=0)   # 원본 SAC
r_q1 = train_sac(entropic_index=1.0, seed=0)     # TAC(q=1)
print("회귀 테스트 |평균 차이| =",
      abs(np.mean(r_sac[-20:]) - np.mean(r_q1[-20:])))   # 0 근처면 통과

# ── 실험 2: q별 학습곡선 (시드 3개 평균) ──
for q in [1.0, 1.5, 2.0]:
    runs = [train_sac(entropic_index=q, seed=sd) for sd in range(3)]
    plt.plot(np.mean(runs, axis=0), label=f"q={q}")
plt.xlabel("episode"); plt.ylabel("return"); plt.legend()
plt.title("TAC: entropic index q 비교")
plt.show()

# ── 실험 3: 행동 분포 히스토그램 (학습 완료된 actor 사용) ──
def action_hist(actor, label, n=3000):
    s = torch.randn(n, 3)                 # 임의 상태 배치
    with torch.no_grad():
        a, _ = actor(s)
    plt.hist(a.numpy().ravel(), bins=60, alpha=0.5, label=label, density=True)

# q별로 학습한 actor를 넣어 겹쳐 그리기 → q가 클수록 분포가 좁아지는지 확인
# action_hist(actor_q10, "q=1.0"); action_hist(actor_q20, "q=2.0")
# plt.legend(); plt.show()`,
    },
  },
  {
    id: 7,
    difficulty: 4,
    importance: 3,
    level: '심화',
    title: 'MountainCar — Sparse Reward 정복',
    env: 'MountainCar-v0',
    goal: '보상이 극도로 희소한 환경에서 탐험 전략의 한계와 해법을 체험한다',
    reuse: '2일차 4교시 DQN 코드에서 시작',
    guide: [
      '기본 DQN이 왜 실패하는지 확인 (정상 도달 전까지 보상 신호 전무)',
      '1단계 해법 — 보상 성형: 위치·속도 기반 보조 보상 추가 후 재학습',
      '2단계 해법 — 간이 curiosity: 다음 상태 예측 모델의 예측 오차를 내적 보상으로 추가',
      '두 해법의 학습 속도와 최종 정책 품질 비교',
    ],
    cert: '정상 도달 성공(평가 10회 중 8회 이상) + 사용한 해법 설명 공유',
    stretch: ['ICM 논문(arXiv 1705.05363) 구조로 curiosity 모듈 정식 구현'],
    skeleton: {
      filename: 'fill07_mountaincar_shaping_curiosity.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import random
from collections import deque

# 괄호채우기: ________ 를 채워 완성하세요 (탐험 보상 설계 2곳 + TD 목표)
MODE = "shaping"    # "none" / "shaping" / "curiosity"

env = gym.make("MountainCar-v0")
obs_dim, n_act = 2, 3

def make_net():
    return nn.Sequential(nn.Linear(obs_dim, 128), nn.ReLU(),
                         nn.Linear(128, 128), nn.ReLU(), nn.Linear(128, n_act))

q, q_t = make_net(), make_net()
q_t.load_state_dict(q.state_dict())
opt = torch.optim.Adam(q.parameters(), lr=1e-3)
buf = deque(maxlen=50_000)
gamma, batch, eps = 0.99, 64, 1.0

fwd = nn.Sequential(nn.Linear(obs_dim + 1, 64), nn.ReLU(), nn.Linear(64, obs_dim))
fwd_opt = torch.optim.Adam(fwd.parameters(), lr=1e-3)

def bonus(s, a, s2):
    if MODE == "shaping":
        # 빈칸①: 속도 기반 potential shaping
        #   힌트: 300 * (gamma * |s2의 속도| - |s의 속도|)  — 속도는 인덱스 1
        return ________
    if MODE == "curiosity":
        x = torch.as_tensor(np.append(s, a / 2.0), dtype=torch.float32)
        pred = fwd(x)
        target = torch.as_tensor(s2, dtype=torch.float32)
        err = nn.functional.mse_loss(pred, target)
        fwd_opt.zero_grad(); err.backward(); fwd_opt.step()
        # 빈칸②: "놀라움"을 내적 보상으로 — 예측오차(err)에 스케일 100
        return ________
    return 0.0

def train_step():
    s, a, r, s2, d = zip(*random.sample(buf, batch))
    s = torch.as_tensor(np.array(s), dtype=torch.float32)
    s2 = torch.as_tensor(np.array(s2), dtype=torch.float32)
    a = torch.as_tensor(a); r = torch.as_tensor(r, dtype=torch.float32)
    d = torch.as_tensor(d, dtype=torch.float32)
    qv = q(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        y = ________                        # 빈칸③: TD 목표 (타깃넷 q_t 사용)
    loss = nn.functional.smooth_l1_loss(qv, y)
    opt.zero_grad(); loss.backward(); opt.step()

for ep in range(500):
    s, _ = env.reset()
    done = False
    while not done:
        if np.random.rand() < eps:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = int(q(torch.as_tensor(s, dtype=torch.float32)).argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buf.append((s, a, r + bonus(s, a, s2), s2, float(term)))   # 성형된 보상 저장
        s = s2
        if len(buf) >= 1000:
            train_step()
    eps = max(0.05, eps * 0.995)
    if ep % 10 == 0:
        q_t.load_state_dict(q.state_dict())
    if term and s[0] >= 0.5 and ep % 20 == 0:
        print(f"정상 도달 중! ep {ep}")`,
    },
    solution: {
      filename: 'sol07_mountaincar_shaping_curiosity.py',
      source: `import gymnasium as gym
import torch
import torch.nn as nn
import numpy as np
import random
from collections import deque

# MODE: "none"(실패 확인용) / "shaping"(보상 성형) / "curiosity"(예측오차 보상)
MODE = "shaping"

env = gym.make("MountainCar-v0")
obs_dim, n_act = 2, 3

def make_net():
    return nn.Sequential(nn.Linear(obs_dim, 128), nn.ReLU(),
                         nn.Linear(128, 128), nn.ReLU(), nn.Linear(128, n_act))

q, q_t = make_net(), make_net()
q_t.load_state_dict(q.state_dict())
opt = torch.optim.Adam(q.parameters(), lr=1e-3)
buf = deque(maxlen=50_000)
gamma, batch, eps = 0.99, 64, 1.0

# 간이 curiosity: 다음 상태를 예측하는 forward 모델 (예측이 틀릴수록 보상)
fwd = nn.Sequential(nn.Linear(obs_dim + 1, 64), nn.ReLU(), nn.Linear(64, obs_dim))
fwd_opt = torch.optim.Adam(fwd.parameters(), lr=1e-3)

def bonus(s, a, s2):
    if MODE == "shaping":
        # 속도 기반 potential shaping — 빨라질수록 보너스 (최적 정책 보존형)
        return 300.0 * (gamma * abs(s2[1]) - abs(s[1]))
    if MODE == "curiosity":
        x = torch.as_tensor(np.append(s, a / 2.0), dtype=torch.float32)
        pred = fwd(x)
        target = torch.as_tensor(s2, dtype=torch.float32)
        err = nn.functional.mse_loss(pred, target)
        fwd_opt.zero_grad(); err.backward(); fwd_opt.step()   # 예측모델도 학습
        return 100.0 * float(err.detach())                     # 놀라움 = 내적 보상
    return 0.0

def train_step():
    s, a, r, s2, d = zip(*random.sample(buf, batch))
    s = torch.as_tensor(np.array(s), dtype=torch.float32)
    s2 = torch.as_tensor(np.array(s2), dtype=torch.float32)
    a = torch.as_tensor(a); r = torch.as_tensor(r, dtype=torch.float32)
    d = torch.as_tensor(d, dtype=torch.float32)
    qv = q(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        y = r + gamma * q_t(s2).max(1).values * (1 - d)
    loss = nn.functional.smooth_l1_loss(qv, y)
    opt.zero_grad(); loss.backward(); opt.step()

success = 0
for ep in range(500):
    s, _ = env.reset()
    done = False
    while not done:
        if np.random.rand() < eps:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = int(q(torch.as_tensor(s, dtype=torch.float32)).argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        buf.append((s, a, r + bonus(s, a, s2), s2, float(term)))
        s = s2
        if len(buf) >= 1000:
            train_step()
    eps = max(0.05, eps * 0.995)
    if ep % 10 == 0:
        q_t.load_state_dict(q.state_dict())
    if term and s[0] >= 0.5:
        success += 1
        if success == 1:
            print(f"첫 정상 도달! ep {ep}")

# ── 평가 10회 ──
wins = 0
for _ in range(10):
    s, _ = env.reset()
    done = False
    while not done:
        with torch.no_grad():
            a = int(q(torch.as_tensor(s, dtype=torch.float32)).argmax())
        s, r, term, trunc, _ = env.step(a)
        done = term or trunc
    wins += (term and s[0] >= 0.5)
print(f"평가 성공 {wins}/10   (8 이상 인증!)  MODE={MODE}")
# MODE="none"으로 바꿔 다시 돌리면 왜 실패하는지 체감할 수 있습니다`,
    },
  },
  {
    id: 8,
    difficulty: 5,
    importance: 3,
    level: '자유',
    title: '토이 프로젝트 — 나만의 강화학습 문제 풀기',
    env: '자유 (커스텀 Gym 환경 / Unity ML-Agents / Atari 등)',
    goal: '3일간 배운 알고리즘 중 하나를 골라 스스로 정의한 문제에 적용한다',
    reuse: '과정 전체 코드 중 자유 선택',
    guide: [
      '문제 정의: 상태·행동·보상을 직접 설계 (gymnasium.Env 상속 커스텀 환경 추천)',
      '알고리즘 선택 근거 정리 (이산/연속 행동, 보상 밀도 기준)',
      '학습 → 실패 원인 분석 → 보상·하이퍼파라미터 수정의 반복 과정을 기록',
      'Unity ML-Agents로 3D 환경을 만들면 시각적으로 인상적인 결과물이 됩니다',
    ],
    cert: '문제 정의 + 학습 결과(곡선/영상) + 시행착오 기록 공유',
    stretch: ['결과를 GitHub 리포로 정리해 포트폴리오화'],
    skeleton: {
      filename: 'fill08_custom_env_template.py',
      source: `# 커스텀 Gym 환경 괄호채우기 — "술래잡기 격자"
# ________ 를 채워 나만의 환경을 완성하세요
import gymnasium as gym
from gymnasium import spaces
import numpy as np

class GridChaseEnv(gym.Env):
    """상태: (내 r,c, 목표 r,c) / 행동: 상하좌우 / 보상: 잡으면 +10, 스텝 -0.1"""
    def __init__(self, size=5, max_steps=50):
        super().__init__()
        self.size, self.max_steps = size, max_steps
        # 빈칸①: 관측 공간 — 0~size-1 범위의 실수 4개 (spaces.Box 사용)
        self.observation_space = ________
        # 빈칸②: 행동 공간 — 상하좌우 4개 (spaces.Discrete 사용)
        self.action_space = ________

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.agent = self.np_random.integers(0, self.size, 2)
        self.target = self.np_random.integers(0, self.size, 2)
        self.steps = 0
        return self._obs(), {}

    def _obs(self):
        return np.concatenate([self.agent, self.target]).astype(np.float32)

    def step(self, action):
        move = [(-1, 0), (1, 0), (0, -1), (0, 1)][action]
        self.agent = np.clip(self.agent + move, 0, self.size - 1)
        if self.np_random.random() < 0.3:
            t = [(-1, 0), (1, 0), (0, -1), (0, 1)][self.np_random.integers(4)]
            self.target = np.clip(self.target + t, 0, self.size - 1)
        self.steps += 1
        caught = bool(np.array_equal(self.agent, self.target))
        reward = ________                    # 빈칸③: 잡으면 +10.0, 아니면 스텝 페널티 -0.1
        terminated = ________                # 빈칸④: 언제 에피소드가 "성공 종료"인가?
        truncated = self.steps >= self.max_steps
        return self._obs(), reward, terminated, truncated, {}

# ── 검증: 표 기반 Q-Learning ──
env = GridChaseEnv()
n_act = env.action_space.n
key = lambda obs: tuple(obs.astype(int))

Q = {}
rng = np.random.default_rng(0)
eps = 1.0
for ep in range(20000):
    s, _ = env.reset(seed=ep)
    done = False
    while not done:
        k = key(s)
        Q.setdefault(k, np.zeros(n_act))
        a = int(rng.integers(n_act)) if rng.random() < eps else int(Q[k].argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        k2 = key(s2)
        Q.setdefault(k2, np.zeros(n_act))
        # 빈칸⑤: Q-Learning 업데이트 (alpha=0.1, gamma=0.99)
        Q[k][a] += ________
        s = s2
    eps = max(0.05, eps * 0.9997)
print("학습 완료 — 평가 코드를 붙여 성공률을 확인하세요")`,
    },
    solution: {
      filename: 'sol08_custom_env_template.py',
      source: `# 커스텀 Gym 환경 템플릿 — "술래잡기 격자" 예시
# 에이전트(A)가 도망다니는 목표(T)를 잡는 5x5 그리드
import gymnasium as gym
from gymnasium import spaces
import numpy as np

class GridChaseEnv(gym.Env):
    """상태: (내 r,c, 목표 r,c) / 행동: 상하좌우 / 보상: 잡으면 +10, 스텝 -0.1"""
    def __init__(self, size=5, max_steps=50):
        super().__init__()
        self.size, self.max_steps = size, max_steps
        self.observation_space = spaces.Box(0, size - 1, shape=(4,), dtype=np.float32)
        self.action_space = spaces.Discrete(4)

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.agent = self.np_random.integers(0, self.size, 2)
        self.target = self.np_random.integers(0, self.size, 2)
        self.steps = 0
        return self._obs(), {}

    def _obs(self):
        return np.concatenate([self.agent, self.target]).astype(np.float32)

    def step(self, action):
        move = [(-1, 0), (1, 0), (0, -1), (0, 1)][action]
        self.agent = np.clip(self.agent + move, 0, self.size - 1)
        # 목표는 30% 확률로 무작위 도망
        if self.np_random.random() < 0.3:
            t = [(-1, 0), (1, 0), (0, -1), (0, 1)][self.np_random.integers(4)]
            self.target = np.clip(self.target + t, 0, self.size - 1)
        self.steps += 1
        caught = bool(np.array_equal(self.agent, self.target))
        reward = 10.0 if caught else -0.1
        return self._obs(), reward, caught, self.steps >= self.max_steps, {}

# ── 만든 환경을 표 기반 Q-Learning으로 빠르게 검증 ──
env = GridChaseEnv()
n_act = env.action_space.n

def key(obs):   # 격자 좌표라 정수 튜플을 테이블 키로 사용
    return tuple(obs.astype(int))

Q = {}
rng = np.random.default_rng(0)
eps = 1.0
for ep in range(20000):
    s, _ = env.reset(seed=ep)
    done = False
    while not done:
        k = key(s)
        Q.setdefault(k, np.zeros(n_act))
        a = int(rng.integers(n_act)) if rng.random() < eps else int(Q[k].argmax())
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        k2 = key(s2)
        Q.setdefault(k2, np.zeros(n_act))
        Q[k][a] += 0.1 * (r + 0.99 * Q[k2].max() * (not done) - Q[k][a])
        s = s2
    eps = max(0.05, eps * 0.9997)

# ── 평가 ──
wins = 0
for i in range(100):
    s, _ = env.reset(seed=90000 + i)
    done = False
    while not done:
        a = int(Q.get(key(s), np.zeros(n_act)).argmax())
        s, r, term, trunc, _ = env.step(a)
        done = term or trunc
    wins += term
print(f"잡기 성공률: {wins}%")
# 다음 단계: 보상·규칙을 바꿔 보고, DQN(2일차 코드)으로 교체해 보세요`,
    },
  },
]
