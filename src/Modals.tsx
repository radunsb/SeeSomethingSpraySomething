import React, { useState, useEffect } from "react";
import './styles/Modals.css';
import { RiCloseLine } from "react-icons/ri";
import { login, UserInfoResponse } from "./utility/auth_requests";
import { resetPassword} from "./utility/ProjectUtilities";
import "./App.tsx";
import { AccountModalProps } from "./Modals/ModalInterfaces.tsx";


interface ModalProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}

interface ResetPasswordModalProps extends ModalProps{
  setUserInfo: (arg: Promise<UserInfoResponse>) => void;
}

interface PasswordModalProps extends ModalProps{
  setIsFSOpen: (arg0: boolean) => void;
  setIsCAOpen: (arg0: boolean) => void;
  setIsLIOpen: (arg0: boolean) => void;
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
  console.log(`changing dropdown value to: ${value}`);
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

export const SignIn = ({ isOpen, setIsLIOpen, setIsCAOpen, setIsFPOpen, setUserInfo }: AccountModalProps) => {
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
          <button className= "onLoginSwitchBtn">
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
            </div>
                <input type="password" value={password} onChange={(e)=>{handlePwChange(e.target.value)}} ></input>
            &nbsp;
            <div>
              <button className= "forgetBtn" onClick={() => setIsFPOpen(true)}>
                Forgot Password
              </button>
            </div>
              <div>
              <button className= "loginBtn" onClick={() => {setUserInfo(login(username, password)); setIsLIOpen(false)}}>
                Login
              </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export const ResetPassword = ({isOpen, setIsOpen, setIsFSOpen, setIsCAOpen, setIsLIOpen }: PasswordModalProps) => {
    const [email, setEmail] = useState('');
    const handleEmChange = (newEm:string) => {
        setEmail(newEm);}

    async function tryToReset(){
      await resetPassword(email);
      setIsOpen(false);
    }
if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={() => setIsOpen(false)} />
      <div className= "centered">
        <div className= "modal">
            <h3>Please Enter Your Email So That We Can Send You A Password Recovery Link</h3>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className= "modalActions">
            <div className= "actionsContainer">
              <div>
                  <p>Email</p>
                  <TextField value={email} onChange={handleEmChange} ></TextField>
              </div>
             </div>
           </div>
           <button className= "forgetBtn" onClick={() => {tryToReset; setIsOpen(false); setIsFSOpen(true); setIsCAOpen(false); setIsLIOpen(false)}}>
                  Recover Password
            </button>

         </div>
       </div>
     </>
  );  
};

export const ResetPasswordConfirm = ({isOpen, setIsOpen }: ModalProps) => {
if (!isOpen){ return null}
return (
  <>
    <div className= "darkBG" onClick={() => setIsOpen(false)} />
    <div className= "centered">
      <div className= "modal">
        <button className= "closeBtn" onClick={() => setIsOpen(false)}>
          <RiCloseLine style={{ marginBottom: "-3px" }} />
        </button>
        <div className= "modalActions">
          <div className= "actionsContainer">
            <div>
                <p>An Email has been sent to your account to recover your password</p>
                <p>Please use the link within the next hour to reset your password</p>
            </div>
           </div>
         </div>
       </div>
     </div>
   </>
);  
};

export const ResetPasswordPostLink = ({isOpen, setIsOpen, setUserInfo }: ResetPasswordModalProps) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const handleUnChange = (newUn:string) => {
    setUserName(newUn);}
  const handlePwChange = (newPw:string) => {
    setPassword(newPw);}
  if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={() => setIsOpen(false)} />
      <div className= "centered">
        <div className= "modal">
            <h5>Please Enter Your New Password</h5>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className= "modalActions">
            <div className= "actionsContainer">
              <div>
              <div>
              <p>Username</p>
              <TextField value={username} onChange={handleUnChange} ></TextField>
              </div>
              <p>Password</p>
              <TextField value={password} onChange={ handlePwChange} ></TextField>

              <p>Confirm Password</p>
              <TextField value={password} onChange={ handlePwChange} ></TextField>
              </div>
             </div>
             <button className= "loginBtn" onClick={() => {setUserInfo(login(username, password)); setIsOpen(false)}}>
                  Change Password
             </button>
           </div>
         </div>
       </div>
     </>
  );  
  };
