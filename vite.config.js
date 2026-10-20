import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/food-app-repo/', // <-- আপনার রেপোজিটোরির নাম অনুযায়ী দিবেন
})