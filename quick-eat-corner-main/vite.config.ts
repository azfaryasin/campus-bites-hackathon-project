import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/campus-bites-hackathon-project/', // 👈 Add this line
  plugins: [react()],
});
