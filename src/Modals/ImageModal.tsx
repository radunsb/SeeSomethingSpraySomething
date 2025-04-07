import { RiCloseLine } from "react-icons/ri";
import { ImageModalProps } from "./ModalInterfaces";

export const ImageModal = ({isOpen, setIsOpen, imagePath}: ImageModalProps) => {
  if(!isOpen) return null;
  return (
    <>
      <div className= "help-image-darkBG" onClick={() => setIsOpen(false)} />
      <div className= "help-image-modal">
        <button className= "closeBtn" onClick={() => setIsOpen(false)}>
          <RiCloseLine style={{ marginBottom: "-3px" }} />
        </button>
        <img src={imagePath} className="help-image"></img>
      </div>
    </>
  );  
};