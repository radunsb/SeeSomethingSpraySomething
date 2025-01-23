import React, { useState } from 'react';
import { UtilityInterfaces } from "./utility/models";
import {Canvas} from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from 'three';

//------------------------------------------------------------------------------------------------------
// Component for the simulation model
const MainScreenVisual = (parameterMap: Map<string, UtilityInterfaces.Parameter>, setParameterMap: Function) => {

  // Get all of the values from the current model that we need to build the visual
  const line_speed: number = (parameterMap.get('line_speed')?.value ?? 0) as number;
  const line_width: number = (parameterMap.get('line_width')?.value ?? 0) as number;
  const nozzle_height: number = (parameterMap.get('nozzle_height')?.value ?? 0) as number;
  const spray_angle: number = (parameterMap.get('angle')?.value ?? 0) as number;
  const nozzle_count: number = (parameterMap.get('nozzle_count')?.value ?? 0) as number;
  const nozzle_spacing: number = (parameterMap.get('nozzle_spacing')?.value ?? 0) as number;
  const sensor_distance: number = (parameterMap.get('sensor_distance')?.value ?? 0) as number;

  // Size of one conveyor piece
  const conveyor_piece_size: [number, number, number] = [line_width/2,.25,1.5]

  // Size of the nozzles (currently just black cubes)
  const nozzle_size: [number, number, number] = [.25,.25,.25]

  return (
    <div id='model_container'>
      <Canvas>
        {/* Lighting of the model:
        - Directional light coming in from the right (of the original camera angle)
        - Hemisphere light to light from top to bottom (white to gray)
        - ambient light to light everything at a low intensity
        */}
        <directionalLight position={[5,2,2]} intensity={2} />
        <hemisphereLight args={["#fff", "#333", 1]}/>
        <ambientLight intensity={.5}/>
        
        {/* Conveyor belt components */}
        <group>
          <Box position={[0,-1,5.25]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,3.5]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,1.75]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,0]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-1.75]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-3.5]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-5.25]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-7]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-8.75]} color={"gray"} size={conveyor_piece_size}/>
          <Box position={[0,-1,-10.5]} color={"gray"} size={conveyor_piece_size}/>
        </group>

        {/* Nozzles */}
        <Box position={[-2,3,0]} color={"black"} size={nozzle_size}/>
        <Box position={[2,3,0]} color={"black"} size={nozzle_size}/>

        {/* Current Spray Patterns */}
        <Triangle vertices={[[-2, 3, 0],[-5, -1, 0],[1, -1, 0],]} color="blue" transparency={.3}/>
        <Triangle vertices={[[2, 3, 0],[-1, -1, 0],[5, -1, 0],]} color="blue" transparency={.3}/>


        {/* Allows the camera to be movable and zoomable */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};
export default MainScreenVisual;
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Typing for box components
type BoxProps = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
};

// Box Component
const Box: React.FC<BoxProps> = ({position, size, color}) => {
    return (
      <mesh position={position}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color}/>
      </mesh>
    );
}
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Typing for Triangle Component
type TriangleProps = {
  vertices: [[number, number, number], [number, number, number], [number, number, number]];
  color: string;
  transparency: number;
};

// Triangle Component
const Triangle: React.FC<TriangleProps> = ({ vertices, color = "#ffffff", transparency = 1 }) => {
  // Flatten the vertices array for the buffer attribute
  const flattenedVertices = new Float32Array(vertices.flat());

  return (
    <group>
      {/* Filled triangle */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={flattenedVertices}
            count={3}
            itemSize={3}
          />
        </bufferGeometry>
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={transparency}
        />
      </mesh>
    </group>
  );
};
//------------------------------------------------------------------------------------------------------
