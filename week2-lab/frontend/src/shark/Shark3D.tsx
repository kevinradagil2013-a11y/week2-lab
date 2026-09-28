import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import sharkModelUrl from './shark-realistic.glb?url';

export function Shark3D() {
  const group = useRef<THREE.Group>(null);

  const { scene, animations } =
    useGLTF(sharkModelUrl);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = false;

      const materials = Array.isArray(
        object.material,
      )
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (
          material instanceof
            THREE.MeshStandardMaterial ||
          material instanceof
            THREE.MeshPhysicalMaterial
        ) {
          material.side =
            THREE.FrontSide;

          material.metalness = 0;

          material.roughness = 0.78;

          material.envMapIntensity =
            0.22;

          material.needsUpdate = true;
        }
      });
    });

    return clone;
  }, [scene]);

  const { actions, mixer } =
    useAnimations(
      animations,
      group,
    );

  useEffect(() => {
    console.log(
      'NEBULAE SHARK ANIMATIONS:',
      animations.map(
        (animation) =>
          animation.name,
      ),
    );

    const swimming =
      actions[
        'Shark Rig|swimming_skeletal.3'
      ];

    if (!swimming) {
      console.warn(
        'Swimming animation not found.',
        Object.keys(actions),
      );

      return;
    }

    swimming.reset();

    swimming.setLoop(
      THREE.LoopRepeat,
      Infinity,
    );

    swimming.clampWhenFinished =
      false;

    swimming.setEffectiveWeight(1);

    swimming.setEffectiveTimeScale(
      0.72,
    );

    swimming.fadeIn(2.0);

    swimming.play();

    return () => {
      swimming.fadeOut(1.5);
      mixer.stopAllAction();
    };
  }, [actions, animations, mixer]);

  useFrame((state, delta) => {
    if (!group.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;

    /*
     * Movimiento natural del animal.
     *
     * No hacemos un movimiento sinusoidal
     * exagerado. Son pequeÃ±as correcciones,
     * como las que harÃ­a un animal mientras nada.
     */

    const forwardSpeed = 0.055;

    group.current.position.z +=
      forwardSpeed * delta;

    /*
     * Trayectoria ligeramente curva.
     */
    const targetX =
      Math.sin(time * 0.075) * 0.85;

    const targetY =
      -0.65 +
      Math.sin(time * 0.16) *
        0.16 +
      Math.sin(time * 0.43) *
        0.035;
group.current.position.x +=
      (targetX -
        group.current.position.x) *
      delta *
      0.18;

    /*
     * El tiburÃ³n SIEMPRE permanece
     * debajo de la superficie.
     */
    const minimumDepth =
      -0.75;

    if (
      group.current.position.y >
      minimumDepth
    ) {
      group.current.position.y =
        THREE.MathUtils.lerp(
          group.current.position.y,
          minimumDepth,
          delta * 2,
        );
    } else {
      group.current.position.y +=
        (targetY -
          group.current.position.y) *
        delta *
        0.16;
    }

    /*
     * Curva horizontal muy suave.
     */
    const desiredRotationY =
      Math.sin(time * 0.075) *
      0.12;

    group.current.rotation.y =
      THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.PI +
          desiredRotationY,
        delta * 0.7,
      );

    /*
     * PequeÃ±a inclinaciÃ³n vertical.
     */
    const desiredRotationX =
      Math.sin(time * 0.16) *
      0.035;

    group.current.rotation.x =
      THREE.MathUtils.lerp(
        group.current.rotation.x,
        desiredRotationX,
        delta * 0.6,
      );

    /*
     * Roll prÃ¡cticamente imperceptible.
     */
    const desiredRotationZ =
      Math.sin(time * 0.12) *
      0.018;

    group.current.rotation.z =
      THREE.MathUtils.lerp(
        group.current.rotation.z,
        desiredRotationZ,
        delta * 0.5,
      );

    /*
     * VariaciÃ³n mÃ­nima de velocidad
     * para evitar sensaciÃ³n mecÃ¡nica.
     */
    mixer.timeScale =
      0.72 +
      Math.sin(time * 0.31) *
        0.035;
  });

  const bounds = useMemo(() => {
    const box =
      new THREE.Box3().setFromObject(
        clonedScene,
      );

    const size =
      box.getSize(
        new THREE.Vector3(),
      );

    const center =
      box.getCenter(
        new THREE.Vector3(),
      );

    return {
      size,
      center,
    };
  }, [clonedScene]);

  const maxDimension =
    Math.max(
      bounds.size.x,
      bounds.size.y,
      bounds.size.z,
    );

  const scale =
    maxDimension > 0
      ? 4.8 / maxDimension
      : 1;

  return (
    <group
      ref={group}
      position={[
        0,
        -0.65,
        -1.2,
      ]}
      rotation={[
        0,
        Math.PI,
        0,
      ]}
      scale={scale}
    >
      <primitive
        object={clonedScene}
        position={[
          -bounds.center.x,
          -bounds.center.y,
          -bounds.center.z,
        ]}
      />
    </group>
  );
}

useGLTF.preload(sharkModelUrl);