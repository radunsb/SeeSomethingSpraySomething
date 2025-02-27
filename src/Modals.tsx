import React, { useState, useEffect } from "react";
import './styles/Modals.css';
import { RiCloseLine } from "react-icons/ri";
import { Models, UtilityInterfaces } from "./utility/models";
import { createAccount, login, logout } from "./utility/auth_requests";
import { saveProject, deleteProject} from "./utility/ProjectUtilities";
import { createProjectMap} from "./utility/ProjectUtilities";
import { createNozzleArray, createControllerArray, listUserProjects} from "./utility/ProjectUtilities";
interface ModalProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}

interface ProfileModalProps extends ModalProps{
  setUID: (arg: Promise<number>) => void;
  username: string
  email: string
}

interface SaveLoadProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
  projectState : [Models.ProjectBase[], React.Dispatch<React.SetStateAction<Models.ProjectBase[]>>];
  parameterMap: Map<string, UtilityInterfaces.Parameter>;
  onLoad: (arg0: Map<string, UtilityInterfaces.Parameter>) => void;
  userIDstate : [number, React.Dispatch<React.SetStateAction<number>>];
}

interface AccountModalProps{
  isOpen: boolean;
  setIsLIOpen: (arg0: boolean) => void;
  setIsCAOpen: (arg0: boolean) => void;
  setUID: (arg: Promise<number>) => void;
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
  const [selectedValue, setSelectedValue] = useState<string>(options.length > 0 ? options[0].value : "");
  useEffect(() => {
    if (options.length > 0){
      setSelectedValue(options[0].value);
    }
  }, [options])

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

export const CreateAccount = ({ isOpen, setIsLIOpen, setIsCAOpen, setUID }: AccountModalProps) => {
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
      <div className= "darkBG" onClick={() => setIsCAOpen(false)} />
      <div className= "centered">
        <div className= "modal">
          <button className= "closeBtn" onClick={() => setIsCAOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className="button-container">
          <button className= "loginSwitchBtn" onClick={() => {setIsLIOpen(true); setIsCAOpen(false)}}>
                Log In
          </button>
          <button className= "createSwitchBtn">
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
              </div>
              <div>
              <button className= "loginBtn" onClick={() => {setUID(createAccount(username, password, email)); setIsCAOpen(false)}}>
                Create
              </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

  export const SignIn = ({ isOpen, setIsLIOpen, setIsCAOpen, setUID }: AccountModalProps) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleUnChange = (newUn:string) => {
      setUserName(newUn);}

    const handlePwChange = (newPw:string) => {
      setPassword(newPw);}

    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsLIOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <button className= "closeBtn" onClick={() => setIsLIOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className="button-container">
            <button className= "loginSwitchBtn">
                  Log In
            </button>
            <button className= "createSwitchBtn" onClick={() => {setIsLIOpen(false); setIsCAOpen(true)}}>
                  Create Account
            </button>
            </div>
            <div>
              <div>
                  <p>Username</p>
                  <TextField value={username} onChange={handleUnChange} ></TextField>
              </div>
              <div>
                  <p>Password</p>
                  <TextField value={password} onChange={ handlePwChange} ></TextField>
              </div>
              &nbsp;
              <div hidden={true}>
                <button className= "forgetBtn" onClick={() => setIsLIOpen(false)}>
                  Forgot Password
                </button>
              </div>
                <div>
                <button className= "loginBtn" onClick={() => {setUID(login(username, password)); setIsLIOpen(false)}}>
                  Login
                </button>
                </div>
              </div>
            </div>
          </div>
      </>
    );
  };

export const ResetPassword = ({isOpen, setIsOpen }: ModalProps) => {
    const [email, setEmail] = useState('');
    const handleEmChange = (newEm:string) => {
        setEmail(newEm);}
if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={() => setIsOpen(false)} />
      <div className= "centered">
        <div className= "modal">
            <h5>Please Enter Your Email So That We Can Send You A Password Recovery Link</h5>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className= "modalActions">
            <div className= "actionsContainer">
              <div>
                  <p>Change Email</p>
                  <TextField value={email} onChange={handleEmChange} ></TextField>
              </div>
             </div>
           </div>
           <button className= "forgetBtn" onClick={() => setIsOpen(false)}>
                  Recover Password
            </button>

         </div>
       </div>
     </>
  );  
};

export const Info = ({isOpen, setIsOpen }: ModalProps) => {
if (!isOpen){ return null}
return (
  <>
    <div className= "darkBG" onClick={() => setIsOpen(false)} />
    <div className= "centered">
      <div className= "modal">
          <h5>P</h5>
        <button className= "closeBtn" onClick={() => setIsOpen(false)}>
          <RiCloseLine style={{ marginBottom: "-3px" }} />
        </button>
        <div className= "modalActions">
          <div className= "actionsContainer">
            </div>
           </div>
         </div>
       </div>
   </>
);  
};

export const Profile = ({isOpen, setIsOpen, setUID}: ProfileModalProps) => {
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
          <h1>Profile</h1>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
            <div className= "modalContent">
              <button className = "forgetBtn" onClick={ () => setIsOpen(false)}>
                    Delete Account
              </button>
            </div>
          <div className= "modalActions">
            <p>Username: {parameter}</p>
              {/*<div className= "actionsContainer">
                <div>
                    <p>Change Username</p>
                    <TextField value={username} onChange={handleUnChange} ></TextField>
                    <button className = "forgetBtn" onClick={ () =>handleUnChange}>
                      →
                    </button>
                </div>
                <div>
                    <p>Change Email</p>
                    <TextField value={email} onChange={handleEmChange} ></TextField>
                    <button className = "forgetBtn" onClick={ () =>handleEmChange}>
                      →
                    </button>
                </div>
                <div>
                    <p>Change Password</p>
                    <TextField value={password} onChange={ handlePwChange} ></TextField>
                    <button className = "forgetBtn" onClick={ () =>handlePwChange}>
                      →
                    </button>
                </div>
              <div>
              */}
              <button onClick={() => {setUID(logout()); setIsOpen(false)}}>
                  Log Out
                </button>
        </div>
      </div>
    </div>
  </>
  );  
};

  export const Documentation = ({ isOpen, setIsOpen }: ModalProps) => {
    const [selectedNozzle, setSelectedNozzle] = useState<string>("");
    const [selectedController, setSelectedController] = useState<string>("");
    const [nozzleOptions, setNozzleOptions] = useState<Option[]>([]);
    const [controllerOptions, setControllerOptions] = useState<Option[]>([]);

    const handleNozzleClick = () => {
      const baseUrl = "https://portal.spray.com/en-us/products/"
      if (selectedNozzle) {
        window.open(`${baseUrl}${selectedNozzle.replace("/", "-")}`, "_blank")
      }
    }

    const handleControllerClick = () => {
      const baseUrl = "https://www.spray.com/products/spray-control-options/autojet-model-"
      const endUrl = "-spray-controller"
      if (selectedController) {
        window.open(`${baseUrl}${selectedController.replace("E", "").replace("+", "")}${endUrl}`, "_blank")
      }
    }

    async function loadNozzleOptions() {
      try {
      const nozzleNames = await createNozzleArray();
      nozzleNames.map(name => ({ value: name, label: name}))
      if (nozzleNames.length > 0) {
        setNozzleOptions(nozzleNames.map(name => ({ value: name, label: name})))
      }
    } catch (error) {
      console.error("Error Loading Nozzles", error)
    }
  }

    async function loadControllerOptions() {
      try {
      const controllerNames = await createControllerArray();
      if (controllerNames.length > 0) {
        setControllerOptions(controllerNames.map(name => ({ value: name, label: name})))
      }
    } catch (error) {
      console.error("Error Loading Controllers", error)
    }
  }
  useEffect(() => {
    if (isOpen){
      loadNozzleOptions()
      loadControllerOptions()
    }
  }, [isOpen])

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
              <Dropdown options={nozzleOptions} onChange={(value) => setSelectedNozzle(value)}/>
                <button className= "CancelBtn" onClick={handleNozzleClick}>
                →
                </button>
              </div>
              <div>
              <Dropdown options={controllerOptions} onChange={(value) => setSelectedController(value)}/>
                <button className= "CancelBtn" onClick={handleControllerClick}>
                →
                </button>
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


  export const SaveLoad = ({ isOpen, setIsOpen, projectState, parameterMap, onLoad, userIDstate}: SaveLoadProps) => {
    const [selectedButton, setSelectedButton] = useState(-1);
    const [projects, setProjects] = projectState;
    const [projectList, setProjectList] = useState(constructProjectList());
    const [userID] = userIDstate;
    console.log("Projects: " + projects);
    async function save(){
      const renameProjectInput: HTMLInputElement|null = document.querySelector("#rename_project");
      if(renameProjectInput){
        const nameParam: UtilityInterfaces.Parameter = {
          name: "project_name",
          type: UtilityInterfaces.types.STRING,
          value: renameProjectInput.value
        }
        parameterMap.set("project_name", nameParam)
      }
      setIsOpen(false);
      await saveProject(userID, parameterMap);
      setProjects(await listUserProjects(userID));
      setProjectList(constructProjectList());    
    }
    async function loadProject(){
      console.log("Loading Project " + selectedButton);
      parameterMap = await createProjectMap(userID, selectedButton);
      console.log(parameterMap);
      onLoad(parameterMap);
      setIsOpen(false);
    }
    async function tryToDelete(){
      await deleteProject(userID, selectedButton);
      setProjects(await listUserProjects(userID));
      setIsOpen(false);
    }
    function clickedProjectButton(project_id: number){
      document.getElementById("open_project_button")?.removeAttribute("disabled");
      document.getElementById("delete_project_button")?.removeAttribute("disabled");
      setSelectedButton(project_id);
    }
    function constructProjectList(){
      projects.sort((a:Models.ProjectBase, b:Models.ProjectBase) => 
        new Date(b.last_modified_date).getTime() - new Date(a.last_modified_date).getTime());
      const projectList = projects.map(project => <li
        key = {project.project_id}>
        <button id={"pb_" + project.project_id} onClick={() => clickedProjectButton(project.project_id)}>{project.project_name}</button>
      </li>)
      return projectList;
    }
    
    if (!isOpen){ return null}
    let projectName = parameterMap.get("project_name")?.value;
    if(typeof(projectName) != "string"){
      projectName = "Default Name";
    }
    
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
            <div id="save_modal_content" className= "modalContent">
              <input id="rename_project" type="text" placeholder={projectName}></input>
            <button onClick={save}>Save Project</button>
              {projectList}
            </div>
            <div className= "modalActions">
              <div className= "actionsContainer">
                <button id="delete_project_button" className= "deleteBtn" onClick={() => {tryToDelete()}}>
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