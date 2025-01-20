/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './styles/App.css';
import { Drawer, NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers.tsx';
import { NavLink, Link } from "react-router";
import { useState } from "react";
import { Modal, Profile, SignIn, Documentation, SaveLoad } from './Modals.tsx';
//import MainScreenVisual from './MainScreenVisual';

interface AppProps{
  parameterMapProp: Map<string, string>;
}

//Props: Render the app with a specific set of parameters that are determined beforehand
//This keeps it from resetting them when navigating react router, and it will
//be easier to work in loading saved projects
export default function App({parameterMapProp}: AppProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        setParameterMap(parameterMap.set(key, parameterInput.value));
        changeParameterList();
    });
  }
  
  //Replaces parameterList with the current values of parameterMap
  //TODO: make another function that only replaces the value actually changed,
  //so replacing parameters would be o(1) instead of o(n)
  function changeParameterList(){
    parameterList = [];
    for(const [key, value] of parameterMap){
      parameterList.push(
        <li id={key + "_list"} key={key}>
          <p>{key}</p>
          <input className="parameter_input" id={key + "_input"} type="text" defaultValue={value}></input>
        </li>
      )
    }
  }

  return (
    <div>
      <button onClick={() => setIsDrawerOpen(true)}>Nozzle</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
        <p>Drawer</p>
        <p>Drawer</p>
        <p>Drawer</p>
      </Drawer>

      <button onClick={() => setIsDrawerOpen(true)}>Line</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
      </Drawer>

      <button onClick={() => setIsDrawerOpen(true)}>Controller</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
      </Drawer>

          <main>
            <button className= "primaryBtn" onClick={() => setIsSignInOpen(true)}>
              Sign In
            </button>
            {isSignInOpen && <Modal isOpen = {isSignInOpen} setIsOpen={setIsSignInOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsProfileOpen(true)}>
              Profile
            </button>
            {isProfileOpen && <Modal isOpen = {isProfileOpen} setIsOpen={setIsProfileOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsDocumentationOpen(true)}>
              Documentation
            </button>
            {isDocumentationOpen && <Modal isOpen = {isDocumentationOpen} setIsOpen={setIsDocumentationOpen} />}
          </main>

          <main>
            <button className= "primaryBtn" onClick={() => setIsSaveLoadOpen(true)}>
              Save Load
            </button>
            {isSaveLoadOpen && <Modal isOpen = {isSaveLoadOpen} setIsOpen={setIsSaveLoadOpen} />}
          </main>

          <Link to="/animation">
            <button> Arrow </button>
          </Link>

          <Link to="/topview">
            <button> Top View </button>
          </Link>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
        <ul>{parameterList}</ul>
      </Drawer>
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
