import { UtilityInterfaces } from "./utility/models";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import { useRef } from "react";


//------------------------------------------------------------------------------------------------------
// Component for the simulation model
type MainScreenVisualProps = {
  parameterMap: Map<string, UtilityInterfaces.Parameter>;
};

const MainScreenVisual: React.FC<MainScreenVisualProps> = ({parameterMap}) => {

  // Get all of the values from the current model that we need to build the visual
  const line_speed: number = (parameterMap.get('line_speed')?.value ?? 0) as number;
  const line_width: number = ((parameterMap.get('line_width')?.value ?? 0) as number)/2;
  const nozzle_height: number = ((parameterMap.get('nozzle_height')?.value ?? 0) as number)/2;
  const spray_angle: number = (parameterMap.get('angle')?.value ?? 0) as number;
  const nozzle_count: number = (parameterMap.get('nozzle_count')?.value ?? 0) as number;
  const nozzle_spacing: number = ((parameterMap.get('nozzle_spacing')?.value ?? 0) as number)/2;
  const sensor_distance: number = ((parameterMap.get('sensor_distance')?.value ?? 0) as number)/2;
  const product_width: number = ((parameterMap.get('product_width')?.value ?? 0) as number)/2;
  const product_length: number = ((parameterMap.get('product_length')?.value ?? 0) as number)/2;
  const product_height: number = ((parameterMap.get('product_height')?.value ?? 0) as number)/2;

  return (
    <Canvas>
      {/* Origin Marker */}
      {/* <Box position={[0,0,0]} size={[.1,.1,.1]} color={'black'}/> */}

      {/* Camera Controls: Moveable, Zoomable, Focus Point */}
      <OrbitControls />

      {/* Model Lighting:
      - Directional light coming in from the right (of the original camera angle)
      - Hemisphere light to light from top to bottom (white to gray)
      - ambient light to light everything at a low intensity
      */}
      <directionalLight position={[5,2,2]} intensity={2} />
      <hemisphereLight args={["#fff", "#333", 1]}/>
      <ambientLight intensity={.5}/>
      
      {/* Conveyor belt */}
      <Conveyor position={[0,-1,(sensor_distance)+product_length+8]} width={line_width} length={(sensor_distance)+product_length+16+sensor_distance+product_length}/>
      <Sensor distance={sensor_distance} />
      {/* Product */}
      <Box position={[0,-1+(product_height/2)+.125,(sensor_distance)+product_length/2+4]} size={[product_width, product_height, product_length]} color={"darkgray"}/>

      {/* Nozzle Apparatus */}
      <NozzleApparatus
        position={[0,-1,0]}
        num_nozzles={nozzle_count}
        nozzle_spacing={nozzle_spacing}
        nozzle_height={nozzle_height}
        spray_angle={spray_angle}
      />
    </Canvas>
  );
};
export default MainScreenVisual;
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Nozzle Apparatus
type NozzleApparatusProps = {
  position: [number, number, number];
  num_nozzles: number;
  nozzle_spacing: number;
  nozzle_height: number;
  spray_angle: number;
};

const NozzleApparatus: React.FC<NozzleApparatusProps> = ({
  position,
  num_nozzles,
  nozzle_spacing,
  nozzle_height,
  spray_angle,
}) => {
  const nozzles = Array.from({ length: num_nozzles }).map((_, index) => {
    const xPosition = index * nozzle_spacing - (nozzle_spacing * (num_nozzles - 1)) / 2;
    const location: [number, number, number] = [xPosition, nozzle_height, 0];
    return <Nozzle key={`${index}_${location}_${spray_angle}`} location={location} spray_angle={spray_angle} />;
  });

  return <group position={position}>{nozzles}</group>;
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
      <meshStandardMaterial color={'silver'}/>
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
  const num_pieces: number = Math.floor(length / 1.75);
  const firstPieceZ = 0;
  const lastPieceZ = (num_pieces - 1) * (1.5 + 0.25) * -1;
  const pieceHeight = 0.25;

  return (
    <group position={position}>
      {Array.from({ length: num_pieces }).map((_, index) => (
        <>
          <Box
            key={`main-${index}`}
            position={[0, 0, index * (1.5 + 0.25) * -1]}
            size={[width, pieceHeight, 1.5]}
            color="gray"
          />
          {/* Smaller pieces */}
          {index < num_pieces - 1 && (
            <Box
              key={`small-${index}`}
              position={[0, 0, (index * (1.5 + 0.25) - 0.875) * -1]}
              size={[width, pieceHeight / 2, 0.25]}
              color="darkgray"
            />
          )}
        </>
      ))}
      {/* <mesh position={[0, -0.875, firstPieceZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[.75, .75, width]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0, -0.875, lastPieceZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[.75, .75, width]} />
        <meshStandardMaterial color="black" />
      </mesh> */}
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

//------------------------------------------------------------------------------------------------------
// Sensor Component

type SensorProps = {
  distance: number;
};

const Sensor: React.FC<SensorProps> = ({distance}) => {
  return (
    <mesh position={[0, -.875, distance]}>
      <cylinderGeometry args={[.25,.25,.01]}/>
      <meshStandardMaterial color={'red'}/>
    </mesh>
  );
};
//------------------------------------------------------------------------------------------------------