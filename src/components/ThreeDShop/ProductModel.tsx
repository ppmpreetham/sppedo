import { useRef, useEffect } from "react";
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

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const colorHex = colorMap[color] || "#ffffff";

          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              const newMat = mat.clone();
              newMat.color.set(colorHex);
              return newMat;
            });
          } else {
            const material = child.material.clone();
            material.color.set(colorHex);
            child.material = material;
          }
        }
      });
    }
  }, [scene, color]);

  return (
    <primitive ref={modelRef} object={scene.clone()} scale={[1.5, 1.5, 1.5]} />
  );
}

// Preload models to improve performance
useGLTF.preload("../../../models/tshirt.glb");
useGLTF.preload("../../../models/jeans.glb");
