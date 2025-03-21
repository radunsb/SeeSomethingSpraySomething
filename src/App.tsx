/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/App.css';
import { NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers.tsx';
import { SignIn } from './Modals/SignInModal.tsx'
import { Documentation } from './Modals/DocumentationModal.tsx'
import { SaveLoad } from './Modals/SaveLoadModal.tsx'
import { CreateAccount, Profile } from './Modals.tsx'
import { ResetPassword, ResetPasswordConfirm } from './Modals/ResetPasswordModal.tsx'
import { Info } from './Modals/InfoModal.tsx'
import { UserInfoResponse } from './utility/auth_requests.ts';
import { useState, useEffect, ChangeEvent } from "react";
import { Models } from './utility/models';
import { useNavigate} from 'react-router';
import { UtilityInterfaces } from "./utility/models";
import { pushRunToDatabase } from './utility/ProjectUtilities.ts';
import MainScreenVisual from './MainScreenVisual';
import './utility/auth_requests.ts';

import { getOrException, listUserProjects} from "./utility/ProjectUtilities.ts";

interface AppProps{
  parameters: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>];
  projectState: [Models.ProjectBase[], React.Dispatch<React.SetStateAction<Models.ProjectBase[]>>]
  userIDstate : [number, React.Dispatch<React.SetStateAction<number>>]
  timingModeState : [string, React.Dispatch<React.SetStateAction<string>>]
}

//Props: Render the app with a specific set of parameters that are determined beforehand
//This keeps it from resetting them when navigating react router, and it will
//be easier to work in loading saved projects
export default function App({parameters, projectState, userIDstate, timingModeState}: AppProps) {
  const [isNozzleDrawerOpen, setIsNozzleDrawerOpen] = useState(false);
  const [isControllerDrawerOpen, setIsControllerDrawerOpen] = useState(false);
  const [isLineDrawerOpen, setIsLineDrawerOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isForgetSuccessOpen, setIsForgetSuccessOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  //Method for transfering info abour selectedId to the Modal
  const handleOpenInfo = (id: number) => {
    setSelectedId(id);
    setIsInfoOpen(true);
  }
  //These are states that were passed down from main
  const [userID, setUserID] = userIDstate;
  const [projectList, setProjectList] = projectState;
  const [parameterMap, setParameterMap] = parameters;
  const [timingMode, setTimingMode] = timingModeState;

  //When someone logs in, set the userID state and reload the project list
  async function awaitAndSetUserInfo(newInfo : Promise<UserInfoResponse>) {
    const responseData = await newInfo;

    let IDToSet = responseData.uid;
    setUserID(IDToSet);
    console.log(IDToSet);
    setProjectList(await listUserProjects(IDToSet));

    let usernameToSet = responseData.username;
    if(typeof usernameToSet === "string"){
      setUsername(usernameToSet);
    }

    let emailToSet = responseData.email;
    if(typeof emailToSet === "string"){
      setEmail(emailToSet);
    }
  }
  
  //Funky stuff happens with defaultValue on inputs and React. I don't know why
  //this works. I wouldn't suggest touching it.
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

  //On loading project, set the parameter map and change all of the parameter input elements
  function loadProject(params: Map<string, UtilityInterfaces.Parameter>){
    setParameterMap(params);
    for(const [key, value] of params){
      const inputElement: HTMLInputElement|null = document.querySelector("#" + key + "_input");
      if(inputElement){
        inputElement.defaultValue = String(value.value);
      }   
    }
  }

  //Called when the results button is clicked. Not sure why this needs its own function.
  const navigate = useNavigate();
  async function navigateResults(){
    await pushRunToDatabase(userID, parameterMap)   
    navigate('/results/');
  }
  
  //Construct a list of the parameters and the values given
  //to App.tsx as props
  //parameterList is the list of HTML elements that are rendered in the drawers for
  //each parameter
  let parameterList: any[] = []; 
  constructParameterInputList();  
  const parameterInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(".parameter_input");
  //For every parameter input, add an event listener that updates the parameter map
  //when the value is changed
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
  
  //Create all of the HTML elements for the input fields in the left side drawers
  function constructParameterInputList(){
    parameterList = [];
    for(const [key, value] of parameterMap){
      //Make a text input field for string parameters
      if(value.min!=null && value.max!=null){
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key.replace("_", " ").replace("_", " ").toUpperCase()}</p>
            <input className="parameter_input" id={key + "_input"} type="number" min={value.min} max={value.max}></input>
          </li>
        );
      }
      else{
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key.replace("_", " ").replace("_", " ").toUpperCase()}</p>
            <input className="parameter_input" id={key + "_input"} type={value.type==UtilityInterfaces.types.STRING ? "text" : "number"}></input>
          </li>
        );
      }
    }
  }

  //this function has to be inside the app component because it needs access to the parametermap
  //possible timing modes are
  //vt = variable time, ft = fixed time
  //vd = variable distance, fd = fixed distance
  function updateTimingMode(e:ChangeEvent<HTMLSelectElement>) : void{
    updateTimingModeHelper(e.target.value);
  }

  function autoCalculateTiming() : void{
    const LineSpeed = Number(getOrException(parameterMap, "line_speed").value) / 5;
    const SensorDis = Number(getOrException(parameterMap, "sensor_distance").value);
    const stopDelayParam = parameterMap.get("stop_delay");
    const startDelayParam = parameterMap.get("start_delay");
    const sprayDurationParam = parameterMap.get("spray_duration");
    console.log("function happened")

    if (typeof startDelayParam !== "undefined"){
      startDelayParam.value = Number(getOrException(parameterMap, "sensor_distance").value) / LineSpeed;
      setParameterMap(parameterMap.set("start_delay", startDelayParam));
      console.log(startDelayParam)
    }
    if (typeof stopDelayParam !== "undefined"){
      stopDelayParam.value = Number(getOrException(parameterMap, "sensor_distance").value) / LineSpeed;
      setParameterMap(parameterMap.set("stop_delay", stopDelayParam));
      console.log(stopDelayParam)
    }
    if (typeof SensorDis !== "undefined" && typeof sprayDurationParam !== "undefined"){
      sprayDurationParam.value = Number(getOrException(parameterMap, "product_length").value) / LineSpeed;
      setParameterMap(parameterMap.set("spray_duration", sprayDurationParam));
      console.log(sprayDurationParam)

    }
  }

  function updateTimingModeHelper(newTimeMode:string) : void{
    //start_delay should always be visible, so we don't need to do anything to it
    const stopDelayDiv = document.getElementById("stop-delay-div");
    const sprayDurDiv = document.getElementById("spray-duration-div");
   
    if(stopDelayDiv !== null && sprayDurDiv !== null){
        if(newTimeMode === "ft"){
          stopDelayDiv.classList.add("grayed-timing-mode");
          sprayDurDiv.classList.remove("grayed-timing-mode");
        }
        else if(newTimeMode === "vt"){
          stopDelayDiv.classList.remove("grayed-timing-mode");
          sprayDurDiv.classList.add("grayed-timing-mode");
        }

        setTimingMode(newTimeMode);
        //console.log(`time mode state is now: ${newTimeMode}`);
    }
    else{
      console.error("ERROR: timing mode div not found");
    }
  }
  //call when App is loaded to preserve across screens
  let stopDelayGrayed = "";
  let sprayDurationGrayed = "";
  if(timingMode === "vt"){
    sprayDurationGrayed = "grayed-timing-mode";
  }
  else if(timingMode === "ft"){
    stopDelayGrayed = "grayed-timing-mode";
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
          <div style = {{display: "flex", alignItems: "center", gap: "29px"}}>
          {parameterList[23]} <button className='info-btn' onClick={() => {handleOpenInfo(23)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Name"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "50px"}}>
          {parameterList[20]} <button className='info-btn' onClick={() => {handleOpenInfo(20)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Flow Rate"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "82px"}}>
          {parameterList[19]} <button className='info-btn' onClick={() => {handleOpenInfo(19)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Angle"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "15px"}}>
          {parameterList[6]} <button className='info-btn' onClick={() => {handleOpenInfo(6)}}
                      aria-expanded={isInfoOpen}
                      aria-controls="Nozzle Height"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "17px"}}>
          {parameterList[5]} <button className='info-btn' onClick={() => {handleOpenInfo(5)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Spacing"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "8px"}}>
          {parameterList[7]} <button className='info-btn' onClick={() => {handleOpenInfo(7)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Nozzle Count"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "15px"}}>
          {parameterList[1]} <button className='info-btn' onClick={() => {handleOpenInfo(1)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Fluid Pressure"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "35px"}}>
          {parameterList[25]} <button className='info-btn' onClick={() => {handleOpenInfo(25)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Twist Angle"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "36px"}}>
          {parameterList[24]} <button className='info-btn' onClick={() => {handleOpenInfo(24)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Shape"></button></div>
        </NozzleDrawer>

        {/* LINE DRAWER */}
        <button onClick={() => setIsLineDrawerOpen(true)}
        aria-expanded={isLineDrawerOpen}
        aria-controls="lineDrawer">Line</button>
        <LineDrawer isOpen={isLineDrawerOpen} onClose={() => setIsLineDrawerOpen(false)}>
        <div style = {{display: "flex", alignItems: "center", gap: "65px"}}>
          {parameterList[3]} <button className='info-btn' onClick={() => {handleOpenInfo(3)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Speed"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "60px"}}>
          {parameterList[4]} <button className='info-btn' onClick={() => {handleOpenInfo(4)}}
                    aria-expanded={isInfoOpen}
                    aria-controls="Line Width"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "14px"}}>
          {parameterList[9]} <button className='info-btn' onClick={() => {handleOpenInfo(9)}}                   
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Height"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "12px"}}>
          {parameterList[10]} <button className='info-btn' onClick={() => {handleOpenInfo(10)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Length"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "20px"}}>
          {parameterList[11]} <button className='info-btn' onClick={() => {handleOpenInfo(11)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Product Width"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "10px"}}>
          {parameterList[15]} <button className='info-btn' onClick={() => {handleOpenInfo(15)}}                 
                    aria-expanded={isInfoOpen}
                    aria-controls="Sensor Distance"></button></div>
        </LineDrawer>

        {/* CONTROLLER DRAWER */}
        <button onClick={() => setIsControllerDrawerOpen(true)}
        aria-expanded={isControllerDrawerOpen}
        aria-controls="controllerDrawer">Controller</button>
        <ControllerDrawer isOpen={isControllerDrawerOpen} onClose={() => setIsControllerDrawerOpen(false)}>
          
          <div>
            <select value={timingMode} onChange={updateTimingMode}>
              <option key="ft" value="ft">Fixed Time</option>
              <option key="vt" value="vt">Variable Time</option>
            </select>
          </div>
          
          <div id="start-delay-div" className="visible-timing-mode" style = {{display: "flex", alignItems: "center", gap: "43px"}}>
          {parameterList[17]} <button className='info-btn' onClick={() => {handleOpenInfo(17)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Start Delay"></button></div>
          <div id="stop-delay-div" className={`visible-timing-mode ${stopDelayGrayed}`} style = {{display: "flex", alignItems: "center", gap: "48px"}}>
          {parameterList[18]} <button className='info-btn' onClick={() => {handleOpenInfo(18)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Stop Delay"></button></div>
          <div id="spray-duration-div" className= {`visible-timing-mode ${sprayDurationGrayed}`} style = {{display: "flex", alignItems: "center", gap: "px"}}>
          {parameterList[16]} <button className='info-btn' onClick={() => {handleOpenInfo(16)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Spray Duration"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "37px"}}>
          {parameterList[27]} <button className='info-btn' onClick={() => {handleOpenInfo(27)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Id"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "11px"}}>
          {parameterList[28]} <button className='info-btn' onClick={() => {handleOpenInfo(28)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Controller Name"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "20px"}}>
          {parameterList[31]} <button className='info-btn' onClick={() => {handleOpenInfo(31)}}                    
                    aria-expanded={isInfoOpen}
                    aria-controls="Max Frequency"></button></div>
          <div style = {{display: "flex", alignItems: "center", gap: "50px"}}>
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
        {isSignInOpen && <SignIn isOpen = {isSignInOpen} setIsLIOpen={setIsSignInOpen} setIsCAOpen={setIsCreateAccountOpen} setIsFPOpen={setIsResetPasswordOpen} setUserInfo={awaitAndSetUserInfo}/>}
        {isCreateAccountOpen && <CreateAccount isOpen = {isCreateAccountOpen} setIsCAOpen={setIsCreateAccountOpen} setIsLIOpen={setIsSignInOpen} setIsFPOpen={setIsResetPasswordOpen} setUserInfo={awaitAndSetUserInfo}/>}
        {isResetPasswordOpen && <ResetPassword isOpen={isResetPasswordOpen} setIsOpen={setIsResetPasswordOpen} setIsFSOpen={setIsForgetSuccessOpen} setIsCAOpen={setIsCreateAccountOpen} setIsLIOpen={setIsSignInOpen}/>}
        {isForgetSuccessOpen && <ResetPasswordConfirm isOpen={isForgetSuccessOpen} setIsOpen={setIsForgetSuccessOpen}/>}
        {isProfileOpen && <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} setUserInfo={awaitAndSetUserInfo} username={username} email={email}/>}

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

