import { useRouter } from "next/router";
import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { useStore } from "../store/store";
import Link from "next/link";
import dynamic from "next/dynamic";
import Head from "next/head";
import "../app/globals.css";
import { ClothingItem } from "../types";

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

  type ClothingItemWithSize = ClothingItem & { selectedSize: string };
  const cartItems = useStore((state) => state.user.cartItems);

  const [selectedSize, setSelectedSize] = useState("");
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
    color: string;
    availableSizes: string[];
    modelPath: string;
  } | null>(null);

  // Find the product by ID once the query param is available
  useEffect(() => {
    if (id && clothingItems.length > 0) {
      const foundProduct = clothingItems.find((item) => item.id === id) || null;
      setProduct(foundProduct);
    }
  }, [id, clothingItems]);

  // Show loading while waiting for product data
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        {id ? "Loading product..." : "Product not found"}
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }

    addToCart({
      ...product,
      selectedSize, // Store the selected size with the product
    } as ClothingItemWithSize);

    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    existingCart.push({
      ...product,
      selectedSize,
    });
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show success message
    alert(`${product.name} added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{product.name} | 3D Shopping Experience</title>
        <meta name="description" content={product.description} />
      </Head>

      {/* Navigation bar with cart and home buttons */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-800 z-10">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <Link href="/shop" className="flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>

          <Link href="/cart" className="flex items-center text-white relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="mb-8 mt-8">
          <Link
            href="/shop"
            className="text-blue-400 hover:underline flex items-center"
          >
            ← Back to Store
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product details - LEFT */}
          <div className="w-full lg:w-1/2 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-blue-400 font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-white">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-600"
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
                        : "bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-red-400 text-sm mt-2">
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
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="/cart"
                className="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-center"
              >
                View Cart
              </Link>
              <Link
                href="/shop"
                className="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* 3D Model - RIGHT */}
          <div className="w-full lg:w-1/2 bg-gray-900 rounded-lg shadow-lg h-96 md:h-[500px]">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 0, 4], fov: 50 }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={1} />
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
            <div className="text-center mt-2 text-sm text-gray-300">
              Drag to rotate the model
            </div>
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
