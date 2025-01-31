import React from 'react';
import "./styles/Drawer.css";

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
    <div className={classNames}>
      <div className='Close' onClick={onClose}>
        X
      </div>
        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
          </div>
        </div>
      </div>
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
    <div className={classNames}>
      <div className='Close' onClick={onClose}>
        X
      </div>
        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
            </div>
        </div>
    </div>
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
    <div className={classNames}>
      <div className='Close' onClick={onClose}>
        X
      </div>
        <div className = 'scrollable-container'>
          <div className ='Content'>
            {children}
            </div>
        </div>
    </div>
  );
};