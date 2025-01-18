import axios from "axios";
import {Models} from './Models.ts'

//Async function that constructs a map with project data
//TODO: This currently just takes the user's first project.
//Should make version with a projectID as well
export async function createProjectMap(userID: number){
    let user: Partial<Models.User> = {};
    await axios.get(`http://localhost:5000/api/v1/users/${userID}`)
        .then(response => {
            user = <Models.User> response.data.user;
        })
        .catch(error => console.error(error));
    const parameterMap = new Map();
    if(user.projects){
        const projectToFetch = 0;
        const project = user.projects[projectToFetch];        
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
    }
    return parameterMap;
}
