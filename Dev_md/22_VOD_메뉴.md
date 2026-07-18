# 22. VOD 메뉴 (2026-07-18)

## 구성 (/vod, data/vod.js + VodPage.jsx — 메뉴 맨 끝, 심화학습 다음)

1. **과정 다시보기** — courseVods 배열이 비어 있으면 "준비 중" 안내 카드.
   대표 강의 촬영본/보충 영상이 생기면 { day, title, youtubeId, desc }만 추가하면 16:9 임베드 그리드로 자동 표시.
   youtubeId = 유튜브 주소 v= 뒤 11자리.
2. **추천 강의 영상** — 임베드 2건(3Blue1Brown 신경망, David Silver RL Lecture 1) + 링크 카드 4건(파이토치 한국사용자모임, Spinning Up, Silver 전체 재생목록, ML-Agents).
   youtubeId 있으면 임베드, url만 있으면 링크 카드로 렌더링되는 공용 VideoCard.

- CSS: .vod-grid(300px 반응 그리드), .vod-frame(16:9 패딩 트릭), iframe lazy 로딩
- 사이드바 책갈피 2개 섹션
