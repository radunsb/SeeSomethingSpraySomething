//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import Project from './Project.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Results from './Results.tsx';
import {createProjectMap, listUserProjects} from './utility/ProjectUtilities.ts';
import {UtilityInterfaces} from './utility/models.ts'
import { lessThan } from 'three/src/nodes/TSL.js';

//Startup to load the default Project
let defaultMap: Map<string, UtilityInterfaces.Parameter>;

async function getUserProjectStubs(userID: number){
  const userProjects = await listUserProjects(userID);
  return userProjects;
}

async function loadDefaultProject(){
  //Default Map is always User with id of 1's first project
  
  defaultMap = await createProjectMap(1, 0);
  const projects = await getUserProjectStubs(1);
  createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    //   <App />
    //   <Project userID={1} />
    // </StrictMode>,
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App parameters={defaultMap} owned={false} projects={projects}/>} />
      <Route path="/results" element={<Results params={defaultMap} />} />
      <Route path="/parameters" element={<Project userID={1} />} />
    </Routes>
  </BrowserRouter>
  )
}
loadDefaultProject();

