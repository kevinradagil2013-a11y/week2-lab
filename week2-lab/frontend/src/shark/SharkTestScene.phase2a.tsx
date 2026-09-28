import { useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

import { Shark3D } from './Shark3D';

function OceanSurface() {
  const water = useMemo(() => {
    const geometry =
      new THREE.PlaneGeometry(
        180,
        180,
      );

    const normalsTexture =
      new THREE.TextureLoader().load(
        '/waternormals.jpg',
      );

    normalsTexture.wrapS =
      THREE.RepeatWrapping;

    normalsTexture.wrapT =
      THREE.RepeatWrapping;

    const waterObject = new Water(
      geometry,
      {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals:
          normalsTexture,
        sunDirection:
          new THREE.Vector3(
            0.4,
            1,
            0.3,
          ).normalize(),
        sunColor: 0xffffff,
        waterColor: 0x164b5f,
        distortionScale: 2.8,
        fog: true,
        alpha: 0.88,
      },
    );

    waterObject.rotation.x =
      -Math.PI / 2;

    waterObject.position.y = 0;

    return waterObject;
  }, []);

  useFrame((_, delta) => {
    const uniforms =
      water.material.uniforms;

    if (uniforms.time) {
      uniforms.time.value +=
        delta * 0.35;
    }
  });

  return (
    <primitive
      object={water}
    />
  );
}

function UnderwaterWorld() {
  const particles = useMemo(() => {
    const count = 1100;

    const positions =
      new Float32Array(
        count * 3,
      );

    for (
      let i = 0;
      i < count;
      i += 1
    ) {
      const i3 = i * 3;

      positions[i3] =
        (Math.random() - 0.5) *
        45;

      positions[i3 + 1] =
        -1 -
        Math.random() * 24;

      positions[i3 + 2] =
        (Math.random() - 0.5) *
        55;
    }

    return positions;
  }, []);

  const particleGeometry =
    useMemo(() => {
      const geometry =
        new THREE.BufferGeometry();

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
          particles,
          3,
        ),
      );

      return geometry;
    }, [particles]);

  useEffect(() => {
    return () => {
      particleGeometry.dispose();
    };
  }, [particleGeometry]);

  return (
    <points
      geometry={
        particleGeometry
      }
    >
      <pointsMaterial
        color="#a9e8ee"
        size={0.025}
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  );
}

function UnderwaterAtmosphere() {
  const { scene } =
    useThree();

  useEffect(() => {
    scene.fog =
      new THREE.FogExp2(
        0x062432,
        0.035,
      );

    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return null;
}

function CameraDirector() {
  const { camera } =
    useThree();

  useFrame((state) => {
    const time =
      state.clock.elapsedTime;

    const cycle =
      time % 32;

    let targetY = 1.8;
    let cameraY = 2.6;

    if (cycle < 10) {
      const progress =
        cycle / 10;

      cameraY =
        THREE.MathUtils.lerp(
          2.6,
          -1.8,
          progress,
        );

      targetY =
        THREE.MathUtils.lerp(
          0,
          -0.65,
          progress,
        );
    } else if (cycle < 24) {
      const progress =
        (cycle - 10) / 14;

      cameraY =
        THREE.MathUtils.lerp(
          -1.8,
          -3.2,
          progress,
        );

      targetY =
        -0.65 +
        Math.sin(
          progress *
            Math.PI *
            2,
        ) *
          0.25;
    } else {
      const progress =
        (cycle - 24) / 8;

      cameraY =
        THREE.MathUtils.lerp(
          -3.2,
          2.6,
          progress,
        );

      targetY =
        THREE.MathUtils.lerp(
          -0.65,
          0,
          progress,
        );
    }

    camera.position.x =
      Math.sin(time * 0.07) *
      2.4;

    camera.position.y =
      cameraY;

    camera.position.z =
      8.4 +
      Math.sin(time * 0.045) *
        0.45;

    const target =
      new THREE.Vector3(
        0,
        targetY,
        -1.5,
      );

    camera.lookAt(target);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov =
        cameraY < 0
          ? 54
          : 48;

      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function OceanLighting() {
  return (
    <>
      <ambientLight
        intensity={1.7}
        color="#b9e5f2"
      />

      <hemisphereLight
        color="#a8dbea"
        groundColor="#04151d"
        intensity={2}
      />

      <directionalLight
        position={[
          -30,
          45,
          20,
        ]}
        intensity={6}
        color="#fff7df"
        castShadow
      />

      <directionalLight
        position={[
          15,
          -10,
          -10,
        ]}
        intensity={1.5}
        color="#277c99"
      />
    </>
  );
}

function OceanBackground() {
  const { scene } =
    useThree();

  useEffect(() => {
    scene.background =
      new THREE.Color(
        '#7eb9c8',
      );

    return () => {
      scene.background =
        new THREE.Color(
          '#071923',
        );
    };
  }, [scene]);

  return null;
}

function OceanWorld() {
  return (
    <>
      <OceanBackground />

      <OceanLighting />

      <OceanSurface />

      <UnderwaterWorld />

      <UnderwaterAtmosphere />

      <Shark3D />

      <CameraDirector />
    </>
  );
}

export function SharkTestScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background:
          '#071923',
        overflow: 'hidden',
      }}
    >
      <Canvas
        shadows
        dpr={[
          1,
          1.6,
        ]}
        gl={{
          antialias: true,
          powerPreference:
            'high-performance',
          toneMapping:
            THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{
          position: [
            0,
            2.6,
            8.2,
          ],
          fov: 48,
          near: 0.05,
          far: 250,
        }}
      >
        <OceanWorld />
      </Canvas>
    </div>
  );
}