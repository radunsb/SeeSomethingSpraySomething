import React, { useState } from 'react';
//import Project from './Project.tsx'; // Import the Project component
//import Models from './utility/models.ts';
//import {createProjectMap} from './utility/ProjectUtilities.ts';
import changeParameterList from './App.tsx';

const MainScreenVisual = (parameterMap: Map<string, any>, setParameterMap: Function) => {

  const [inputValue, setInputValue] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    setInputValue(e.target.value);
    //parameterMap.set(e.target.name, e.target.value);
    setParameterMap(parameterMap.set(e.target.name, e.target.value));
    changeParameterList
  }

  return (
    <div>
      <div>
        <h2>Project Details</h2>
        {parameterMap.get("line_speed")}
        {/*{parameterMap.get("line_width")}
        {parameterMap.get("nozzle_height")}*/}
        {/*<input name='line_speed' value={inputValue} onChange={handleChange}/>*/}
      </div>
    </div>
  );
};

export default MainScreenVisual;
