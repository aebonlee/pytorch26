import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// aebonlee.github.io/pytorch26/ 프로젝트 페이지 배포 — 커스텀 도메인 전환 시 base를 '/'로 변경
export default defineConfig({
  plugins: [react()],
  base: '/pytorch26/',
})
