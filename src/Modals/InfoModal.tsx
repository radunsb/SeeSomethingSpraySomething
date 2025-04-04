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
    "The percentage of Open time to Close time during a single cycle of the nozzle.",
    "The force applied on the liquid as it exits the nozzle", 
    "Last Time changes were made and saved in this proeject",
    "In feet per second the rate at which the conveyor belt turns",
    "In inches the width of the conveyor belt",
    "Number of nozzles present above current project",
    "In inches the distance a nozzle lies above the conveyor belt",
    "In inches the distance between a nozzle and another nozzle above the conveyor belt",
    "The numerical representation of a user account",
    "In inches, the sprayed products height",
    "In inches, the sprayed products length",
    "In inches, the sprayed products width",
    "Textual Representation of a projects purpose",
    "The numerical representation of a created project",
    "Text identifier of the project",
    "In inches the distance between the product sensor and the nozzle array",
    "In seconds, the amount of time liquid flows out of the nozzle",
    "In seconds, the time from when the product is sensed, and when the nozzle starts spraying",
    "In Seconds The time the nozzles remain spraying after the product is no longer detected by the sensor",
    "In degrees the amount of tilt the nozzle head has in comparison to the conveyor belt",
    "In gallons per minutes the amount of liquid exiting a nozzle",
    "A link to the Spraying Systems catalog containing information on this nozzle", 
    "The numerical representation of a nozzle",
    "Text identifier of the nozzle",
    "In degrees the angle of liquid spray exiting a nozzle",
    "In degrees the amount of tilt the nozzle head has in comparison to the conveyor belt",
    "A link to the Spraying Systems catalog containing information on this controller",
    "The numerical representation of a controller",
    "Text identifier of the controller",
    "The numerical representation of a spray gun",
    "Text identifier of the spray gun",
    "In number of cycles per minute, the amount of open and close sequences a nozzle makes",
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