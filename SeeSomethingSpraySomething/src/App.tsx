import React from 'react';
import './App.css';
import { Drawer, NozzleDrawer, LineDrawer, ControllerDrawer } from './Drawers';
import { NavLink, Link } from "react-router";
import {createProjectMap} from './ProjectUtilities';
import { useState, useEffect } from "react";
import { Modal, Profile, SignIn, Documentation, SaveLoad } from './Modals.tsx';
import MainScreenVisual from './MainScreenVisual';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [parameterMap, setParameterMap] = useState(new Map());
  //Immediately loads the first project of the first user(default project)
  //sets the parameter map to it

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);

  useEffect(() => {
    async function loadDefaultProject(){
      setParameterMap(await createProjectMap(1));
    }
    loadDefaultProject();
  })
  //TODO: make the parameterList also controlled by state so it can update
  //Constructs a list of the parameters and their default values
  const parameterList = [];
    for(const [key, value] of parameterMap){
      parameterList.push(
        <li id={key + "_list"} key={key}>
          <p>{key}</p>
          <input id={key + "_input"} type="text" defaultValue={value}></input>
        </li>
      )
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
