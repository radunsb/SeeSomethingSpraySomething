import { RiCloseLine } from "react-icons/ri";
import { logout } from "../utility/auth_requests";
import { ProfileModalProps } from "./ModalInterfaces";
import '../styles/Modals.css';
import { Confirm } from "./ConfirmModal";
import { useState } from "react";

  export const Profile = ({isOpen, setIsOpen, setUserInfo, userID, username, email}: ProfileModalProps) => {

    const [isConfirmOpen, setConfirmOpen] = useState(false);
    if(!isOpen && isConfirmOpen){
      return(
      <div className="confirm">
        {<Confirm isOpen={isConfirmOpen} setIsOpen={setConfirmOpen} item={"Your Account"} setIsParentOpen={setIsOpen} userID={userID} setUserInfo={setUserInfo}/>}
      </div>
      );
    }
    else if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />       
        <div className= "centered">
          <div className= "modal">
              <h3>Profile</h3>
            <button className= "closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className="modalContent">
              <p>Username: {username}</p>
              <p>Email: {email}</p>
            </div>
            <div className= "modalActions">
              <div className= "actionsContainer">
                <div>
                <button className="saveBtn" onClick={() => { setUserInfo(logout()); setIsOpen(false)}}>
                  Log Out
                </button>
                <br></br>
                <button className="deleteBtn" onClick={() => {setIsOpen(false);setConfirmOpen(true)}}>
                  Delete Account
                </button>
                </div>
              </div>
            </div>
           </div>
         </div>
       </>
    );  
  };
  
