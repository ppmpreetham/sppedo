import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function StoreEnvironment() {
  const storeRef = useRef(null);

  return (
    <group ref={storeRef}>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Main store structure */}
      <group position={[0, 0, 0]}>
        {/* Main floor with slight elevation */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[30, 0.2, 30]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* Walls */}
        <mesh position={[0, 5, -15]} castShadow>
          <boxGeometry args={[30, 10, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, 5, 15]} castShadow>
          <boxGeometry args={[30, 10, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh position={[-15, 5, 0]} castShadow>
          <boxGeometry args={[0.3, 10, 30]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh position={[15, 5, 0]} castShadow>
          <boxGeometry args={[0.3, 10, 30]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Center display platform */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[5, 5, 0.4, 32]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>

        {/* Side display platforms */}
        <mesh position={[-5, 0.2, -5]} receiveShadow>
          <boxGeometry args={[10, 0.4, 6]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>

        <mesh position={[5, 0.2, -5]} receiveShadow>
          <boxGeometry args={[10, 0.4, 6]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>

        {/* Ceiling lights */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <mesh key={i} position={[0, 9.9, -10 + i * 5]} castShadow>
              <boxGeometry args={[1, 0.1, 1]} />
              <meshStandardMaterial emissive="#ffff80" emissiveIntensity={1} />
            </mesh>
          ))}
      </group>
    </group>
  );
}
