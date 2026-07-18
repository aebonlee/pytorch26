import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(pytorch26.dreamitbiz.com) 배포 — base가 '/pytorch26/'이면 자산 404로 빈 화면
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Vite 8 기본 타깃(최신 baseline)은 구형 데스크톱 크롬에서 화면이 멈춤
    // (2026-07-19 사고: 맥북 정상·타 데스크톱 크롬 빈 화면, 콘솔 무에러).
    // 강의장 PC 사양을 통제할 수 없으므로 Chrome 87 수준까지 내려서 빌드한다.
    target: ['chrome87', 'edge88', 'firefox78', 'safari14'],
    cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'],
  },
})
