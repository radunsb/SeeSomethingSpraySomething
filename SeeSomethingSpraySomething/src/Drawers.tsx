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
  direction = DrawerDirection.Right,
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

export { Drawer, DrawerDirection };