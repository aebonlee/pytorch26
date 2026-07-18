// ============================================================
// OG 이미지 생성 스크립트 (1200×630) — sharp 기반
// ------------------------------------------------------------
// 실행:  npm run og-image        (사전 1회: npm i -D sharp)
// 출력:  public/og-image.png
//
// 다른 사이트에 재사용할 때는 이 파일을 scripts/로 복사한 뒤
// 아래 CONFIG 객체만 그 사이트에 맞게 수정하면 된다.
// (배경·로고 모티프까지 바꾸려면 buildSvg()의 SVG를 수정)
//
// ※ sharp는 devDependencies에 넣지 않고 필요할 때만 설치한다
//    — CI(Actions) 설치 용량을 늘리지 않기 위함. 스크립트가
//    sharp 부재를 감지하면 설치 안내를 출력하고 종료한다.
// ※ 한글 폰트는 Apple SD Gothic Neo(맥 시스템 폰트) 지정 —
//    sharp(librsvg)가 시스템 폰트를 정상 렌더링함(실측 확인).
// ============================================================

const CONFIG = {
  // 상단 소형 라벨 (영문 권장, letter-spacing 들어감)
  badge: 'MULTICAMPUS · 3-DAY COURSE',
  // 메인 타이틀 — 줄 단위 배열 (1~2줄 권장, 86px)
  titleLines: ['PyTorch로 배우는', '강화학습'],
  // 서브 문구 (32px 한 줄)
  subtitle: 'MDP · DQN · A2C · DDPG · SAC — 3일 21시간 집중 구현',
  // 하단 좌/우 정보
  footerLeft: 'pytorch26.dreamitbiz.com',
  footerRight: '2026.07.27 ~ 07.29 · 역삼캠퍼스',
  // 시그니처 컬러 (이 사이트는 파이토치 오렌지 고정)
  accent: '#EE4C2C',
  // 출력 경로
  out: 'public/og-image.png',
}

const FONT = 'Apple SD Gothic Neo, AppleGothic, sans-serif'

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildSvg(c) {
  // 타이틀 줄들 (y=255부터 105px 간격)
  const titles = c.titleLines
    .map((line, i) =>
      `<text x="76" y="${255 + i * 105}" font-family="${FONT}" font-size="86" font-weight="900" fill="#ffffff">${esc(line)}</text>`)
    .join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="82%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161d29"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- 파이토치 로고 모티프 (원호 + 점) 우측 -->
  <g transform="translate(985, 200)">
    <circle cx="0" cy="35" r="95" fill="none" stroke="${c.accent}" stroke-width="34" opacity="0.95"/>
    <circle cx="52" cy="-62" r="24" fill="${c.accent}"/>
    <circle cx="0" cy="35" r="150" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.25"/>
  </g>

  <text x="80" y="150" font-family="${FONT}" font-size="30" font-weight="700" fill="${c.accent}" letter-spacing="6">${esc(c.badge)}</text>
  ${titles}
  <text x="80" y="435" font-family="${FONT}" font-size="32" font-weight="600" fill="#9fb0c3">${esc(c.subtitle)}</text>

  <rect x="80" y="500" width="640" height="4" rx="2" fill="${c.accent}"/>
  <text x="80" y="560" font-family="${FONT}" font-size="28" font-weight="700" fill="#e6edf3">${esc(c.footerLeft)}</text>
  <text x="530" y="560" font-family="${FONT}" font-size="28" font-weight="500" fill="#9fb0c3">${esc(c.footerRight)}</text>
</svg>`
}

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('sharp가 없습니다. 먼저 실행하세요:  npm i -D sharp')
  process.exit(1)
}

const svg = buildSvg(CONFIG)
const info = await sharp(Buffer.from(svg), { density: 96 })
  .resize(1200, 630)
  .png()
  .toFile(CONFIG.out)

console.log(`✓ ${CONFIG.out} 생성 완료 — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)}KB`)
