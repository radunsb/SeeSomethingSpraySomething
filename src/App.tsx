/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './styles/App.css';
import { NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers.tsx';
import { NavLink, Link } from "react-router";
import { useState } from "react";
import { Profile, SignIn, Documentation, SaveLoad } from './Modals.tsx';
import { UtilityInterfaces } from "./utility/models";
import { saveProject } from "./utility/ProjectUtilities";
import MainScreenVisual from './MainScreenVisual';

interface AppProps{
  parameterMapProp: Map<string, UtilityInterfaces.Parameter>;
}

//Props: Render the app with a specific set of parameters that are determined beforehand
//This keeps it from resetting them when navigating react router, and it will
//be easier to work in loading saved projects
export default function App({parameterMapProp}: AppProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNozzleDrawerOpen, setIsNozzleDrawerOpen] = useState(false);
  const [isControllerDrawerOpen, setIsControllerDrawerOpen] = useState(false);
  const [isLineDrawerOpen, setIsLineDrawerOpen] = useState(false);
  //Map of parameter names -> parameter values. Updates on event of input field changing
  const [parameterMap, setParameterMap] = useState(parameterMapProp);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);

  //Construct a list of the parameters and the values given
  //to App.tsx as props
  //parameterList is the list of HTML elements that are rendered in the drawers for
  //each parameter. it may be desirable to make a separate list for each drawer.
  let parameterList: any[] = [];  
  changeParameterList();   
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
        changeParameterList();
      }
    });
  }
  
  //Replaces parameterList with the current values of parameterMap
  //TODO: make another function that only replaces the value actually changed,
  //so replacing parameters would be o(1) instead of o(n)
  function changeParameterList(){
    parameterList = [];
    for(const [key, value] of parameterMap){
      //Make a text input field for string parameters
      if(value.type==UtilityInterfaces.types.STRING){
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key}</p>
            <input className="parameter_input" id={key + "_input"} type="text" defaultValue={value.value}></input>
          </li>
        );
      }
      //Make a number input field for integer or float parameters
      else{
        parameterList.push(
          <li id={key + "_list"} key={key}>
            <p>{key}</p>
            <input className="parameter_input" id={key + "_input"} type="number" defaultValue={value.value}></input>
          </li>
        );
      }
    }
  }
  function save(){
    saveProject(1, parameterMap)
  }

  return (
    <div>

      <MainScreenVisual parameterMap={parameterMap}/>

      <button onClick={save}>Save Project</button>

      <button onClick={() => setIsNozzleDrawerOpen(true)}>Nozzle</button>

      <NozzleDrawer isOpen={isNozzleDrawerOpen} onClose={() => setIsNozzleDrawerOpen(false)}>
        <p>Drawer</p>
      </NozzleDrawer>

      <button onClick={() => setIsLineDrawerOpen(true)}>Line</button>

      <LineDrawer isOpen={isLineDrawerOpen} onClose={() => setIsLineDrawerOpen(false)}>
        <p>Drawer</p>
      </LineDrawer>

      <button onClick={() => setIsControllerDrawerOpen(true)}>Controller</button>

      <ControllerDrawer isOpen={isControllerDrawerOpen} onClose={() => setIsControllerDrawerOpen(false)}>
        <p>Drawer</p>
      </ControllerDrawer>

          <main>
            <button className= "primaryBtn" onClick={() => setIsSignInOpen(true)}>
              Sign In
            </button>
            {isSignInOpen && <SignIn isOpen = {isSignInOpen} setIsOpen={setIsSignInOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsProfileOpen(true)}>
              Profile
            </button>
            {isProfileOpen && <Profile isOpen = {isProfileOpen} setIsOpen={setIsProfileOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsDocumentationOpen(true)}>
              Documentation
            </button>
            {isDocumentationOpen && <Documentation isOpen = {isDocumentationOpen} setIsOpen={setIsDocumentationOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsSaveLoadOpen(true)}>
              Save Load
            </button>
            {isSaveLoadOpen && <SaveLoad isOpen = {isSaveLoadOpen} setIsOpen={setIsSaveLoadOpen} />}
          </main>

          <Link to="/animation">
            <button> Arrow </button>
          </Link>

          <Link to="/topview">
            <button> Top View </button>
          </Link>

      <div>
          <Link to="/results">
            <button> See Results </button>
          </Link>
          <Link to="/parameters">
            <button> Parameters </button>
          </Link>
      </div>
    </div>
  );
}
