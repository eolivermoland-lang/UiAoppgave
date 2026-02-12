import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/twilio': {
        target: 'https://verify.twilio.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twilio/, ''),
        secure: true
      }
    }
  }
});
