import { UtilityInterfaces } from "./utility/models";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import { useRef, useState } from "react";

//------------------------------------------------------------------------------------------------------
// Component for the simulation model
type MainScreenVisualProps = {
  parameterMap: Map<string, UtilityInterfaces.Parameter>; //All of the project specs
};

const MainScreenVisual: React.FC<MainScreenVisualProps> = ({parameterMap}) => {

  const SCALING_FACTOR = 2;

  // Get all of the values from the current model that we need to build the visual
  const line_width: number = ((parameterMap.get('line_width')?.value ?? 0) as number)/SCALING_FACTOR;
  const nozzle_height: number = ((parameterMap.get('nozzle_height')?.value ?? 0) as number)/SCALING_FACTOR;
  const spray_angle: number = (parameterMap.get('angle')?.value ?? 0) as number;
  const nozzle_count: number = (parameterMap.get('nozzle_count')?.value ?? 0) as number;
  const nozzle_spacing: number = ((parameterMap.get('nozzle_spacing')?.value ?? 0) as number)/SCALING_FACTOR;
  const sensor_distance: number = ((parameterMap.get('sensor_distance')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_width: number = ((parameterMap.get('product_width')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_length: number = ((parameterMap.get('product_length')?.value ?? 0) as number)/SCALING_FACTOR;
  const product_height: number = ((parameterMap.get('product_height')?.value ?? 0) as number)/SCALING_FACTOR;
  // TODO: CHANGE TO ALIGNMENT???
  const twist_angle: number = ((parameterMap.get('twist_angle')?.value ?? 0) as number);
  console.log(`Twist Angle Start: ${twist_angle}`);

  // Setup the slider:
  // The slider goes from -100 to 100 starting at -100
  const [sliderValue, setSliderValue] = useState(-100);
  const handleSliderChange = (event: any) => {
    setSliderValue(parseFloat(event.target.value));
  }

  return (
    <div id="mainScreenVisual">
      {/* Initial Camera position on the canvas */}
      <Canvas camera = {{ position: [-1*line_width/2, nozzle_height, nozzle_height*2] }}>

        {/* Camera Controls: makes the camera moveable and restricts it to above the conveyor */}
        <OrbitControls 
          maxPolarAngle={Math.PI / 2}
        />

        {/* Model Lighting:
        - Directional light coming in from the right (of the original camera angle)
        - Hemisphere light to light from top to bottom (white to gray)
        - ambient light to light everything at a low intensity
        - TODO: Improving the lighting would allow for more interesting surfaces such as metallic
        */}
        <directionalLight position={[5,10,0]} intensity={2} />
        <hemisphereLight args={["#fff", "#333", 1]}/>
        <ambientLight intensity={.5}/>

        {/* Conveyor belt */}
        {/* All of the math in here just scales the conveyor length to the length of the product and the sensor distance, basically it just makes sure that no matter how long the product is, it will always be on the conveyor */}
        <Conveyor position={[0,-1,(sensor_distance)+product_length+8]} width={line_width} length={(sensor_distance*3)+(product_length*2)+16}/>
        <Sensor distance={sensor_distance} />
        {/* Product */}
        {/* Sensor distance is here to make sure that we position the product behind the sensor */}
        <Product size={[product_width, product_height, product_length]} sliderValue={sliderValue} sensor_distance={sensor_distance}/>

        {/* Nozzle Apparatus */}
        {/* The Nozzle Apparatus, Nozzle, and Spray components should be refactored because they are a mess of passing arguments down and confusing trigonometry, unfortunatley I probably do not have time to do this properly*/}
        {/* The -.875 is because the conveyor is located at y=-1 and so the nozzles need to be shifted down by 1. However, it also needs to line up with the top of the conveyor so it must be shifted up by half the conveyor width -> which is .125: -1 + .125 = -.875 */}
        <NozzleApparatus
          position={[0,-.875,0]}
          num_nozzles={nozzle_count}
          nozzle_spacing={nozzle_spacing}
          nozzle_height={nozzle_height}
          spray_angle={spray_angle}
          twist_angle={twist_angle}
          slider_val={sliderValue}
          product_length={product_length}
          sensor_distance={sensor_distance}
          product_height={product_height}
          product_width={product_width}
        />
        </Canvas>

        {/* Slider to move the product */}
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
  slider_val: number;
  product_length: number;
  sensor_distance: number;
  product_height: number;
  product_width: number;
};

const NozzleApparatus: React.FC<NozzleApparatusProps> = ({
  position,
  num_nozzles,
  nozzle_spacing,
  nozzle_height,
  spray_angle,
  twist_angle,
  slider_val,
  product_length,
  sensor_distance,
  product_height,
  product_width
}) => {
  // Makes a group of nozzles spaced properly
  const nozzles = Array.from({ length: num_nozzles }).map((_, index) => {
    const xPosition = index * nozzle_spacing - (nozzle_spacing * (num_nozzles - 1)) / 2;
    const location: [number, number, number] = [xPosition, nozzle_height, 0];
    // This mess of a key is because components re-render on key change; so this ensures that the spray re-renders whenever any of these parameters change
    return <Nozzle key={`${index}_${location}_${spray_angle}_${slider_val}_${product_width}_${product_height}_${twist_angle}`} location={location} spray_angle={spray_angle} twist_angle={twist_angle} slider_val={slider_val} product_length={product_length} sensor_distance={sensor_distance} product_height={product_height} product_width={product_width} nozzle_spacing={nozzle_spacing}/>;
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
  slider_val: number;
  product_length: number;
  sensor_distance: number;
  product_height: number;
  product_width: number;
  nozzle_spacing: number;
};

const Nozzle: React.FC<NozzleProps> = ({location, spray_angle, twist_angle, slider_val ,product_length, sensor_distance, product_height, product_width}) => {
  const GUN_SIZE:[number, number, number] = [.2, .2, .2];
  const TIP_SIZE:[number, number, number] = [.1, .1, .05];

  // This math is not very difficult, just trigonometry, but it is very confusing
  // Basically this block of 7 lines determines if the spray pattern needs adjusted when the product is slide underneath it to remove weird looks in the visual
  // For example: if the spray would be cut off by the corner of the product, this makes sure that the spray doesn't just cut through the product and get shown on the edge when it shouldn't be there
  // I don't know if any of that was helpful or not
  var height = location[1];
  const angleInRadians = spray_angle * (Math.PI / 180);
  const r = (height-product_height) * Math.tan(angleInRadians / 2);
  const twistAngleInRadians = -1*twist_angle*Math.PI/180;
  const lengthOffsetX = r * Math.cos(twistAngleInRadians);
  const widthOffsetX = (0.2/2) * Math.sin(twistAngleInRadians);
  const spray_width = ((lengthOffsetX + widthOffsetX) + Math.abs(location[0]));

  // Figure out if the product is under the spray and if the spray gets fully cut off by the product
  if (((slider_val <= (50*product_length)/(product_length+sensor_distance)) && (slider_val >= -1*(50*product_length)/(product_length+sensor_distance))) && spray_width < product_width/2){
    height = (height - product_height); // if it does, adjust the height of the spray to keep the visual consistent
  }
  return (
    // Return one nozzle with its spray pattern
    <group>
      <mesh position = {[location[0], location[1] + .125, location[2]]}>
      <cylinderGeometry args={GUN_SIZE}/>
      <meshStandardMaterial color={'silver'}/>
      </mesh>
      <mesh position={location}>
        <cylinderGeometry args={TIP_SIZE}/>
        <meshStandardMaterial color={'yellow'}/>
      </mesh>
      <Spray top_vertex={location} angle={spray_angle} height={height} twist_angle={twist_angle}/>
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
  // Conveyor Component
  // Lots of Magic Numbers that I just picked to make it look pretty good
  // None of the hardcoded numbers are really all that important individually, but certain ones need to be consistent with each other to keep the spacings correct
  // I wouldn't recommend changing these because the Nozzle Apparatus also relies on the thickness of the conveyor for the nozzle and spray height (other stuff might too)
  const BIG_PIECE_LENGTH: number = 1.5;
  const SMALL_PIECE_LENGTH: number = 0.25;
  const num_pieces: number = Math.floor(length / 1.75);
  const pieceHeight = 0.25;

  return (
    <group position={position}>
      {Array.from({ length: num_pieces }).map((_, index) => (
        <>
          <Box
            key={`big-${index}_${position}`}
            position={[0, 0, index * (BIG_PIECE_LENGTH + SMALL_PIECE_LENGTH) * -1]}
            size={[width, pieceHeight, BIG_PIECE_LENGTH]}
            color="gray"
          />
          {/* Smaller pieces */}
          {index < num_pieces - 1 && (
            <Box
              key={`small-${index}_${position}`}
              position={[0, 0, (index * (BIG_PIECE_LENGTH + SMALL_PIECE_LENGTH) - 0.875) * -1]}
              size={[width, pieceHeight / 2, SMALL_PIECE_LENGTH]}
              color="darkgray"
            />
          )}
        </>
      ))}
    </group>
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
  const twistAngleInRadians = -1*twist_angle*Math.PI/180;

  const lengthOffsetX = r * Math.cos(twistAngleInRadians);
  const widthOffsetX = (0.2/2) * Math.sin(twistAngleInRadians);
  const lengthOffsetZ = r * Math.sin(twistAngleInRadians);
  const widthOffsetZ = (0.2/2) * Math.cos(twistAngleInRadians);

  console.log(`Twist Angle Spray: ${twist_angle}`);
  console.log(`Twist Angle Radians: ${twistAngleInRadians}`);

  const vertices = new Float32Array([
    x, y, z,    // Top vertex
    x + lengthOffsetX + widthOffsetX, y - height, z - lengthOffsetZ + widthOffsetZ,
    x + lengthOffsetX - widthOffsetX, y - height, z - lengthOffsetZ - widthOffsetZ,
    x - lengthOffsetX + widthOffsetX, y - height, z + lengthOffsetZ + widthOffsetZ,
    x - lengthOffsetX - widthOffsetX, y - height, z + lengthOffsetZ - widthOffsetZ,
  ]);

  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 4,
    0, 3, 4,
    0, 1, 3,
    1, 2, 3,
    2, 3, 4,
  ]);

  return (
    <mesh>
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

//------------------------------------------------------------------------------------------------------
// Not much to see here just a simple rectangular prism component
// This is used for the conveyor belt pieces.
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

  // Allows the components position to be controlled by the slider
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if(meshRef.current){
      // scales the slider value because the slider values is always -100 - 100 regardless of product length, so the position needs to be scaled off it for variable product lengths
      meshRef.current.position.z = (sliderValue/100)*(((sensor_distance)+size[2]));
    }
  });

  return (
    // The .125 in the y position is half the thickness of the conveyor
    <mesh position={[0,-1+(size[1]/2)+.125, 0]} ref={meshRef} >
      <boxGeometry args={size}/>
      <meshStandardMaterial color={"silver"} roughness={.5}/>
    </mesh>
  );
};
//------------------------------------------------------------------------------------------------------