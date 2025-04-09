import { RiCloseLine } from "react-icons/ri";
import { AuthFailedProps } from "./ModalInterfaces";

export const AccountCreationFailed = ({isOpen, setIsOpen, setParentOpen}: AuthFailedProps) => {
  if (!isOpen){ return null}
  return (
    <div className="darkBG">
        <div className= "auth-message-modal centered modal">
            <button className= "closeBtn" onClick={() => {setIsOpen(false); setParentOpen(true)}}>
                <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <h2>Account Creation Failed</h2>
            <p>That user already exists</p>
        </div>
    </div>
  );  
};