import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/food-app-repo/', 
  build: {
    outDir: 'docs', // GitHub Pages-এর জন্য docs ফোল্ডারে বিল্ড ফাইল তৈরি করবে
  },
})