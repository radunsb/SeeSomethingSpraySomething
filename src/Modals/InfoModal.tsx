import { RiCloseLine } from "react-icons/ri";
import { InfoModalProps } from "./ModalInterfaces";
import '../styles/Modals.css';

  let paraNames: string[] = [
    "Duty Cycle", "Fluid Pressure", "Last Modified", "Line Speed", "Line Width", 
    "Nozzle Count", "Nozzle Height", "Nozzle Spacing", "Owner ID", 
    "Product Height", "Product Length", "Product Width", 
    "Project Description", "Project ID", "Project Name",
    "Sensor Distance", "Spray Duration", "Start Delay", "Stop Delay", "Alignment", "Flow Rate",
    "Nozz Doc Link",  "Nozzle ID", "Nozzle Name", "Spray Angle", "Spray Shape",
    "Controller Doc Link", "Controller ID", "Controller Name", "Gun Id", "Gun Name", "Max Frequency", "Overlap Distance"
  ]
  
  const paramDesc: string[] = [
    "The percentage of time the nozzles are spraying. Used along with max frequency to calculate the actual nozzle frequency",
    "The pressure on the fluid just before it exits the nozzle. Increased pressure causes increased flow rate.", 
    "Last Time changes were made and saved in this proeject",
    "The speed at which the product moves along the conveyor belt",
    "The width of the conveyor belt",
    "The number of nozzles on the spray manifold",
    "The vertical distance from the conveyor belt to the tip of each nozzle",
    "The horizontal spacing between the tips of two adjacent nozzles",
    "The numerical representation of a user account",
    "The height of the product to be sprayed",
    "The length of the product to be sprayed",
    "The width of the product to be sprayed. If line is narrower than project, no spray will appear",
    "Textual Representation of a projects purpose",
    "The numerical representation of a created project",
    "Text identifier of the project",
    "The distance from the sensor to the spray manifold",
    "In fixed time mode, this field determines how long the nozzles will spray for.",
    "In both fixed and variable time mode, this field determines how long the nozzles should wait to begin spraying after the sensor detects the front of the product",
    "In variable time mode, this field determines how long the nozzles should wat to stop spraying after the back of the product passes through the sensor",
    "The nozzle is rotated around the vertical axis by this angle. This is done to prevent turbulence in the overlap between nozzles",
    "This field should be filled with your nozzle's expected flow rate at 40psi. The actual flow rate is displayed below based on the pressure setting.",
    "A link to the Spraying Systems catalog containing information on this nozzle", 
    "The numerical representation of a nozzle",
    "Text identifier of the nozzle",
    "The width of each nozzle's spray fan",
    "The nozzle is rotated around the vertical axis by this angle. This is done to prevent turbulence in the overlap between nozzles",
    "A link to the Spraying Systems catalog containing information on this controller",
    "The numerical representation of a controller",
    "Text identifier of the controller",
    "The numerical representation of a spray gun",
    "Text identifier of the spray gun",
    "The maximum number of times per minute each nozzle could switch on and off. Used along with duty cycle to calculate the actual nozzle frequency",
    "The percentage of product sprayed with fluid from at least two nozzles"
  ]

  export const Info = ({isOpen, setIsOpen, selectedId }: InfoModalProps) => {
  if (!isOpen){ return null}
  return (
    <>
      <div className= "infodarkBG" onClick={() => setIsOpen(false)} />
      <div className= "infocentered">
        <div className= "infomodal">
          <h5>{selectedId !== null ? paraNames[selectedId] : "No Information Available"}</h5>
          <button className= "closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className= "modalActions">
            <div className= "actionsContainer">
              {selectedId !== null ? paramDesc[selectedId] : ""}
              </div>
             </div>
           </div>
         </div>
     </>
  );  
  };