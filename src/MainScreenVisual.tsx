// import React, { useState } from 'react';
import Project from './Project.tsx'; // Import the Project component

interface VisualProps {
  // lineSpeed: number;
  // setLineSpeed: React.Dispatch<React.SetStateAction<number>>;
}

const MainScreenVisual: React.FC<VisualProps> = (/*{ lineSpeed, setLineSpeed }*/) => {
  // const handleLineSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = Number(event.target.value);
  //   if (!isNaN(inputValue)) {
  //     setLineSpeed(inputValue);
  //   }
  // };

  const userID = 1;

  return (
    <div>
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="lineSpeedInput" style={{ whiteSpace: 'nowrap' }}>
          LineSpeed:
        </label>
        <input
          type="text"
          id="lineSpeedInput"
          name="lineSpeedInput"
          value={lineSpeed}
          onChange={handleLineSpeedChange}
          style={{ width: '25px' }}
        />
        <span>ft/s</span>
      </div> */}

      <div>
        <h2>Project Details</h2>
        <Project userID={userID} /> 
      </div>
    </div>
  );
};

export default MainScreenVisual;
