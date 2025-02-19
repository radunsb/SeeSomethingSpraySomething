// Can probably ignore this file
//All it does is print out the parameters of a project, which is eclipsed by
//the stuff in the App file. Not deleting it because some other things are still
//dependent on it


import { useState, useEffect } from "react";
import axios from "axios";
import {Models} from './utility/models.ts'
import "./styles/main.css"

function Project({userID}: {userID:number}) {
  const [user, setUser] = useState<Models.User>();
  useEffect(() => {
    axios.get(`${__BACKEND_URL__}/api/v1/users/${userID}/`)
      .then(response => setUser(response.data.user))
      .catch(error => console.error(error));
  }, [userID]);
  if(user){
    const projectToFetch = 0;
    const project = user.projects[projectToFetch];
    const parameterMap = new Map();
    Object.entries(project).map(entry => {
        const key = entry[0]
        const value = entry[1]
        parameterMap.set(key, value)
    })
    const nozzle = project.nozzle;
    Object.entries(nozzle).map(entry => {
        const key = entry[0]
        const value = entry[1]
        parameterMap.set(key, value)
    })
    const controller = project.controller;
    Object.entries(controller).map(entry => {
        const key = entry[0]
        const value = entry[1]
        parameterMap.set(key, value)
    })
    const gun = project.gun;
    Object.entries(gun).map(entry => {
        const key = entry[0]
        const value = entry[1]
        parameterMap.set(key, value)
    })
    parameterMap.delete('controller');
    parameterMap.delete('nozzle');
    parameterMap.delete('gun');
    let stringToSet = '';
    for(const [key, value] of parameterMap){
        stringToSet += `${key}: ${value}` + "\n"
    }

    return(
        <div>
            <h1>Project Stuff</h1>
            <div>
                {stringToSet}
            </div>
        </div>
    );
  }
}

export default Project;