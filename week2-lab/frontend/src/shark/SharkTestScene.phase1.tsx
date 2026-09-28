import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';

import { Shark3D } from './Shark3D';

export function SharkTestScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#071923',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 50,
          near: 0.01,
          far: 1000,
        }}
      >
        <color
          attach="background"
          args={['#071923']}
        />

        <ambientLight intensity={8} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={12}
        />

        <directionalLight
          position={[-10, 5, 5]}
          intensity={8}
        />

        <pointLight
          position={[0, 0, 5]}
          intensity={20}
        />

        <Shark3D />

        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <mesh
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            color="#123b4d"
            side={THREE.DoubleSide}
          />
        </mesh>

        <gridHelper
          args={[20, 20, '#00ffff', '#16465b']}
          position={[0, -2, 0]}
        />

        <axesHelper args={[4]} />

        <OrbitControls
          enablePan
          minDistance={1}
          maxDistance={30}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}