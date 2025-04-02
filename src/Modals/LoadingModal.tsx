import { LoadingProps } from "./ModalInterfaces"
import '../styles/Modals.css'

export const Loading = ({isOpen, setIsOpen, setBG}: LoadingProps) => {
    if(!isOpen){return null};
    return (
        <>
        {setBG == true &&
        <div className= "infodarkBG" onClick={() => setIsOpen(false)} />
        }
            <div className="loadingCentered">
                <div className="loader"></div>
                <h4>Loading....</h4>
            </div>
        </>
    );
};