import { useState } from "react";
import { useStore } from "../../store/store";

export function ItemDetailPanel() {
  const selectedItem = useStore((state) => state.user.selectedItem);
  const addToCart = useStore((state) => state.addToCart);
  const [selectedSize, setSelectedSize] = useState("");

  if (!selectedItem) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(selectedItem);
      // Optional: Show a confirmation message
    }
  };

  return (
    <div className="absolute right-0 top-0 w-80 h-screen bg-white p-4 shadow-lg overflow-y-auto z-10">
      <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
      <img
        src={selectedItem.thumbnailPath}
        alt={selectedItem.name}
        className="w-full h-60 object-cover mb-4"
      />
      <p className="text-lg font-semibold mb-2">
        ${selectedItem.price.toFixed(2)}
      </p>
      <p className="text-black mb-4">{selectedItem.description}</p>

      <div className="mb-4">
        <label className="block text-black mb-2">Select Size</label>
        <div className="flex gap-2">
          {selectedItem.availableSizes.map((size) => (
            <button
              key={size}
              className={`px-3 py-1 border rounded ${
                selectedSize === size ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className={`w-full py-2 px-4 rounded ${
          selectedSize
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
}
