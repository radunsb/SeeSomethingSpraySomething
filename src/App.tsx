/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/App.css';
import { NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers.tsx';
import { SignIn, Profile, Documentation, SaveLoad, CreateAccount, ResetPassword, Info } from './Modals.tsx';
import { NavLink, Link } from "react-router";
import { useState, useEffect } from "react";
import { Models } from './utility/models';
import { useNavigate} from 'react-router';
import { UtilityInterfaces } from "./utility/models";
import MainScreenVisual from './MainScreenVisual';

import { getOrException, listUserProjects} from "./utility/ProjectUtilities.ts"

interface AppProps{
  parameters: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>];
  owned: boolean;
  projectState: [Models.ProjectBase[], React.Dispatch<React.SetStateAction<Models.ProjectBase[]>>]
  userIDstate : [number, React.Dispatch<React.SetStateAction<number>>]
}

//Props: Render the app with a specific set of parameters that are determined beforehand
//This keeps it from resetting them when navigating react router, and it will
//be easier to work in loading saved projects
export default function App({parameters, owned, projectState, userIDstate}: AppProps) {
  const [isNozzleDrawerOpen, setIsNozzleDrawerOpen] = useState(false);
  const [isControllerDrawerOpen, setIsControllerDrawerOpen] = useState(false);
  const [isLineDrawerOpen, setIsLineDrawerOpen] = useState(false);
  //Map of parameter names -> parameter values. Updates on event of input field changing
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const [projectList, setProjectList] = projectState;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  //Method for transfering info abour selectedId to the Modal
  const handleOpenInfo = (id: number) => {
    setSelectedId(id);
    setIsInfoOpen(true);
  }
  const [userID, setUserID] = userIDstate;
  const [parameterMap, setParameterMap] = parameters;
  async function awaitAndSetUserID(newUID : Promise<number>) {
    const IDToSet = await newUID;
    setUserID(IDToSet);
    setProjectList(await listUserProjects(IDToSet));
  }
  
  useEffect(() => {
    async function loadMap(){
      for(const [key, value] of parameterMap){
        const inputElement: HTMLInputElement|null = document.querySelector("#" + key + "_input");
        if(inputElement){
          inputElement.defaultValue = String(value.value);
        }   
      }
    }
    loadMap();
  })

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
  function navigateResults(){   
    navigate('/results/');
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
            <p className='input_label'>{key}</p>
            <input className="parameter_input" id={key + "_input"} type="text"></input>
          </li>
        );
      }
      //Make a number input field for integer or float parameters
      else{
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p className='input_label'>{key}</p>
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
          {parameterList[23]} <button className='info-btn' onClick={() => {handleOpenInfo(23)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Name"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[20]} <button className='info-btn' onClick={() => {handleOpenInfo(20)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Flow Rate"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[19]} <button className='info-btn' onClick={() => {handleOpenInfo(19)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Angle"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[6]} <button className='info-btn' onClick={() => {handleOpenInfo(6)}}
                      aria-expanded={isInfoOpen}
                      aria-controls="Nozzle Height"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[5]} <button className='info-btn' onClick={() => {handleOpenInfo(5)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Spacing"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[7]} <button className='info-btn' onClick={() => {handleOpenInfo(7)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Count"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[1]} <button className='info-btn' onClick={() => {handleOpenInfo(1)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Fluid Pressure"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[25]} <button className='info-btn' onClick={() => {handleOpenInfo(25)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Twist Angle"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[24]} <button className='info-btn' onClick={() => {handleOpenInfo(24)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Shape"></button></div>
        </NozzleDrawer>

        {/* LINE DRAWER */}
        <button onClick={() => setIsLineDrawerOpen(true)}
        aria-expanded={isLineDrawerOpen}
        aria-controls="lineDrawer">Line</button>
        <LineDrawer isOpen={isLineDrawerOpen} onClose={() => setIsLineDrawerOpen(false)}>
        <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[3]} <button className='info-btn' onClick={() => {handleOpenInfo(3)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Speed"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[4]} <button className='info-btn' onClick={() => {handleOpenInfo(4)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Width"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[9]} <button className='info-btn' onClick={() => {handleOpenInfo(9)}}                   
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Height"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[10]} <button className='info-btn' onClick={() => {handleOpenInfo(10)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Length"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[11]} <button className='info-btn' onClick={() => {handleOpenInfo(11)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Width"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[15]} <button className='info-btn' onClick={() => {handleOpenInfo(15)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Sensor Distance"></button></div>
        </LineDrawer>

        {/* CONTROLLER DRAWER */}
        <button onClick={() => setIsControllerDrawerOpen(true)}
        aria-expanded={isControllerDrawerOpen}
        aria-controls="controllerDrawer">Controller</button>
        <ControllerDrawer isOpen={isControllerDrawerOpen} onClose={() => setIsControllerDrawerOpen(false)}>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[17]} <button className='info-btn' onClick={() => {handleOpenInfo(17)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Start Delay"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[18]} <button className='info-btn' onClick={() => {handleOpenInfo(18)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Stop Delay"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[16]} <button className='info-btn' onClick={() => {handleOpenInfo(16)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Duration"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[27]} <button className='info-btn' onClick={() => {handleOpenInfo(27)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Id"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[28]} <button className='info-btn' onClick={() => {handleOpenInfo(28)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Name"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[31]} <button className='info-btn' onClick={() => {handleOpenInfo(31)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Max Frequency"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[0]} <button className='info-btn' onClick={() => {handleOpenInfo(0)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Duty Cycle"></button></div>
        </ControllerDrawer>
        {isInfoOpen && <Info isOpen = {isInfoOpen} setIsOpen={setIsInfoOpen} selectedId={selectedId}/>}
      </div>

      {/* THIS DIV IS FOR THE MODALS ON THE RIGHT SIDE */}
      <div id='navigation'>
        {/* SIGN IN / PROFILE */}

        <ProfileButton userID={userID} setIsProfileOpen={setIsProfileOpen} setIsSignInOpen={setIsSignInOpen}/>
        {isSignInOpen && <SignIn isOpen = {isSignInOpen} setIsLIOpen={setIsSignInOpen} setIsCAOpen={setIsCreateAccountOpen} setUID={awaitAndSetUserID}/>}
        {isCreateAccountOpen && <CreateAccount isOpen = {isCreateAccountOpen} setIsCAOpen={setIsCreateAccountOpen} setIsLIOpen={setIsSignInOpen} setUID={awaitAndSetUserID}/>}
        {isResetPasswordOpen && <ResetPassword isOpen={isResetPasswordOpen} setIsOpen={setIsResetPasswordOpen}/>}
        {isProfileOpen && <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} setUID={awaitAndSetUserID}/>}

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
        {isSaveLoadOpen && <SaveLoad isOpen = {isSaveLoadOpen} setIsOpen={setIsSaveLoadOpen} projectState={[projectList, setProjectList]} parameterMap={parameterMap} onLoad={loadProject} userIDstate={[userID, setUserID]}/>}
      </div>

      {/* THIS DIV IS FOR THE SIMULATION */}
      <div id='sprayModel'>
        {/* PROJECT NAME */}
        <h3 id='projectName'>{getOrException(parameterMap, "project_name").value}</h3>
        <h3>{userID}</h3>
        {/* 3D MODEL */}
        <MainScreenVisual parameterMap={parameterMap}/>
      </div>

      {/* THIS DIV IS FOR THE BUTTON TO SEE THE RESULTS */}
      <div id='results'>
        {/* RESULTS */}
          <button onClick={navigateResults}> See Results </button>
      </div>      
    </div>
  );
}

interface pbProps{
  userID: number;
  setIsSignInOpen : React.Dispatch<React.SetStateAction<boolean>>
  setIsProfileOpen : React.Dispatch<React.SetStateAction<boolean>>
}

function ProfileButton({userID, setIsSignInOpen, setIsProfileOpen} : pbProps){
  
  if(userID === 1){
  return (
    <button className= "primaryBtn" onClick={() => setIsSignInOpen(true)}>
      Sign In
    </button>)
  }
  else{
    return (
      <button className= "primaryBtn" onClick={() => setIsProfileOpen(true)}>
        Profile
      </button>)
  }
}