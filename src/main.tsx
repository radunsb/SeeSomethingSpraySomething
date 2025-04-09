import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import Print from './Print.tsx'
import { ResetPasswordPostLink } from './Modals.tsx'
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
  document.getElementById("initialLoader")?.remove();
  createRoot(document.getElementById('root')!).render(
    <CustomAppRouting defaultMap={defaultMap} projects={projects}/>
  )
}


interface CARprops{
  defaultMap : Map<string, UtilityInterfaces.Parameter>;
  projects : Models.ProjectBase[];
}

export function CustomAppRouting({defaultMap, projects} : CARprops){
  const uidState = useState(1);
  const usernameState = useState("");
  const emailState = useState("");
  const userState = {idState:uidState, unState:usernameState, emailState:emailState};

  const projectState = useState(projects);
  const projectMap = useState(defaultMap);

  //I know adding more and more parameters here is bad.
  //this needs to get folded into project state or project map,
  //but there isn't time before the deadline to get that done and tested
  const [timingMode, _setTimingMode] = useState("auto");

  return (
    <> 
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App parameters={projectMap} projectState={projectState} userState={userState}/>} />
      <Route path="/results/" element={<Results params={projectMap} timingMode={timingMode}/>} />
      <Route path="/print" element={<Print parameters={projectMap} />} />
      <Route path="/reset_password" element={< ResetPasswordPostLink isOpen={true} setIsOpen={()=>{}} setUserInfo={()=>{}}/>} />
    </Routes>
  </BrowserRouter>
  </>
  )
}
loadDefaultProject();