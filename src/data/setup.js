// ============================================================
// 환경설정 데이터 (/setup — 선수학습 다음 메뉴)
// ------------------------------------------------------------
// 기존 선수학습 5번 "실습 환경 준비"를 독립 메뉴로 승격·확장한
// 것 (2026-07-17 대표 지시). 이전 과정 패들렛의 "코딩 환경 설정"
// 섹션 내용(아나콘다·Colab·VS Code)을 반영했다.
// 스키마: { id, title, difficulty(1~5), importance(1~5),
//           body(인라인 md: **볼드**·==형광펜==·`코드`),
//           code?: { filename, source }, resources?: [{title,url}] }
// body의 \n은 pre-line으로 렌더링 — 문장 단위 줄바꿈 규칙 준수.
// ============================================================
export default [
  {
    id: 'python',
    title: '파이썬 & 아나콘다 설치',
    difficulty: 1,
    importance: 5,
    body: `실습에는 ==Python 3.10 이상==이 필요합니다.
개별 설치보다 **아나콘다(Anaconda) 배포판**을 추천합니다 — 파이썬과 필수 과학 패키지가 한 번에 설치됩니다.
설치 과정에서 **"Add Anaconda to my PATH environment variable"** 옵션을 체크하면 터미널 어디서든 바로 사용할 수 있어 편리합니다.
설치 후에는 ==과정 전용 가상환경을 분리==해 두는 것이 좋습니다 — 다른 프로젝트와 패키지 버전이 섞이지 않습니다.`,
    code: {
      filename: 'conda_env.sh',
      source: `# 과정 전용 가상환경 만들기 (이름: rl, 파이썬 3.10)
conda create -n rl python=3.10 -y

# 활성화 / 비활성화
conda activate rl
conda deactivate

# 만들어 둔 가상환경 목록 확인
conda env list`,
    },
    resources: [
      { title: '아나콘다 다운로드', url: 'https://www.anaconda.com/download' },
    ],
  },
  {
    id: 'libs',
    title: '필수 라이브러리 설치',
    difficulty: 1,
    importance: 5,
    body: `이번 과정의 필수 라이브러리는 ==torch · gymnasium · numpy 3종==이 전부입니다.
**GPU는 없어도 됩니다** — 3일 과정의 모든 실습은 CPU로 충분히 돌아갑니다.
GPU가 있는 PC에서 CUDA 가속을 쓰고 싶다면, **pytorch.org 설치 셀렉터**에서 OS·CUDA 버전을 선택해 나오는 명령을 그대로 복사해 설치하세요 (CUDA·cuDNN 버전 궁합이 중요합니다).`,
    code: {
      filename: 'install.sh',
      source: `# 필수 3종 설치 (CPU 기준 — 이번 과정은 이것으로 충분)
pip install torch gymnasium numpy

# (선택) 심화 도전과제용 MuJoCo 환경
pip install "gymnasium[mujoco]"

# (선택) 학습곡선 그래프용
pip install matplotlib`,
    },
    resources: [
      { title: 'PyTorch 설치 셀렉터 (공식)', url: 'https://pytorch.org/get-started/locally/' },
    ],
  },
  {
    id: 'check',
    title: '설치 확인',
    difficulty: 1,
    importance: 5,
    body: `아래 코드가 ==에러 없이 실행되면 실습 준비 완료==입니다.
수업 전날 꼭 한 번 돌려 보세요 — 강의 당일 설치 문제로 시간을 잃는 것이 가장 아깝습니다.`,
    code: {
      filename: 'env_check.py',
      source: `# 설치 확인 — 아래가 에러 없이 실행되면 준비 완료
import torch
import gymnasium as gym
import numpy as np

print("PyTorch:", torch.__version__)
print("Gymnasium:", gym.__version__)
print("NumPy:", np.__version__)

env = gym.make("CartPole-v1")
obs, _ = env.reset(seed=0)
print("CartPole 관측:", obs)          # 4개 숫자가 나오면 성공

x = torch.rand(5, 3)
print(x)                              # 랜덤 텐서가 출력되면 성공

# GPU(CUDA) 사용 가능 여부 확인 — 없어도 이번 과정은 CPU로 충분
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")`,
    },
    resources: [],
  },
  {
    id: 'colab',
    title: 'Google Colab으로 실습하기',
    difficulty: 2,
    importance: 4,
    body: `로컬 설치가 어렵다면 ==브라우저만으로 Google Colab에서 전체 실습이 가능==합니다.
**torch와 numpy는 Colab에 기본 내장**되어 있고, gymnasium만 설치하면 됩니다.
실습 코드를 .py 모듈로 나눠서 쓸 때는 **구글 드라이브를 마운트**하고 경로를 추가하면 import할 수 있습니다.`,
    code: {
      filename: 'colab_setup.py',
      source: `# Colab 첫 셀에서 실행
!pip install gymnasium

# ── .py 모듈을 나눠 쓸 때: 드라이브 마운트 후 경로 추가 ──
from google.colab import drive
drive.mount('/content/drive')

import sys
sys.path.append('/content/drive/MyDrive/pytorch26')   # .py를 둔 폴더
# import my_module   # 이제 같은 폴더의 .py를 import 가능

# 또는 작업 폴더 자체를 옮기는 방법
import os
os.chdir('/content/drive/MyDrive/pytorch26')`,
    },
    resources: [
      { title: 'Google Colab', url: 'https://colab.research.google.com/' },
    ],
  },
  {
    id: 'vscode',
    title: 'VS Code 권장 설정',
    difficulty: 1,
    importance: 3,
    body: `에디터는 자유지만, 수업은 **VS Code** 기준으로 진행합니다.
확장(Extensions)에서 ==Python 확장과 Korean Language Pack==을 설치하면 수업 화면과 같은 환경이 됩니다.
프로젝터 화면이 잘 안 보일 때는 **[설정 → Color Theme]** 에서 밝은 테마(Light)로 바꾸면 가독성이 좋아집니다.`,
    code: null,
    resources: [
      { title: 'VS Code 다운로드', url: 'https://code.visualstudio.com/' },
      { title: 'Python 확장 (Marketplace)', url: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python' },
      { title: 'Korean Language Pack', url: 'https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko' },
    ],
  },
]
