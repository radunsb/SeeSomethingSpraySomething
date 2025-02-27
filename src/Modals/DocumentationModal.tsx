import React, { useState, useEffect } from "react";
import './styles/Modals.css';
import { RiCloseLine } from "react-icons/ri";
import { createNozzleArray, createControllerArray} from "../utility/ProjectUtilities";

interface ModalProps{
    isOpen: boolean;
    setIsOpen: (arg0: boolean) => void;
  }

interface Option {
    value: string;
    label: string;
  }

interface DropdownProps {
  options: Option[];
  onChange: (value: string) => void;
}

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

  export const Documentation = ({ isOpen, setIsOpen }: ModalProps) => {
    const [selectedNozzle, setSelectedNozzle] = useState<string>("");
    const [selectedController, setSelectedController] = useState<string>("");
    const [nozzleOptions, setNozzleOptions] = useState<Option[]>([]);
    const [controllerOptions, setControllerOptions] = useState<Option[]>([]);

    const handleNozzleClick = () => {
      const baseUrl = "https://portal.spray.com/en-us/products/"
      if (selectedNozzle) {
        window.open(`${baseUrl}${selectedNozzle.replace("/", "-")}`, "_blank")
      }
    }

    const handleControllerClick = () => {
      const baseUrl = "https://www.spray.com/products/spray-control-options/autojet-model-"
      const endUrl = "-spray-controller"
      if (selectedController) {
        window.open(`${baseUrl}${selectedController.replace("E", "").replace("+", "")}${endUrl}`, "_blank")
      }
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
              <Dropdown options={nozzleOptions} onChange={(value) => setSelectedNozzle(value)}/>
                <button className= "CancelBtn" onClick={handleNozzleClick}>
                →
                </button>
              </div>
              <div>
              <Dropdown options={controllerOptions} onChange={(value) => setSelectedController(value)}/>
                <button className= "CancelBtn" onClick={handleControllerClick}>
                →
                </button>
              </div>
          </div>
        </div>
      </>
    );
  };