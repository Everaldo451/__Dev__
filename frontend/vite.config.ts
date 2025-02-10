import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const PORT = !isNaN(Number(env.PORT))?Number(env.PORT):5173

  return {
    plugins: [react()],
    server: {
      host: env.HOST,
      port: PORT,

      proxy: {
        '/api': {
          target: `http://${env.API_DOMAIN}:${env.API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    }
  }
  
})

