import '../styles/Modals.css';
import { UtilityInterfaces } from "../utility/models";
import { TextBoxProps } from './ModalInterfaces';
import { saveProject } from '../utility/ProjectUtilities';
import { createProjectMap } from '../utility/ProjectUtilities';
import { useState, useEffect } from 'react';
import { Loading } from './LoadingModal';

export const TextBox = ({isOpen, setIsOpen, title, setIsParentOpen, parameterMap, current, userID, selectedButton}: TextBoxProps) => {
    const [placeholder, setPlaceholder] = useState(current);
    const [isLoading, setIsLoading] = useState(false);
    const [pMap, setPMap] = useState(parameterMap);
    useEffect(() => {
        if(title==="description"){
            doDescriptionStuff();
        }
    }, []);

    async function doDescriptionStuff(){
        setIsLoading(true);
        const newMap = await createProjectMap(userID, selectedButton);
        console.log(selectedButton);
        setPMap(newMap);
        setPlaceholder(String(newMap.get("project_description")?.value));  
        setIsLoading(false);
    }
  if (!isOpen){ return null}
    
  if(title === "description"){
    const inp = document.getElementById("rename_project");
    inp?.classList.remove("textbox-input");
    inp?.classList.add("textbox-description-input");
  }
  async function doThing(){
    if(title==="rename"){
        const renameProjectInput: HTMLInputElement|null = document.querySelector("#rename_project");
              if(renameProjectInput && renameProjectInput.value != "" && renameProjectInput.value != "[Change This To Rename]"){
                const nameParam: UtilityInterfaces.Parameter = {
                  name: "project_name",
                  type: UtilityInterfaces.types.STRING,
                  value: renameProjectInput.value
                }
                parameterMap.set("project_name", nameParam)
              }
    }
    else if(title==="description"){
        const renameProjectInput: HTMLInputElement|null = document.querySelector("#rename_project");
              if(renameProjectInput && renameProjectInput.value != ""){      
                setIsLoading(true);          
                const descriptionParam: UtilityInterfaces.Parameter = {
                  name: "project_description",
                  type: UtilityInterfaces.types.STRING,
                  value: renameProjectInput.value
                }
                pMap.set("project_description", descriptionParam)
                if(pMap.get("project_id")?.value === parameterMap.get("project_id")?.value){
                    parameterMap.set("project_description", descriptionParam);
                }
                await saveProject(userID, pMap, false);
                setIsLoading(false);
              }
    }
    setIsParentOpen(true);
    setIsOpen(false);
  }
  return (
    
    <div className="darkBG">
        {isLoading && <Loading isOpen={isLoading} setIsOpen={setIsLoading} setBG={false}/>} 
        <div className= "textbox-modal centered modal">
            <input id="rename_project" className="textbox-input" placeholder={placeholder}></input>
            <br></br>
            <button className="saveBtn" onClick={doThing}>Confirm</button>
            <button className="saveBtn" onClick={() => {setIsOpen(false);setIsParentOpen(true);}}>Back</button>
        </div>
    </div>
  );  
};