import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useStore } from "../../store/store";
import { ClothingItem } from "@/types";
import * as THREE from "three";
import { useRouter } from "next/router";

type ClothingModelProps = {
  item: ClothingItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onClick?: () => void;
  onHover?: (item: ClothingItem | null) => void;
};

// Color mapping for items
const colorMap = {
  white: "#ffffff",
  black: "#222222",
  red: "#ff3333",
  blue: "#3333ff",
  gray: "#999999",
  brown: "#8b4513",
};

export function ClothingModel({
  item,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  onClick,
  onHover,
}: ClothingModelProps) {
  const { scene, animations } = useGLTF(item.modelPath);
  const selectItem = useStore((state) => state.selectItem);
  const router = useRouter();
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Play any animations if needed
    if (actions && actions.idle) {
      actions.idle.play();
    }

    // Apply the color to the model
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const color = colorMap[item.color] || "#ffffff";

          // If the material is an array, iterate through it
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              const newMat = mat.clone();
              newMat.color.set(color);
              return newMat;
            });
          } else {
            // Clone the material to avoid affecting other instances
            const material = child.material.clone();
            material.color.set(color);
            child.material = material;
          }
        }
      });
    }
  }, [actions, scene, item.color]);

  // Add hover effect
  useEffect(() => {
    if (modelRef.current) {
      const scaleFactor = hovered ? 1.1 : 1;
      modelRef.current.scale.set(
        scale[0] * scaleFactor,
        scale[1] * scaleFactor,
        scale[2] * scaleFactor
      );
    }

    // Pass hover state to parent
    if (onHover) {
      onHover(hovered ? item : null);
    }
  }, [hovered, scale, item, onHover]);

  const handleClick = (e) => {
    e.stopPropagation();
    selectItem(item);

    // Navigate to product page with correct query parameter
    router.push(`/product?id=${item.id}`);

    if (onClick) onClick();
  };

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene.clone()} />

      {/* Item label */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial
          color="white"
          opacity={hovered ? 0.9 : 0.6}
          transparent
          side={THREE.DoubleSide}
        />
        <Html position={[0, 0, 0]} center>
          <div className="text-black text-xs font-bold">{item.name}</div>
        </Html>
      </mesh>
    </group>
  );
}

// Preload models to improve performance
useGLTF.preload("../../../models/tshirt.glb");
useGLTF.preload("../../../models/jeans.glb");
