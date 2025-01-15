import React from 'react';
import './App.css';
import { Drawer } from './Drawers';
import { NavLink, Link } from "react-router";
import {createProjectMap} from './ProjectUtilities';
import { useState, useEffect } from "react";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [parameterMap, setParameterMap] = useState(new Map());
  //Immediately loads the first project of the first user(default project)
  //sets the parameter map to it
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
      <button onClick={() => setIsDrawerOpen(true)}>Open Drawer</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
        <ul>{parameterList}</ul>
      </Drawer>
      <div>
          <Link to="/results">
            <button> Results </button>
          </Link>
          <Link to="/parameters">
            <button> Parameters </button>
          </Link>
      </div>
    </div>
  );
}
