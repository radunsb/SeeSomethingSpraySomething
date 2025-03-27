import { UtilityInterfaces } from "./utility/models";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import { useRef, useEffect, useState } from "react";


//------------------------------------------------------------------------------------------------------
// Component for the simulation model
type MainScreenVisualProps = {
  parameterMap: Map<string, UtilityInterfaces.Parameter>;
};

const MainScreenVisual: React.FC<MainScreenVisualProps> = ({parameterMap}) => {

  const SCALING_FACTOR = 2;

  // Get all of the values from the current model that we need to build the visual
  const line_speed: number = (parameterMap.get('line_speed')?.value ?? 0) as number;
  const line_width: number = ((parameterMap.get('line_width')?.value ?? 0) as number)/SCALING_FACTOR;
  const nozzle_height: number = ((parameterMap.get('nozzle_height')?.value ?? 0) as number)/SCALING_FACTOR;
  const spray_angle: number = (parameterMap.get('angle')?.value ?? 0) as number;
  const nozzle_count: number = (parameterMap.get('nozzle_count')?.value ?? 0) as number;
  const nozzle_spacing: number = ((parameterMap.get('nozzle_spacing')?.value ?? 0) as number)/SCALING_FACTOR;
  const sensor_distance: number = ((parameterMap.get('sensor_distance')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_width: number = ((parameterMap.get('product_width')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_length: number = ((parameterMap.get('product_length')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_height: number = ((parameterMap.get('product_height')?.value ?? 0) as number)/SCALING_FACTOR;
  const twist_angle: number = ((parameterMap.get('twist_angle')?.value ?? 0) as number);

  const [sliderValue, setSliderValue] = useState(-100);

  const handleSliderChange = (event: any) => {
    setSliderValue(parseFloat(event.target.value));
    console.log(sliderValue);
  }

  // console.log(-((sensor_distance)+product_length+8));
  // console.log((sensor_distance)+product_length+16+sensor_distance+product_length);

  return (
    <div id="mainScreenVisual">
      <Canvas camera = {{ position: [-1*line_width/2, nozzle_height, nozzle_height*2] }}>
        {/* Camera Controls: Moveable, Zoomable, Focus Point */}
        
        <OrbitControls 
          maxPolarAngle={Math.PI / 2}
        />

        {/* Model Lighting:
        - Directional light coming in from the right (of the original camera angle)
        - Hemisphere light to light from top to bottom (white to gray)
        - ambient light to light everything at a low intensity
        */}
        <directionalLight position={[5,10,0]} intensity={2} />
        <hemisphereLight args={["#fff", "#333", 1]}/>
        <ambientLight intensity={.5}/>

        {/* Conveyor belt */}
        <Conveyor position={[0,-1,(sensor_distance)+product_length+8]} width={line_width} length={(sensor_distance*3)+(product_length*2)+16}/>
        <Sensor distance={sensor_distance} />
        {/* Product */}
        <Product size={[product_width, product_height, product_length]} sliderValue={sliderValue} sensor_distance={sensor_distance}/>
        {/* (sensor_distance)+product_length/2+4 */}

        {/* Nozzle Apparatus */}
        <NozzleApparatus
          position={[0,-1,0]}
          num_nozzles={nozzle_count}
          nozzle_spacing={nozzle_spacing}
          nozzle_height={nozzle_height}
          spray_angle={spray_angle}
          twist_angle={twist_angle}
        />
        </Canvas>
        <input
          id="productSlider"
          type="range"
          min="-100"
          max="100"
          step="0.1"
          value={sliderValue}
          onChange={handleSliderChange}
        />
    </div>
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
  twist_angle: number;
};

const NozzleApparatus: React.FC<NozzleApparatusProps> = ({
  position,
  num_nozzles,
  nozzle_spacing,
  nozzle_height,
  spray_angle,
  twist_angle
}) => {
  const nozzles = Array.from({ length: num_nozzles }).map((_, index) => {
    const xPosition = index * nozzle_spacing - (nozzle_spacing * (num_nozzles - 1)) / 2;
    const location: [number, number, number] = [xPosition, nozzle_height, 0];
    return <Nozzle key={`${index}_${location}_${spray_angle}`} location={location} spray_angle={spray_angle} twist_angle={twist_angle} />;
  });

  return <group position={position}>{nozzles}</group>;
};
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Nozzle Component
type NozzleProps = {
  location: [number, number, number];
  spray_angle: number;
  twist_angle: number;
};

const Nozzle: React.FC<NozzleProps> = ({location, spray_angle, twist_angle}) => {
  const GUN_SIZE:[number, number, number] = [.2, .2, .2];
  const TIP_SIZE:[number, number, number] = [.1, .1, .05];

  return (
    <group>
      <mesh position = {[location[0], location[1] + .125, location[2]]}>
      <cylinderGeometry args={GUN_SIZE}/>
      <meshStandardMaterial color={'silver'}/>
      </mesh>
      <mesh position={location}>
        <cylinderGeometry args={TIP_SIZE}/>
        <meshStandardMaterial color={'yellow'}/>
      </mesh>
      <Spray top_vertex={location} angle={spray_angle} height={location[1]} twist_angle={twist_angle}/>
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
  const BIG_PIECE_LENGTH: number = 1.5;
  const SMALL_PIECE_LENGTH: number = 0.25;

  const num_pieces: number = Math.floor(length / 1.75);
  const firstPieceZ = 0;
  const lastPieceZ = (num_pieces - 1) * (BIG_PIECE_LENGTH + SMALL_PIECE_LENGTH) * -1;
  const pieceHeight = 0.25;

  return (
    <group position={position}>
      {Array.from({ length: num_pieces }).map((_, index) => (
        <>
          <Box
            key={`big-${index}`}
            position={[0, 0, index * (BIG_PIECE_LENGTH + SMALL_PIECE_LENGTH) * -1]}
            size={[width, pieceHeight, BIG_PIECE_LENGTH]}
            color="gray"
          />
          {/* Smaller pieces */}
          {index < num_pieces - 1 && (
            <Box
              key={`small-${index}`}
              position={[0, 0, (index * (BIG_PIECE_LENGTH + SMALL_PIECE_LENGTH) - 0.875) * -1]}
              size={[width, pieceHeight / 2, SMALL_PIECE_LENGTH]}
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
// Product Component
type ProductProps = {
  size: [number, number, number];
  sliderValue: number;
  sensor_distance: number;
};

const Product: React.FC<ProductProps> = ({size, sliderValue, sensor_distance}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if(meshRef.current){
      meshRef.current.position.z = (sliderValue/100)*(((sensor_distance)+size[2]));
    }
  });

  return (
    <mesh position={[0,-1+(size[1]/2)+.125, 0]} ref={meshRef} >
      <boxGeometry args={size}/>
      <meshStandardMaterial color={"silver"} roughness={.5}/>
    </mesh>
  );
};
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
// Typing for Spray Component

type SprayProps = {
  top_vertex: [number, number, number];
  angle: number; // Assume this is in degrees
  height: number;
  twist_angle: number; // in degrees
  color?: string;
  transparency?: number;
};

const Spray: React.FC<SprayProps> = ({ top_vertex, angle, height, twist_angle, color = "blue", transparency = .15}) => {
  const [x, y, z] = top_vertex;
  const angleInRadians = angle * (Math.PI / 180);
  const r = height * Math.tan(angleInRadians / 2);

  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.center();
      meshRef.current.position.y = top_vertex[1]/2;
      meshRef.current.position.x = top_vertex[0];
    }
  }, [meshRef]);

  const vertices = new Float32Array([
    x, y, z,    // Top vertex
    x - r, y - height, z + .1,
    x + r, y - height, z + .1,
    x + r, y - height, z - .1,
    x - r, y - height, z - .1,
  ]);

  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1,
    1, 2, 3,
    1, 3, 4
  ]);

  return (
    <mesh ref={meshRef} rotation={[0,-1*twist_angle*Math.PI/180,0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={vertices} count={5} itemSize={3} />
        <bufferAttribute attach="index" array={indices} count={indices.length} itemSize={1} />
      </bufferGeometry>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={transparency} />
    </mesh>
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
    <mesh position={[0, -.875, -distance]}>
      <cylinderGeometry args={[.25,.25,.01]}/>
      <meshStandardMaterial color={'red'}/>
    </mesh>
  );
};
//------------------------------------------------------------------------------------------------------