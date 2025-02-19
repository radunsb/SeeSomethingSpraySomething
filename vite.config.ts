import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {getFrontEndHost, getFrontEndPort, getBackEndURL} from './backend/ProgramSetup'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: getFrontEndHost(),
    port: getFrontEndPort(),
  },
  define: {
    __BACKEND_URL__: JSON.stringify(getBackEndURL()),
  }
})
