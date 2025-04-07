import { RiCloseLine } from "react-icons/ri";
import { ResultsHelpProps } from "./ModalInterfaces";
import helpImage from "../assets/ResultsInfo.png"

  export const ResultsHelp = ({isOpen, setIsOpen}: ResultsHelpProps) => {
  if (!isOpen){ return null}
  return (
    <div className= "help-modal results-help">
      <button className= "closeBtn" onClick={() => setIsOpen(false)}>
        <RiCloseLine style={{ marginBottom: "-3px" }} />
      </button>
      <img src={helpImage} className="help-image"></img>
    </div>
  );  
  };