import React from 'react';

import "./styles/Drawer.css";

export enum DrawerDirection {
  Left = 'Left',
  Right = 'Right',
}

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  direction?: DrawerDirection;
  onClose: () => void;
};

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
      <div className="scrollable-container">
      <div className='Content'>{children}</div>
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
      <div className='Content'>{children}</div>
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
      <div className='Content'>{children}</div>
    </div>
  );
};