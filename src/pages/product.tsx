import { useRouter } from "next/router";
import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { useStore } from "../store/store";
import Link from "next/link";
import dynamic from "next/dynamic";
import Head from "next/head";

// Import the ProductModel dynamically to avoid SSR issues
const ProductModel = dynamic(
  () => import("../components/ThreeDShop/ProductModel"),
  { ssr: false }
);

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const clothingItems = useStore((state) => state.clothingItems);
  const addToCart = useStore((state) => state.addToCart);

  const [selectedSize, setSelectedSize] = useState("");
  const [product, setProduct] = useState(null);

  // Find the product by ID once the query param is available
  useEffect(() => {
    if (id && clothingItems.length > 0) {
      const foundProduct = clothingItems.find((item) => item.id === id);
      setProduct(foundProduct);
    }
  }, [id, clothingItems]);

  // Show loading while waiting for product data
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {id ? "Loading product..." : "Product not found"}
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product);
      // Show success message
      alert(`${product.name} added to your cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{product.name} | 3D Shopping Experience</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link
            href="/shop"
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to Store
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 3D Model View - LEFT */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg h-96 md:h-[500px] order-2 lg:order-1">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 0, 4], fov: 50 }}
            >
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.6}>
                  <ProductModel
                    modelPath={product.modelPath}
                    color={product.color}
                  />
                </Stage>
                <OrbitControls
                  autoRotate
                  makeDefault
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                />
              </Suspense>
            </Canvas>
            <div className="text-center mt-2 text-sm text-gray-500">
              Drag to rotate the model
            </div>
          </div>

          {/* Product details - RIGHT */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg order-1 lg:order-2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: getColorHex(product.color) }}
                ></div>
                <span className="capitalize">{product.color}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-red-500 text-sm mt-2">
                  Please select a size
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-3 px-4 rounded-md text-center text-white font-medium ${
                selectedSize
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorHex(color: string): string {
  const colorMap = {
    white: "#ffffff",
    black: "#222222",
    red: "#ff3333",
    blue: "#3333ff",
    gray: "#999999",
    brown: "#8b4513",
  };

  return colorMap[color] || "#ffffff";
}
