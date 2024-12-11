//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Project from './Project.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Results from './Results.tsx';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  //   <Project userID={1} />
  // </StrictMode>,
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/results" element={<Results />} />
    <Route path="/parameters" element={<Project userID={1} />} />
  </Routes>
</BrowserRouter>
)
