import axios from "axios";
import {Models} from './models.ts'
import {UtilityInterfaces} from './models.ts'

//Async function that constructs a map with project data
//TODO: This currently just takes the user's first project.
//Should make version with a projectID as well
export async function createProjectMap(userID: number, projectID: number){
    //Partial lets us use an interface without explicitly setting the values
    //Shouldn't be used if you need to use a lot of those values, but since we
    //only have to check if user.projects is occupied (which we would do anyways)
    //this is fine.
    let user: Partial<Models.User> = {};

    //Obtain user data specified in parameters
    await axios.get(`http://localhost:5000/api/v1/users/${userID}`)
        .then(response => {
            user = <Models.User> response.data.user;
        })
        .catch(error => console.error(error));

    const parameterMap = new Map();
    
    function constructMapEntry(entry:[string, string|number]){
        const key = entry[0];
        const value = entry[1];
        let type: UtilityInterfaces.types;
        if(typeof value === "number"){
            if(Number.isInteger(value)){
                type = UtilityInterfaces.types.INT;
            }
            else{
                type = UtilityInterfaces.types.FLOAT;
            }
        }
        else{
            type = UtilityInterfaces.types.STRING;
        }
        const parameter: UtilityInterfaces.Parameter = {
            name:key,
            type: type,
            value: value,
        }
        parameterMap.set(key, parameter);
    }

    //Make sure the project actually exists
    if(user.projects && user.projects.length > projectID){
        const projectToFetch = projectID;
        const project = user.projects[projectToFetch];
        
        //Currently unpack all of the other interfaces(nozzle, gun, etc.) and store
        //their parameters as simple values
        Object.entries(project).map(entry => constructMapEntry(entry))
        const nozzle = project.nozzle;
        Object.entries(nozzle).map(entry => constructMapEntry(entry))
        const controller = project.controller;
        Object.entries(controller).map(entry => constructMapEntry(entry))
        const gun = project.gun;
        Object.entries(gun).map(entry => constructMapEntry(entry))
        //Remove the interface parameters since we unpacked their contents
        parameterMap.delete('controller');
        parameterMap.delete('nozzle');
        parameterMap.delete('gun');
    }
    return parameterMap;
}
