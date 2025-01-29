import React, { useState } from 'react';
import { UtilityInterfaces } from "./utility/models";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';

//------------------------------------------------------------------------------------------------------
// Component for the simulation model
const MainScreenVisual = (parameterMap: Map<string, UtilityInterfaces.Parameter>) => {

  // Get all of the values from the current model that we need to build the visual
  const line_speed: number = (parameterMap.get('line_speed')?.value ?? 0) as number;
  const line_width: number = (parameterMap.get('line_width')?.value ?? 0) as number;
  const nozzle_height: number = (parameterMap.get('nozzle_height')?.value ?? 0) as number;
  const spray_angle: number = (parameterMap.get('angle')?.value ?? 0) as number;
  const nozzle_count: number = (parameterMap.get('nozzle_count')?.value ?? 0) as number;
  const nozzle_spacing: number = (parameterMap.get('nozzle_spacing')?.value ?? 0) as number;
  const sensor_distance: number = (parameterMap.get('sensor_distance')?.value ?? 0) as number;

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
        <Conveyor position={[0,0,0]} width={line_width/2} length={20}/>

        <NozzleApparatus
          num_nozzles={nozzle_count}
          nozzle_spacing={nozzle_spacing/2}
          nozzle_height={nozzle_height/2}
          spray_angle={spray_angle}
        />
        {/* <NozzleApparatus
          num_nozzles={3}
          nozzle_spacing={6/2}
          nozzle_height={6/2}
          spray_angle={110}
        /> */}

        {/* Allows the camera to be movable and zoomable */}
        <OrbitControls target={[0, nozzle_height/4, 0]} />
      </Canvas>
    </div>
  );
};
export default MainScreenVisual;
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Nozzle Apparatus
type NozzleApparatusProps = {
  num_nozzles: number;
  nozzle_spacing: number;
  nozzle_height: number;
  spray_angle: number;
};

const NozzleApparatus: React.FC<NozzleApparatusProps> = ({
  num_nozzles,
  nozzle_spacing,
  nozzle_height,
  spray_angle,
}) => {
  const nozzles = Array.from({ length: num_nozzles }).map((_, index) => {
    const xPosition = index * nozzle_spacing - (nozzle_spacing * (num_nozzles - 1)) / 2;
    const location: [number, number, number] = [xPosition, nozzle_height, 0];
    return <Nozzle key={index} location={location} spray_angle={spray_angle} />;
  });

  return <group>{nozzles}</group>;
};
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Nozzle Component
type NozzleProps = {
  location: [number, number, number];
  spray_angle: number;
};

const Nozzle: React.FC<NozzleProps> = ({location, spray_angle}) => {

  return (
    <group>
      <mesh position = {[location[0], location[1] + .125, location[2]]}>
      <cylinderGeometry args={[.2, .2, .2]}/>
      <meshStandardMaterial color={'gray'}/>
      </mesh>
      <mesh position={location}>
        <cylinderGeometry args={[.1, .1, .05]}/>
        <meshStandardMaterial color={'yellow'}/>
      </mesh>
      <Triangle top_vertex={location} angle={spray_angle} height={location[1]}/>
    </group>
  );
};
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Conveyor Component
type ConveyorProps = {
  position: [number, number, number];
  width: number;
  length: number;
};

const Conveyor: React.FC<ConveyorProps> = ({ position, width, length }) => {
  const num_pieces: number = Math.floor(length / 1.75); // Ensure it's an integer

  return (
    <group>
      {Array.from({ length: num_pieces }).map((_, index) => (
        <Box
          key={index}
          position={[0, 0, index * (1.5+.25) * -1]} // Space each piece with a .25 gap and extend the belt away from camera
          size={[width, .25, 1.5]} 
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
  top_vertex: [number, number, number];
  angle: number; // Assume this is in degrees
  height: number;
  color?: string;
  transparency?: number;
};

const Triangle: React.FC<TriangleProps> = ({ top_vertex, angle, height, color = "blue", transparency = .3 }) => {
  const [x, y, z] = top_vertex;
  const angleInRadians = angle * (Math.PI / 180); // Convert to radians
  const r = height * Math.tan(angleInRadians / 2); // Half the base width

  const vertices = [
    top_vertex,
    [x - r, y - height, z],
    [x + r, y - height, z],
  ];

  const flattenedVertices = new Float32Array(vertices.flat());

  return (
    <group>
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
