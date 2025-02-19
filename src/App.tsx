/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/App.css';
import { NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers.tsx';
import { SignIn, Profile, Documentation, SaveLoad, CreateAccount, ResetPassword, Info } from './Modals.tsx';
import { NavLink, Link } from "react-router";
import { useState, useEffect } from "react";
import { Models } from './utility/models';
import { useParams, useNavigate} from 'react-router';
import { createProjectMap } from './utility/ProjectUtilities.ts';
import { UtilityInterfaces } from "./utility/models";
import { saveProject } from "./utility/ProjectUtilities";
import MainScreenVisual from './MainScreenVisual';

import { getOrException } from "./utility/ProjectUtilities.ts"

interface AppProps{
  parameters: Map<string, UtilityInterfaces.Parameter>;
  owned: boolean;
  projects: Models.ProjectBase[];
}

//Props: Render the app with a specific set of parameters that are determined beforehand
//This keeps it from resetting them when navigating react router, and it will
//be easier to work in loading saved projects
export default function App({parameters, owned, projects}: AppProps) {
  const [isNozzleDrawerOpen, setIsNozzleDrawerOpen] = useState(false);
  const [isControllerDrawerOpen, setIsControllerDrawerOpen] = useState(false);
  const [isLineDrawerOpen, setIsLineDrawerOpen] = useState(false);
  //Map of parameter names -> parameter values. Updates on event of input field changing
  const [parameterMap, setParameterMap] = useState(parameters);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const { pid } = useParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  //Method for transfering info abour selectedId to the Modal
  const handleOpenInfo = (id: number) => {
    setSelectedId(id);
    setIsInfoOpen(true);
  }
  
  useEffect(() => {
    async function loadMap(){
      if(pid){
        const loadedMap = await createProjectMap(1, Number(pid));
      await setParameterMap(loadedMap);
      changeParameterList(loadedMap);
      for(const [key, value] of loadedMap){
        const inputElement: HTMLInputElement|null = document.querySelector("#" + key + "_input");
        if(inputElement){
          inputElement.defaultValue = String(value.value);
        }   
      }
      }
      else{
        for(const [key, value] of parameterMap){
          const inputElement: HTMLInputElement|null = document.querySelector("#" + key + "_input");
          if(inputElement){
            inputElement.defaultValue = String(value.value);
          }   
        }
      }
    }
    loadMap();
  }, [pid])

  function loadProject(params: Map<string, UtilityInterfaces.Parameter>){
    setParameterMap(params);
    for(const [key, value] of params){
      const inputElement: HTMLInputElement|null = document.querySelector("#" + key + "_input");
      if(inputElement){
        inputElement.defaultValue = String(value.value);
      }   
    }
  }
  const navigate = useNavigate();
  async function save(){
    await saveProject(1, parameterMap)
    navigate('/results/'+getOrException(parameterMap, "project_id").value);
  }
  
  //Construct a list of the parameters and the values given
  //to App.tsx as props
  //parameterList is the list of HTML elements that are rendered in the drawers for
  //each parameter. it may be desirable to make a separate list for each drawer.
  let parameterList: any[] = []; 
  changeParameterList(parameterMap);  
  const parameterInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(".parameter_input");
  for(const parameterInput of parameterInputs){
    parameterInput.addEventListener("change", () => {
      const key = parameterInput.id.replace("_input", "");
      const currentParameter = parameterMap.get(key);
      //Type of value can be either string or number
      let newVal: string|number;
      //Should always be true since a project should always be loaded
      if(currentParameter){
        if(currentParameter.type != UtilityInterfaces.types.STRING){
          newVal = Number(parameterInput.value)
        }
        else{
          newVal = parameterInput.value;
        }
        currentParameter.value = newVal;
        setParameterMap(parameterMap.set(key, currentParameter));
        parameterInput.value = String(newVal);
      }
    });
  }
  
  function changeParameterList(tempMap: Map<string, UtilityInterfaces.Parameter>){
    parameterList = [];
    for(const [key, value] of tempMap){
      //Make a text input field for string parameters
      if(value.type==UtilityInterfaces.types.STRING){
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key}</p>
            <input className="parameter_input" id={key + "_input"} type="text"></input>
          </li>
        );
      }
      //Make a number input field for integer or float parameters
      else{
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key}</p>
            <input className="parameter_input" id={key + "_input"} type="number"></input>
          </li>
        );
      }
    }
  }

// ParameterList Indexes
// 0 = Duty Cycle, 1 = Fluid Pressure , 2 = Last Date Modified, 3= Line Speed, 4= Line Width, 5= Nozzle Count, 
// 6 = Nozzle Height, 7 = Nozzle Spacing, 8 = Owner ID, 9 = Product Height, 10 = Product Length,
// 11 = Product Width, 12 = Project Desc., 13 = Project ID , 14 = Project Name, 15 = Sensor Distance, 
// 16 = Spray Duration, 17 = Start Delay, 18 = Stop Delay, 19 = Angle, 20 = Flow Rate,
// 21 = Nozz Doc Link, 22 = Nozzle ID, 23 = Nozzle Name, 24 = Spray Shape, 25 = Twist Angle, 
// 26 = Controller Doc Link, 27 = Controller ID, 28 = Controller Name, 29 = Gun ID, 30 = Gun Name , 31 = Max Frequency

// Reset Password Modal and Forget Password Modal are for testing purposes only, and will be removed once links work correctly
  return (
    // THIS IS THE PARENT DIV TO CONTAIN EVERYTHING
    <div id='pageContainer'>

      {/* THIS DIV IS FOR THE DRAWERS */}
      <div id='drawers'>
        {/* NOZZLE DRAWER */}
        <button onClick={() => setIsNozzleDrawerOpen(true)}
        aria-expanded={isNozzleDrawerOpen}
        aria-controls="nozzleDrawer">Nozzle</button>
        <NozzleDrawer isOpen={isNozzleDrawerOpen} onClose={() => setIsNozzleDrawerOpen(false)}>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[23]} <button onClick={() => {handleOpenInfo(23)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Name">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[20]} <button onClick={() => {handleOpenInfo(20)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Flow Rate">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[19]} <button onClick={() => {handleOpenInfo(19)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Angle">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[6]} <button onClick={() => {handleOpenInfo(6)}}
                      aria-expanded={isInfoOpen}
                      aria-controls="Nozzle Height">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[5]} <button onClick={() => {handleOpenInfo(5)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Spacing">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[7]} <button onClick={() => {handleOpenInfo(7)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Count">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[1]} <button onClick={() => {handleOpenInfo(1)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Fluid Pressure">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[25]} <button onClick={() => {handleOpenInfo(25)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Twist Angle">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[24]} <button onClick={() => {handleOpenInfo(24)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Shape">Info</button></div>
        </NozzleDrawer>

        {/* LINE DRAWER */}
        <button onClick={() => setIsLineDrawerOpen(true)}
        aria-expanded={isLineDrawerOpen}
        aria-controls="lineDrawer">Line</button>
        <LineDrawer isOpen={isLineDrawerOpen} onClose={() => setIsLineDrawerOpen(false)}>
        <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[3]} <button onClick={() => {handleOpenInfo(3)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Speed">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[4]} <button onClick={() => {handleOpenInfo(4)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Width">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[9]} <button onClick={() => {handleOpenInfo(9)}}                   
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Height">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[10]} <button onClick={() => {handleOpenInfo(10)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Length">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[11]} <button onClick={() => {handleOpenInfo(11)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Width">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[15]} <button onClick={() => {handleOpenInfo(15)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Sensor Distance">Info</button></div>
        </LineDrawer>

        {/* CONTROLLER DRAWER */}
        <button onClick={() => setIsControllerDrawerOpen(true)}
        aria-expanded={isControllerDrawerOpen}
        aria-controls="controllerDrawer">Controller</button>
        <ControllerDrawer isOpen={isControllerDrawerOpen} onClose={() => setIsControllerDrawerOpen(false)}>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[17]} <button onClick={() => {handleOpenInfo(17)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Start Delay">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[18]} <button onClick={() => {handleOpenInfo(18)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Stop Delay">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[16]} <button onClick={() => {handleOpenInfo(16)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Duration">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[27]} <button onClick={() => {handleOpenInfo(27)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Id">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[28]} <button onClick={() => {handleOpenInfo(28)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Name">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[31]} <button onClick={() => {handleOpenInfo(31)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Max Frequency">Info</button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[0]} <button onClick={() => {handleOpenInfo(0)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Duty Cycle">Info</button></div>
        </ControllerDrawer>
        {isInfoOpen && <Info isOpen = {isInfoOpen} setIsOpen={setIsInfoOpen} selectedId={selectedId}/>}
      </div>

      {/* THIS DIV IS FOR THE MODALS ON THE RIGHT SIDE */}
      <div id='navigation'>
        {/* SIGN IN / PROFILE */}
        <button className= "primaryBtn" onClick={() => setIsSignInOpen(true)}
        aria-expanded={isSignInOpen}
        aria-controls="SignIn/ProfileModal">
          Sign In
        </button>
        {isSignInOpen && <SignIn isOpen = {isSignInOpen} setIsLIOpen={setIsSignInOpen} setIsCAOpen={setIsCreateAccountOpen} />}
        {isCreateAccountOpen && <CreateAccount isOpen = {isCreateAccountOpen} setIsCAOpen={setIsCreateAccountOpen} setIsLIOpen={setIsSignInOpen} />}
        {isResetPasswordOpen && <ResetPassword isOpen={isResetPasswordOpen} setIsOpen={setIsResetPasswordOpen}/>}
        {isProfileOpen && <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen}/>}

        {/* DOCUMENTATION */}
        <button className= "primaryBtn" onClick={() => setIsDocumentationOpen(true)}
        aria-expanded={isDocumentationOpen}
        aria-controls="DocumentationModal">
          Documentation
        </button>
        {isDocumentationOpen && <Documentation isOpen = {isDocumentationOpen} setIsOpen={setIsDocumentationOpen} />}
        
        {/* SAVE/LOAD */}
        <button className= "primaryBtn" onClick={() => setIsSaveLoadOpen(true)}
        aria-expanded={isSaveLoadOpen}
        aria-controls="SaveLoadModal">
          Save Load
        </button>
        {isSaveLoadOpen && <SaveLoad isOpen = {isSaveLoadOpen} setIsOpen={setIsSaveLoadOpen} projects={projects} parameterMap={parameterMap} onLoad={loadProject}/>}
      </div>

      {/* THIS DIV IS FOR THE SIMULATION */}
      <div id='sprayModel'>
        {/* PROJECT NAME */}
        <h1 id='projectName'>{getOrException(parameterMap, "project_name").value}</h1>
        {/* 3D MODEL */}
        <MainScreenVisual parameterMap={parameterMap}/>
      </div>

      {/* THIS DIV IS FOR THE BUTTON TO SEE THE RESULTS */}
      <div id='results'>
        {/* RESULTS */}
          <button onClick={save}> See Results </button>
      </div>
    </div>
  );
}
