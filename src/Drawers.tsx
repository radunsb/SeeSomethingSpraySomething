import React from 'react';
import "./styles/Drawer.css";

type StringDictionary<T> = {
  [key: string]: T;
};

let paramDesc: StringDictionary<string> = {
    "Duty Cycle": "The percentage of time when the fluid is flowing through the nozzle head",
    "Fluid Pressure": "The force applied on the liquid as it exits the nozzle", 
    "Last Modified": "Last Time changes were made and saved in this proeject",
    "Line Speed": "In feet per second the rate at which the conveyor belt turns",
    "Line Width": "In inches the width of the conveyor belt",
    "Nozzle Count": "Number of nozzles present above current project",
    "Nozzle Height": "In inches the distance a nozzle lies above the conveyor belt",
    "Nozzle Spacing": "In inches the distance between a nozzle and another nozzle above the conveyor belt",
    "Owner ID": "The numerical representation of a user account",
    "Product Height": "In inches, the sprayed products height",
    "Product Length": "In inches, the sprayed products length",
    "Product Width": "In inches, the sprayed products width",
    "Project ID": "The numerical representation of a created project",
    "Project Name": "Text identifier of the project",
    "Sensor Distance": "In inches the distance between the product sensor and the nozzle array",
    "Spray Duration": "In seconds, the amount of time liquid flows out of the nozzle",
    "Start Delay": "In seconds, they time from when the product begins moving, and when the nozzle starts spraying",
    "Stop Delay": "In seconds, they time from when the nozzles start spraying, ",
    "Angle": "In degrees the angle of liquid spray exiting a nozzle",
    "Flow Rate": "In gallons per minutes the amount of liquid exiting a nozzle",
    "Nozz Doc Link": "A link to the Spraying Systems catalog containing information on this nozzle", 
    "Nozzle ID": "The numerical representation of a nozzle",
    "Nozzle Name": "Text identifier of the nozzle",
    "Spray Shape": "The shape in which liquid will spray from the nozzle (ex. Fan, cone, etc)",
    "Twist Angle": "In degrees the amount of tilt the nozzle head has in comparison to the conveyor belt",
    "Controller Doc Link": "A link to the Spraying Systems catalog containing information on this controller",
    "Controller ID": "The numerical representation of a controller",
    "Controller Name": "Text identifier of the controller",
    "Gun ID": "The numerical representation of a spray gun",
    "Gun Name": "Text identifier of the spray gun",
    "Max Frequency": "In number of cycles per second, the amount of open and close sequences a nozzle makes"
}

export enum DrawerDirection {
  Left = 'Left',
  Right = 'Right',
}

interface Node {
  id: string;
  name?: string;
  children?: Node[];
}

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  direction?: DrawerDirection;
  onClose: () => void;
};

function populateChildren(node: Node, children: Node[]): void {
  if (!node.children) {
      node.children = [];
  }
  node.children.push(...children);
  children.forEach(child => {
      populateChildren(child, child.children || []); 
  });
}

export const NozzleDrawer = ({
  isOpen,
  children,
  direction = DrawerDirection.Left,
  onClose,
}: Props) => {
  const classNames = `Drawer ${direction} ${
    isOpen ? 'Open' : ''
  }`;

  return (
    <aside
    role="dialog"
    aria-labelledby="nozzle-drawer-title"
    aria-hidden={!isOpen}>
      <div className={classNames}>
        <h2 id="nozzle-drawer-title">Nozzle Settings</h2>
      <div className='Close' onClick={onClose} aria-label="Close Nozzle Drawer">
        X
      </div>

        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};

export const LineDrawer = ({
  isOpen,
  children,
  direction = DrawerDirection.Left,
  onClose,
}: Props) => {
  const classNames = `Drawer ${direction} ${
    isOpen ? 'Open' : ''
  }`;

  return (
    <aside
    role="dialog"
    aria-labelledby="nozzle-drawer-title"
    aria-hidden={!isOpen}>
    <div className={classNames}>
      <h2 id="line-drawer-title">Line Settings</h2>
      <div className='Close' onClick={onClose} aria-label="Close Line Drawer">
        X
      </div>

        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
            </div>
        </div>
    </div>
    </aside>
  );
};

export const ControllerDrawer = ({
  isOpen,
  children,
  direction = DrawerDirection.Left,
  onClose,
}: Props) => {
  const classNames = `Drawer ${direction} ${
    isOpen ? 'Open' : ''
  }`;

  return (
    <aside
    role="dialog"
    aria-labelledby="controller-drawer-title"
    aria-hidden={!isOpen}>
    <div className={classNames}>
      <h2 id="controller-drawer-title">Controller Settings</h2>
      <div className='Close' onClick={onClose} aria-label="Close Line Drawer">
        X
      </div>

        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
            </div>
        </div>
    </div>
    </aside>
  );
};