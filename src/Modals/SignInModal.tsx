import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { login, UserInfoResponse } from "../utility/auth_requests";
import { AccountModalProps } from "./ModalInterfaces";
import { TextField } from "./ModalUtil";
import '../styles/Modals.css';

async function makeLoginRequest(username:string, password:string, setUserInfo:(response:Promise<UserInfoResponse>)=>void, setFailedOpen:(open:boolean)=>void){
  console.log("making login request")
  
  const response = login(username, password);
  setUserInfo(response);

  //show the error message if the login fails
  const responseData = await response;
  setFailedOpen(responseData.uid === 1);
}


export const SignIn = ({ isOpen, setIsLIOpen, setIsCAOpen, setFailedOpen, setUserInfo }: AccountModalProps) => {
  function closeModal(){
    setIsLIOpen(false);
    setUserName("");
    setPassword("");
  }
  
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleUnChange = (newUn:string) => {
    setUserName(newUn);}

  const handlePwChange = (newPw:string) => {
    setPassword(newPw);}

  if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={closeModal} />
      <div className= "centered">
        <div className= "modal sign-in">
          <button className= "closeBtn" onClick={closeModal}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className="button-container">
          <button className= "onLoginSwitchBtn">
                Log In
          </button>
          <button className= "createSwitchBtn" onClick={() => {closeModal(); setIsCAOpen(true)}}>
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
                <input type="password" value={password} onChange={(e)=>{handlePwChange(e.target.value)}} ></input>
            </div>
            &nbsp;
            <div>
            </div>
              <div>
              <button className= "loginBtn" onClick={() => {makeLoginRequest(username, password, setUserInfo, setFailedOpen); closeModal();}}>
                Login
              </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};