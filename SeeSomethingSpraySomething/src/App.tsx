import React from 'react';
import './App.css';
import { Drawer } from './Drawers';
import { NavLink, Link } from "react-router";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsDrawerOpen(true)}>Open Drawer</button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <p>Drawer</p>
      </Drawer>
      <div>
          <Link to="/results">
            <button> Results </button>
          </Link>
          <Link to="/parameters">
            <button> Parameters </button>
          </Link>
      </div>
    </div>
  );
}