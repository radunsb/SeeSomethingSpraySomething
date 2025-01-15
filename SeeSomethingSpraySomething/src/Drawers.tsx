import React from 'react';

import "./Drawer.css";

enum DrawerDirection {
  Left = 'Left',
  Right = 'Right',
}

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  direction?: DrawerDirection;
  onClose: () => void;
};

const Drawer = ({
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

const NozzleDrawer = ({
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

const LineDrawer = ({
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

const ControllerDrawer = ({
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

export { Drawer, NozzleDrawer, LineDrawer, ControllerDrawer, DrawerDirection };