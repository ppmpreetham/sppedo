import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ProductModelProps = {
  modelPath: string;
  color: string;
};

const colorMap = {
  white: "#ffffff",
  black: "#222222",
  red: "#ff3333",
  blue: "#3333ff",
  gray: "#999999",
  brown: "#8b4513",
};

export default function ProductModel({ modelPath, color }: ProductModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [clonedScene] = useState(() => scene.clone());

  useEffect(() => {
    if (clonedScene) {
      // Get the hexadecimal color value
      const colorHex = colorMap[color] || "#ffffff";

      // Apply color to all meshes in the model
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // For materials array
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              const newMat = mat.clone();
              newMat.color.set(colorHex);
              return newMat;
            });
          }
          // For single material
          else {
            const material = child.material.clone();
            material.color.set(colorHex);
            child.material = material;
          }
        }
      });
    }
  }, [clonedScene, color]); // Make sure to re-run when color changes

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={[1.5, 1.5, 1.5]}
      position={[0, -0.5, 0]}
    />
  );
}

// Preload models to improve performance
useGLTF.preload("/models/tshirt.glb");
useGLTF.preload("/models/jeans.glb");
