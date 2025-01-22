import React, { useState } from 'react';
import { UtilityInterfaces } from "./utility/models"
import {Canvas} from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

const Cube = ({position, size, color}) => {
    return (
      <mesh position={position}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color}/>
      </mesh>
    );
}

const MainScreenVisual = (parameterMap: Map<string, UtilityInterfaces.Parameter>, setParameterMap: Function) => {

  // TODO: Get all of the valus from the current model that we need to build the visual
  const line_speed = parameterMap.get('line_speed').value;
  const line_width = parameterMap.get('line_width').value;
  const nozzle_height = parameterMap.get('nozzle_height').value;
  const spray_angle = parameterMap.get('angle').value;

  // console.log(spray_angle);

  return (
    <div>
      <div>
        <h1> Model </h1>
      </div>
      <Canvas>
        {/* <directionalLight position={[0,0,5]} />
        <directionalLight position={[0,2,0]} /> */}
        <directionalLight position={[5,2,2]} intensity={2} />
        <hemisphereLight args={["#fff", "#333", 1]}/>
        <ambientLight intensity={.5}/>

        <Cube position={[0,-2,0]} color={"gray"} size={[1,1,1]}/>
        <Cube position={[0,0,0]} color={"blue"} size={[1,1,1]}/>

        <OrbitControls />
      </Canvas>
      
    </div>
  );
};

export default MainScreenVisual;
