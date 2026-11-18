import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Endereços do túnel da Cloudflare (npx cloudflared tunnel ...), usado para testar no celular
// com https. O Vite bloqueia qualquer endereço que não seja localhost se não estiver aqui.
const tunel = ['.trycloudflare.com']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: tunel },
  preview: { allowedHosts: tunel },
})
