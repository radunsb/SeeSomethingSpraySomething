import React from "react";
import './Modals.css';
import { RiCloseLine } from "react-icons/ri";

interface ModalProps{
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}

interface TextFieldProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
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
                <button className= "loginSwitchBtn" onClick={() => setIsOpen(false)}>
                  Log In
                </button>

                <button className= "createSwitchBtn" onClick={() => setIsOpen(false)}>
                  Create Account
                </button>

                <button className= "forgetBtn" onClick={() => setIsOpen(false)}>
                  Forget Password
                </button>

                <button className= "loginBtn" onClick={() => setIsOpen(false)}>
                  Login
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export const SignIn = ({ isOpen, setIsOpen }: ModalProps) => {
    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <div className= "modalHeader">
              <h5 className= "heading">Dialog</h5>
            </div>
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

export const Profile = ({isOpen, setIsOpen }: ModalProps) => {
  if (!isOpen){ return null}
  return (
    <>
      <div className= "darkBG" onClick={() => setIsOpen(false)} />
      <div className= "centered">
        <div className= "modal">
          <div className= "modalHeader">
            <h5 className= "heading">Dialog</h5>
          </div>
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
    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <div className= "modalHeader">
              <h5 className= "heading">Dialog</h5>
            </div>
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

  export const SaveLoad = ({ isOpen, setIsOpen }: ModalProps) => {
    if (!isOpen){ return null}
    return (
      <>
        <div className= "darkBG" onClick={() => setIsOpen(false)} />
        <div className= "centered">
          <div className= "modal">
            <div className= "modalHeader">
              <h5 className= "heading">Dialog</h5>
            </div>
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