import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, KeyboardControls, Environment, Sky } from "@react-three/drei";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useStore } from "../../store/store";
import { StoreEnvironment } from "./StoreEnvironment";
import { Player } from "./Player";
import { ClothingModel } from "./ClothingModel";
import { UI } from "./UI";

export function ShoppingMetaverse() {
  const clothingItems = useStore((state) => state.clothingItems);

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
          camera={{ position: [0, 1.6, 0], fov: 75 }}
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

            {/* Place clothing items around the store */}
            {clothingItems.map((item, index) => (
              <ClothingModel
                key={item.id}
                item={item}
                position={[
                  3 * Math.cos(index * (Math.PI / (clothingItems.length / 2))),
                  1,
                  3 * Math.sin(index * (Math.PI / (clothingItems.length / 2))),
                ]}
              />
            ))}

            <Player />
            <Environment preset="city" />
            <Sky />
          </Suspense>

          {process.env.NODE_ENV === "development" && <Stats />}
        </Canvas>
      </KeyboardControls>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded">
        Click to look around with mouse | WASD to move
      </div>

      <UI />
    </div>
  );
}
