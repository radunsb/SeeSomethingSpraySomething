import React, { useState } from 'react';
import { UtilityInterfaces } from "./utility/models";
import {Canvas} from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from 'three';

type CubeProps = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
};

const Cube: React.FC<CubeProps> = ({position, size, color}) => {
    return (
      <mesh position={position}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color}/>
      </mesh>
    );
}

const MainScreenVisual = (parameterMap: Map<string, UtilityInterfaces.Parameter>, setParameterMap: Function) => {

  const conveyor_piece_size: [number, number, number] = [12,.25,1.5]
  const nozzle_size: [number, number, number] = [.5,.5,.5]

  // TODO: Get all of the valus from the current model that we need to build the visual
  // const line_speed = parameterMap.get('line_speed').value;
  // const line_width = parameterMap.get('line_width').value;
  // const nozzle_height = parameterMap.get('nozzle_height').value;
  // const spray_angle = parameterMap.get('angle').value;

  // console.log(spray_angle);

  return (
    <div id='model_container'>
      <Canvas>
        {/* <directionalLight position={[0,0,5]} />
        <directionalLight position={[0,2,0]} /> */}
        <directionalLight position={[5,2,2]} intensity={2} />
        <hemisphereLight args={["#fff", "#333", 1]}/>
        <ambientLight intensity={.5}/>
        
        <group>
          <Cube position={[0,-1,5.25]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,3.5]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,1.75]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,0]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-1.75]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-3.5]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-5.25]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-7]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-8.75]} color={"gray"} size={conveyor_piece_size}/>
          <Cube position={[0,-1,-10.5]} color={"gray"} size={conveyor_piece_size}/>
        </group>

        <Cube position={[-2,3,0]} color={"black"} size={nozzle_size}/>
        <Cube position={[2,3,0]} color={"black"} size={nozzle_size}/>

        <Triangle vertices={[[-2, 3, 0],[-5, -1, 0],[1, -1, 0],]} width={1} color="blue" transparency={.3}/>
        <Triangle vertices={[[2, 3, 0],[-1, -1, 0],[5, -1, 0],]} width={1} color="blue" transparency={.3}/>

        {/* <Cube position={[0,0,0]} color={"blue"} size={[1,1,1]}/> */}

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default MainScreenVisual;

type TriangleProps = {
  vertices: [[number, number, number], [number, number, number], [number, number, number]];
  width: number;
  color: string;
  transparency: number;
};

const Triangle: React.FC<TriangleProps> = ({ vertices, width = 1, color = "#ffffff", transparency = 1 }) => {
  if (!vertices || vertices.length !== 3) {
    console.error("Triangle requires exactly 3 vertices.");
    return null;
  }

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

      {/* Outline (optional) */}
      {width > 0 && (
        <lineLoop>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={flattenedVertices}
              count={3}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            transparent={true}
            opacity={transparency}
            linewidth={width}
          />
        </lineLoop>
      )}
    </group>
  );
};
