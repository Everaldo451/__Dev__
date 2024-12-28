import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

console.log("HOST", process.env.HOST)

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode,process.cwd(),'')

  return {
    plugins: [react()],
    server: {
      host: env.HOST,
      port: env.PORT,

      proxy: {
        '/api': {
          target: `${env.API_PROTOCOL}://${env.API_DOMAIN}:${env.API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    }
  }
  
})

