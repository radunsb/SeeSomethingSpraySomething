import axios from "axios";
import { logout } from "../utility/auth_requests";
import { ConfirmProps } from "./ModalInterfaces";
import '../styles/Modals.css';

export const Confirm = ({isOpen, setIsOpen, item, setIsParentOpen, userID, setUserInfo}: ConfirmProps) => {
  if (!isOpen){ return null}
  async function delete_user(){
        await axios.post(`${__BACKEND_URL__}/api/v1/users/${userID}/delete_user`)
        .catch(error => console.error(error));
      setUserInfo(logout());
      setIsParentOpen(false);
      setIsOpen(false);
  }
  return (
    <div className="darkBG">
        <div className= "confirm-modal centered modal">
            <h3>Are you sure you want to delete:</h3>
            <h2>{item}?</h2>
            <button className="deleteBtn" onClick={delete_user}>Confirm</button>
            <button className="saveBtn" onClick={() => {setIsOpen(false);setIsParentOpen(true);}}>Back</button>
        </div>
    </div>
  );  
};