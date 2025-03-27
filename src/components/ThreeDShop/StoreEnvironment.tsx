import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";

export function StoreEnvironment() {
  const storeRef = useRef(null);
  const spotLightRef1 = useRef<any>(null);
  const spotLightRef2 = useRef<any>(null);

  // Subtle animation for certain light elements
  useFrame(({ clock }) => {
    if (spotLightRef1.current && spotLightRef2.current) {
      // Subtle light intensity pulsing
      const t = clock.getElapsedTime();
      spotLightRef1.current.intensity = 2 + Math.sin(t * 0.5) * 0.2;
      spotLightRef2.current.intensity = 2 + Math.sin(t * 0.5 + 1) * 0.2;
    }
  });

  return (
    <group ref={storeRef}>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.2} />
      </mesh>

      {/* Main store structure */}
      <group position={[0, 0, 0]}>
        {/* Main floor with slight elevation - polished dark floor */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[30, 0.2, 30]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Walls - dark walls for premium feel */}
        <mesh position={[0, 5, -15]} castShadow receiveShadow>
          <boxGeometry args={[30, 10, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        <mesh position={[0, 5, 15]} castShadow receiveShadow>
          <boxGeometry args={[30, 10, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        <mesh position={[-15, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 10, 30]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        <mesh position={[15, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 10, 30]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, 10, 0]} receiveShadow>
          <boxGeometry args={[30, 0.3, 30]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>

        {/* Center display platform - illuminate from below */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[5, 5, 0.4, 32]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing ring under center platform */}
        <mesh position={[0, 1.15, -3]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.1, 5.4, 32]} />
          <meshStandardMaterial
            color="#4080ff"
            emissive="#4080ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Side display platforms with backlit edges */}
        <mesh position={[-5, 0.2, -5]} receiveShadow>
          <boxGeometry args={[10, 0.4, 6]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing edge for left platform */}
        <mesh position={[-5, 0.05, -2.4]}>
          <boxGeometry args={[10.4, 0.1, 0.2]} />
          <meshStandardMaterial
            color="#ff4040"
            emissive="#ff4040"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[5, 0.2, -5]} receiveShadow>
          <boxGeometry args={[10, 0.4, 6]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing edge for right platform */}
        <mesh position={[5, 0.05, -2.4]}>
          <boxGeometry args={[10.4, 0.1, 0.2]} />
          <meshStandardMaterial
            color="#40ff80"
            emissive="#40ff80"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Modern ceiling track lights */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <group key={`ceiling-light-${i}`} position={[0, 9.8, -10 + i * 5]}>
              {/* Light housing */}
              <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
                <meshStandardMaterial
                  color="#222222"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Light beam effect */}
              <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.3, 0.1, 0.2, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={20}
                  transparent={true}
                  opacity={0.7}
                />
              </mesh>
            </group>
          ))}

        {/* Additional accent lights along the walls */}
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <group key={`wall-light-${i}`}>
              {/* Left wall */}
              <mesh position={[-14.8, 2, -10 + i * 4]} castShadow>
                <boxGeometry args={[0.1, 0.8, 0.3]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1}
                />
              </mesh>
              {/* Right wall */}
              <mesh position={[14.8, 2, -10 + i * 4]} castShadow>
                <boxGeometry args={[0.1, 0.8, 0.3]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1}
                />
              </mesh>
            </group>
          ))}

        {/* Spotlights for product highlights */}
        <group position={[-6, 9.7, -5]}>
          <SpotLight
            ref={spotLightRef1}
            position={[0, 0, 0]}
            angle={0.3}
            penumbra={0.6}
            intensity={2}
            distance={15}
            color="#ffffff"
            castShadow
            target-position={[-5, 0, -5]}
          />
        </group>

        <group position={[6, 9.7, -5]}>
          <SpotLight
            ref={spotLightRef2}
            position={[0, 0, 0]}
            angle={0.3}
            penumbra={0.6}
            intensity={2}
            distance={15}
            color="#ffffff"
            castShadow
            target-position={[5, 0, -5]}
          />
        </group>

        {/* Floor recessed lights */}
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <mesh
              key={`floor-light-${i}`}
              position={[-12 + i * 3.5, 0.12, 10]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.3, 16]} />
              <meshStandardMaterial
                color="#80c0ff"
                emissive="#80c0ff"
                emissiveIntensity={1}
              />
            </mesh>
          ))}
      </group>
    </group>
  );
}
