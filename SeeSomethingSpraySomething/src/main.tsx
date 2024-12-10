import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Project from './Project.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Project userID={1} />
  </StrictMode>,
)
