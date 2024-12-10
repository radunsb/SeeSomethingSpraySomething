import React from 'react';
import './App.css';
import { Drawer } from './components/Drawer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsDrawerOpen(true)}>Open Drawer</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
      </Drawer>
    </div>
  );
}