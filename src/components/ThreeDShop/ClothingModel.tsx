import { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useStore } from "../../store/store";
import { useRouter } from "next/router";
import * as THREE from "three";
import { ClothingItem } from "../../types";
import { useFrame } from "@react-three/fiber";

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
  const [clonedScene] = useState(() => scene.clone());

  // Create an object for smooth animation
  const animatedScale = useRef({
    x: scale[0],
    y: scale[1],
    z: scale[2],
  });

  // Apply color to the model right away when the component mounts
  useEffect(() => {
    // Apply the color to the model
    if (clonedScene) {
      const colorHex = colorMap[item.color] || "#ffffff";

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
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

    // Play animations if available
    if (actions && actions.idle) {
      actions.idle.play();
    }
  }, [clonedScene, item.color, actions]);

  // Smooth transition for hover effect using useFrame
  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const targetScale = hovered ? 1.2 : 1.0;

    // Smooth interpolation for scale
    animatedScale.current.x = THREE.MathUtils.lerp(
      animatedScale.current.x,
      scale[0] * targetScale,
      delta * 4 // Adjust this value to control animation speed
    );

    animatedScale.current.y = THREE.MathUtils.lerp(
      animatedScale.current.y,
      scale[1] * targetScale,
      delta * 4
    );

    animatedScale.current.z = THREE.MathUtils.lerp(
      animatedScale.current.z,
      scale[2] * targetScale,
      delta * 4
    );

    // Apply the animated scale
    modelRef.current.scale.set(
      animatedScale.current.x,
      animatedScale.current.y,
      animatedScale.current.z
    );
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    // Make sure to call onHover with the item
    if (onHover) onHover(item);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    // Clear the hovered item
    if (onHover) onHover(null);
  };

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
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload models to improve performance
useGLTF.preload("/models/tshirt.glb");
useGLTF.preload("/models/jeans.glb");
