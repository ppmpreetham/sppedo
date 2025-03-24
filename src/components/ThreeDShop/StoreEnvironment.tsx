import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function StoreEnvironment() {
  const storeRef = useRef(null);

  useFrame(() => {
    // Any animations or updates to the store environment
  });

  return (
    <mesh ref={storeRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";

// export function StoreEnvironment() {
//   // Assuming you have a 3D model for the store environment
//   // const { scene } = useGLTF("/models/store-environment.glb");
//   const storeRef = useRef(0);

//   useFrame(() => {
//     // Any animations or updates to the store environment
//   });

//   return (
//     <primitive
//       object={scene}
//       ref={storeRef}
//       scale={[1, 1, 1]}
//       position={[0, 0, 0]}
//     />
//   );
// }

// // useGLTF.preload("/models/store-environment.glb");
