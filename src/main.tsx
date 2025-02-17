import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import Project from './Project.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Results from './Results.tsx';
import {createProjectMap, listUserProjects} from './utility/ProjectUtilities.ts';
import {UtilityInterfaces, Models} from './utility/models.ts'

async function getUserProjectStubs(userID: number){
  const userProjects = await listUserProjects(userID);
  return userProjects;
}

async function loadDefaultProject(){
  //Default Map is always User with id of 1's first project
  const defaultMap = await createProjectMap(1, 0);
  const projects = await getUserProjectStubs(1);

  createRoot(document.getElementById('root')!).render(
    <CustomAppRouting defaultMap={defaultMap} projects={projects}/>
  )
}


interface CARprops{
  defaultMap : Map<string, UtilityInterfaces.Parameter>;
  projects : Models.ProjectBase[];
}
function CustomAppRouting({defaultMap, projects} : CARprops){
  const uidState = useState(1);
  const projectState = useState(projects);
  return (
    // <StrictMode>
    //   <App />
    //   <Project userID={1} />
    // </StrictMode>,
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<App parameters={defaultMap} owned={false} projectState={projectState} userIDstate={uidState}/>} />
      <Route path="/:pid" element={<App parameters={defaultMap} owned={false} projectState={projectState} userIDstate={uidState}/>} />
      <Route path="/results/:pid" element={<Results params={defaultMap} />} />
      <Route path="/parameters" element={<Project userID={1} />} />
    </Routes>
  </BrowserRouter>
  )
}

loadDefaultProject();