import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useStore } from "../../store/store";
import { ClothingItem } from "@/types";
import * as THREE from "three";

type ClothingModelProps = {
  item: ClothingItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onClick?: () => void;
};

export function ClothingModel({
  item,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  onClick,
}: ClothingModelProps) {
  const { scene, animations } = useGLTF(item.modelPath);
  const selectItem = useStore((state) => state.selectItem);
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    // Play any animations if needed
    if (actions && actions.idle) {
      actions.idle.play();
    }
  }, [actions]);

  const handleClick = (e) => {
    e.stopPropagation();
    selectItem(item);
    if (onClick) onClick();
  };

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    />
  );
}
