import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import html from '@rollup/plugin-html';

export default defineConfig({
  plugins: [react()],
  plugins: [html()]
})