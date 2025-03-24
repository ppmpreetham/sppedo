import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Stats,
  KeyboardControls,
  Environment,
  Sky,
  Html,
} from "@react-three/drei";
import { useStore } from "../../store/store";
import { StoreEnvironment } from "./StoreEnvironment";
import { Player } from "./Player";
import { ClothingModel } from "./ClothingModel";
import { UI } from "./UI";
import { ItemInfo } from "./ItemInfo";

export function ShoppingMetaverse() {
  const clothingItems = useStore((state) => state.clothingItems);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Separate items by category
  const tShirts = clothingItems.filter((item) => item.category === "tops");
  const jeans = clothingItems.filter((item) => item.category === "bottoms");

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
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.6, 5], fov: 75 }}
          style={{ width: "100%", height: "100%" }}
        >
          <fog attach="fog" args={["#ffffff", 0, 40]} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 5, 5]}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Suspense fallback={null}>
            <StoreEnvironment />

            {/* T-Shirts Section - Left Side in a neat row */}
            <group position={[-5, 0, -5]}>
              <mesh position={[0, 0.05, 0]} receiveShadow>
                <boxGeometry args={[8, 0.1, 4]} />
                <meshStandardMaterial color="#e8e8e8" />
              </mesh>
              <Html position={[0, 2.5, -2]}>
                <div
                  className="bg-black bg-opacity-70 text-white p-2 text-center rounded"
                  style={{ width: "200px" }}
                >
                  T-Shirts Collection
                </div>
              </Html>

              {/* Display t-shirts in a neat row */}
              {tShirts.map((item, index) => {
                // Calculate position for a 2x2 grid layout
                const row = Math.floor(index / 2);
                const col = index % 2;

                return (
                  <ClothingModel
                    key={item.id}
                    item={item}
                    position={[
                      -2 + col * 4, // 2 columns with spacing
                      1.5,
                      -1 + row * 2, // Arrange in rows
                    ]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[0.75, 0.75, 0.75]}
                    onHover={setHoveredItem}
                  />
                );
              })}
            </group>

            {/* Jeans Section - Right Side in a neat row */}
            <group position={[5, 0, -5]}>
              <mesh position={[0, 0.05, 0]} receiveShadow>
                <boxGeometry args={[8, 0.1, 4]} />
                <meshStandardMaterial color="#e8e8e8" />
              </mesh>
              <Html position={[0, 2.5, -2]}>
                <div
                  className="bg-black bg-opacity-70 text-white p-2 text-center rounded"
                  style={{ width: "200px" }}
                >
                  Jeans Collection
                </div>
              </Html>

              {/* Display jeans in a neat row */}
              {jeans.map((item, index) => {
                // Calculate position for a 2x2 grid layout
                const row = Math.floor(index / 2);
                const col = index % 2;

                return (
                  <ClothingModel
                    key={item.id}
                    item={item}
                    position={[
                      -2 + col * 4, // 2 columns with spacing
                      1.5,
                      -1 + row * 2, // Arrange in rows
                    ]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[0.75, 0.75, 0.75]}
                    onHover={setHoveredItem}
                  />
                );
              })}
            </group>

            <Player />
            <Environment preset="city" />
            <Sky />
          </Suspense>

          {process.env.NODE_ENV === "development" && <Stats />}
        </Canvas>
      </KeyboardControls>

      {/* Crosshair in the center of the screen */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div
          className={`w-6 h-6 rounded-full border-2 border-white ${
            hoveredItem ? "scale-125" : ""
          } transition-transform duration-200`}
        ></div>
      </div>

      {/* Item info panel on the LEFT side when looking at an item */}
      {hoveredItem && <ItemInfo item={hoveredItem} />}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded">
        Click to look around with mouse | WASD to move
      </div>

      <UI />
    </div>
  );
}
