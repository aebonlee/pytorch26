# 25. OG 이미지 + canonical + robots 메타 추가 (2026-07-18)

## 배경
대표 지시: **모든 신규 사이트는 OG 이미지 + canonical + robots 메타 필수** (전역 CLAUDE.md 4장에 규칙 등재).
카카오톡 공유 미리보기 검증 도구: https://developers.kakao.com/tool/debugger/sharing

## 한 일
1. **OG 이미지 제작** — `public/og-image.png` (1200×630, 119KB)
   - 다크 네이비 배경 + 파이토치 오렌지(#EE4C2C) 로고 모티프(원호+점) + 타이틀/키워드/도메인/일정
   - 원본 SVG는 `Dev_md/og-image-source.svg` 보관 — 수정 시 SVG 고쳐서 재변환
   - 변환법: scratchpad에 **sharp 임시 설치** 후
     `sharp('og.svg',{density:96}).resize(1200,630).png().toFile('og-image.png')`
   - ※ qlmanage 썸네일은 1200×1200 정사각으로 나와 부적합(패딩 crop 필요) — sharp가 정답
   - ※ SVG 안 한글 폰트는 Apple SD Gothic Neo 지정 — sharp(librsvg)가 시스템 폰트 정상 렌더링 확인
2. **index.html 메타 보강**
   - `<link rel="canonical" href="https://pytorch26.dreamitbiz.com/">`
   - `<meta name="robots" content="index, follow">`
   - OG 세트 완성: 기존 title/description/type/url + **og:site_name, og:image(절대 URL), og:image:width/height**
   - twitter:card(summary_large_image) 세트 추가
3. 빌드 → dist/og-image.png 포함 확인 → 커밋·푸시 → Actions 배포

## 남은 일
- 카카오 디버거에서 캐시 초기화 후 미리보기 확인은 대표 몫
- 기존 사이트들(120여 개)에 소급 적용은 별도 지시 시 진행
