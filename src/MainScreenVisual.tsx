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

  // Size of the nozzles (currently just black cubes)
  const nozzle_size: [number, number, number] = [.25,.25,.25];

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
        
        {/* Conveyor belt */}
        <Conveyor width={line_width/2} length={20} height={5} piece_height={.25} piece_length={1.5}/>

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
// Conveyor Component
type ConveyorProps = {
  width: number;
  length: number;
  height: number;
  piece_height: number;
  piece_length: number;
};

const Conveyor: React.FC<ConveyorProps> = ({ width, length, height, piece_height, piece_length }) => {
  const num_pieces: number = Math.floor(length / 1.75); // Ensure it's an integer

  return (
    <group>
      {Array.from({ length: num_pieces }).map((_, index) => (
        <Box
          key={index}
          position={[0, -1, index * (piece_length+.25) * -1]} // Space each piece with a .25 gap and extend the belt away from camera
          size={[width, piece_height, piece_length]} 
          color="gray" 
        />
      ))}
    </group>
  );
};
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
};
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
