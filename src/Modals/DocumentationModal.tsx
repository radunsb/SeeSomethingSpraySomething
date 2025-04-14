import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { createNozzleArray, createControllerArray} from "../utility/ProjectUtilities";
import { ModalProps, Option } from "./ModalInterfaces.tsx";
import '../styles/Modals.css';

  export const Documentation = ({ isOpen, setIsOpen }: ModalProps) => {
    const [_nozzleOptions, setNozzleOptions] = useState<Option[]>([]);
    const [_controllerOptions, setControllerOptions] = useState<Option[]>([]);


    async function baseURL(){
      window.open('https://www.spray.com/products/product-overview')
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
              You are about to exit the Spraying Systems Spray Simulator App.
              </div>
              <div>
              You will be taken to the Spraying Systems general catalog website
              </div>
              <div>
                <button className= "CancelBtn" onClick={ baseURL }>
                GO
                </button>
              </div>
          </div>
        </div>
      </>
    );
  };