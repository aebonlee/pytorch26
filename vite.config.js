import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(pytorch26.dreamitbiz.com) 배포 — base가 '/pytorch26/'이면 자산 404로 빈 화면
export default defineConfig({
  plugins: [react()],
  base: '/',
})
