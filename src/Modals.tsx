import React, { useState, useEffect } from "react";
import './styles/Modals.css';
import { RiCloseLine } from "react-icons/ri";
import { Models, UtilityInterfaces } from "./utility/models";
import { createAccount } from "./utility/auth_requests";
import { saveProject, listUserProjects} from "./utility/ProjectUtilities";
import { createProjectMap } from "./utility/ProjectUtilities";

interface ModalProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}
interface SaveLoadProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
  projects: Models.ProjectBase[];
  parameterMap: Map<string, UtilityInterfaces.Parameter>;
  owned: boolean;
  onLoad: (arg0: Map<string, UtilityInterfaces.Parameter>) => void;
}

interface TextFieldProps {
  value?: string;
  onChange: (val: string) => void;
}

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onChange: (value: string) => void;
}

export const TextField = ({ value, onChange }: TextFieldProps) => {
  return (
    <input value={value} onChange={({ target: { value } }) => onChange(value)}/>
  );
};

export const Dropdown: React.FC<DropdownProps> = ({ options, onChange}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(options[0]?.value || "");

const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const value = event.target.value;
  setSelectedValue(value);
  onChange(value);
};

return (
  <select value={selectedValue} onChange={handleChange}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
};

//const [myBoolean, setMyBoolean] = useState(false);
//
//  const handleClick = () => {
//    setMyBoolean(!myBoolean);
//  };

  export const SignIn = ({ isOpen, setIsOpen }: ModalProps) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleUnChange = (newUn:string) => {
      setUserName(newUn);}

    const handlePwChange = (newPw:string) => {
      setPassword(newPw);}

    const handleEmChange = (newEm:string) => {
        setEmail(newEm);}

    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <button className= "closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className="button-container">
            <button className= "loginSwitchBtn" onClick={() => setIsOpen(false)}>
                  Log In
            </button>
            <button className= "createSwitchBtn" onClick={() => setIsOpen(false)}>
                  Create Account
            </button>
            </div>
            <div>
              <div>
                  <p>Username</p>
                  <TextField value={username} onChange={handleUnChange} ></TextField>
              </div>
              <div>
                  <p>Email</p>
                  <TextField value={email} onChange={handleEmChange} ></TextField>
              </div>
              <div>
                  <p>Password</p>
                  <TextField value={password} onChange={ handlePwChange} ></TextField>
              </div>
              &nbsp;
              <div>
                <button className= "forgetBtn" onClick={() => setIsOpen(false)}>
                  Forget Password
                </button>
                </div>
                <div>
                <button className= "loginBtn" onClick={() => {createAccount(username, password, email); setIsOpen(false)}}>
                  Login
                </button>
                </div>
              </div>
            </div>
          </div>
      </>
    );
  };

export const Profile = ({isOpen, setIsOpen }: ModalProps) => {
  if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={() => setIsOpen(false)} />
      <div className= "centered">
        <div className= "modal">
            <h5>Dialog</h5>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
            <div className= "modalContent">
            Are you sure you want to delete the item?
          </div>
          <div className= "modalActions">
            <div className= "actionsContainer">
              <button className= "deleteBtn" onClick={() => setIsOpen(false)}>
                 Delete
               </button>
               <button
                 className= "cancelBtn"
                 onClick={() => setIsOpen(false)}
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       </div>
     </>
  );  
};

  export const Documentation = ({ isOpen, setIsOpen }: ModalProps) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const nozzleOptions: Option[] = [
      { value: "nozzle-info", label: "Nozzle Information"},
    ];
    const controllerOptions: Option[] = [
      { value: "controller-info", label: "Controller Information"},
    ];
    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
              <h5>Documentation</h5>
            <button className= "closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
              <div>
                <button className= "CancelBtn" onClick={() => setIsOpen(false)}>
                  Nozzle Information
                </button>
                <Dropdown
                options={nozzleOptions}
                onChange={(value) => setSelectedValue(value)}/>
              </div>
              <div>
                <button className= "CancelBtn" onClick={() => setIsOpen(false)}>
                  Controller Manual
                </button>
                <Dropdown
                options={controllerOptions}
                onChange={(value) => setSelectedValue(value)}/>
              </div>
            <div>
              Direct guestions to
              Robert Spray
              spraystuff@spray.com
              555 55-SPRAY
            </div>
          </div>
        </div>
      </>
    );
  };


  export const SaveLoad = ({ isOpen, setIsOpen, parameterMap, owned, onLoad}: SaveLoadProps) => {
    const [selectedButton, setSelectedButton] = useState(-1);
    function save(){
      saveProject(1, parameterMap)
      setIsOpen(false);
    }
    async function loadProject(){
      console.log("Loading Project " + selectedButton);
      parameterMap = await createProjectMap(1, selectedButton);
      console.log(parameterMap);
      onLoad(parameterMap);
      setIsOpen(false);
    }
    function deleteProject(){

    }
    function clickedProjectButton(project_id: number){
      document.getElementById("open_project_button")?.removeAttribute("disabled");
      document.getElementById("delete_project_button")?.removeAttribute("disabled");
      setSelectedButton(project_id);
    }
    const [projects, setProjects] = useState(Array<Models.ProjectBase>())
    useEffect(() => {
      async function renderProjectList(){
        setProjects(await listUserProjects(1));
      }
      renderProjectList();
    }, [])
    console.log(projects);
    projects.sort((a:Models.ProjectBase, b:Models.ProjectBase) => 
      new Date(b.last_modified_date).getTime() - new Date(a.last_modified_date).getTime());
    const projectList = projects.map(project => <li
      key = {project.project_id}>
      <button id={"pb_" + project.project_id} onClick={() => clickedProjectButton(project.project_id)}>{project.project_name}</button>
    </li>)
    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <div className= "modalHeader">
              <h5 className= "heading">Projects</h5>
            </div>
            <button className= "closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className= "modalContent">
            <button onClick={save}>Save Project</button>
              {projectList}
            </div>
            <div className= "modalActions">
              <div className= "actionsContainer">
                <button id="delete_project_button" className= "deleteBtn" disabled onClick={() => setIsOpen(false)}>
                  Delete
                </button>
                <button id="open_project_button" className= "openBtn" onClick={() => loadProject()}>
                  Open
                </button>
                <button
                  className= "cancelBtn"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };