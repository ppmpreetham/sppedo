import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";
import { useStore } from "../../store/store";

export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const moveUser = useStore((state) => state.moveUser);
  const rotateUser = useStore((state) => state.rotateUser);
  const position = useStore((state) => state.user.position);
  const rotation = useStore((state) => state.user.rotation);

  const { camera } = useThree();

  const [, getKeys] = useKeyboardControls();

  const direction = useRef(new THREE.Vector3());
  // Front direction
  const frontVector = useRef(new THREE.Vector3());
  // Side direction
  const sideVector = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    // Get camera direction vectors
    camera.getWorldDirection(frontVector.current);
    frontVector.current.y = 0; // Keep movement on xz plane
    frontVector.current.normalize();

    // side vector (perpendicular to forward direction)
    sideVector.current.set(frontVector.current.z, 0, -frontVector.current.x);

    // Reset direction
    direction.current.set(0, 0, 0);

    // Combine directions based on keys pressed
    if (forward) direction.current.add(frontVector.current);
    if (backward) direction.current.sub(frontVector.current);
    if (left) direction.current.sub(sideVector.current);
    if (right) direction.current.add(sideVector.current);

    // normalize for consistent speed in all directions
    if (direction.current.length() > 0) direction.current.normalize();

    // calculate movement distance
    const moveSpeed = 5 * delta;

    // calculate new position
    let newPosition = [...position] as [number, number, number];

    if (direction.current.length() > 0) {
      newPosition[0] += direction.current.x * moveSpeed;
      newPosition[2] += direction.current.z * moveSpeed;

      // Update store with new position
      moveUser(newPosition);

      // Update player position in the scene
      if (playerRef.current) {
        playerRef.current.position.set(
          newPosition[0],
          newPosition[1],
          newPosition[2]
        );
      }

      // Update camera position
      camera.position.set(
        newPosition[0],
        newPosition[1] + 1.6, // Eye height
        newPosition[2]
      );
    }

    // Extract rotation from camera
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
    rotateUser(euler.y);
  });

  return (
    <>
      <PointerLockControls />
      <group ref={playerRef} position={position}>
        {/* Player body - invisible in first person but visible to others */}
        <mesh scale={[0.5, 1, 0.5]} visible={false}>
          <capsuleGeometry args={[0.3, 1, 4, 8]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>
    </>
  );
}
