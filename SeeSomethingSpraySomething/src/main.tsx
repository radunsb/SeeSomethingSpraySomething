import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Controller from './Controller.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Controller />
  </StrictMode>,
)
