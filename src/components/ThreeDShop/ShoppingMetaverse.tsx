import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useStore } from "../../store/store";
import { ClothingItem } from "../../types";
import { Player } from "./Player";
import { StoreEnvironment } from "./StoreEnvironment";
import { ClothingModel } from "./ClothingModel";
import { ItemInfo } from "./ItemInfo";

export function ShoppingMetaverse() {
  const clothingItems = useStore((state) => state.clothingItems);
  const [hoveredItem, setHoveredItem] = useState<ClothingItem | null>(null);

  const tShirts = clothingItems.filter((item) => item.category === "tops");
  const jeans = clothingItems.filter((item) => item.category === "bottoms");

  const handleItemHover = (item: ClothingItem | null) => {
    setHoveredItem(item);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "right", keys: ["ArrowLeft", "a", "A"] },
          { name: "left", keys: ["ArrowRight", "d", "D"] },
        ]}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.6, 5], fov: 75 }}
          style={{ width: "100%", height: "100%" }}
        >
          <fog attach="fog" args={["#ffffff", 0, 75]} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 5, 5]}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={null}>
            <StoreEnvironment />

            {/* Display T-Shirts */}
            {tShirts.map((item, index) => (
              <ClothingModel
                key={item.id}
                item={item}
                position={[-5 + index * 2.5, 1.2, -5]}
                scale={[1, 1, 1]}
                onHover={handleItemHover}
              />
            ))}

            {/* Display Jeans */}
            {jeans.map((item, index) => (
              <ClothingModel
                key={item.id}
                item={item}
                position={[5 - index * 2.5, 1, 0]}
                scale={[1, 1, 1]}
                onHover={handleItemHover}
              />
            ))}

            <Player />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* Item info panel when hover */}
      {hoveredItem && <ItemInfo item={hoveredItem} />}
    </div>
  );
}
