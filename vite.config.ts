import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/campus-bites-hackathon-project/',
  plugins: [react()],
})
