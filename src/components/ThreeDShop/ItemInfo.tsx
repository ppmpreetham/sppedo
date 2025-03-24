import { ClothingItem } from "@/types";
import { useStore } from "../../store/store";
import { useRouter } from "next/router";

type ItemInfoProps = {
  item: ClothingItem;
};

export function ItemInfo({ item }: ItemInfoProps) {
  const router = useRouter();
  const selectItem = useStore((state) => state.selectItem);
  const addToCart = useStore((state) => state.addToCart);

  const handleViewDetails = () => {
    selectItem(item);
    // Fix: Change the navigation to use the correct path pattern
    router.push(`/product?id=${item.id}`);
  };

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="fixed right-8 top-1/3 transform -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg w-64 z-50">
      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{item.description}</p>
      <p className="text-sm text-gray-800 mb-1">
        Color: <span className="capitalize">{item.color}</span>
      </p>
      <p className="font-bold text-blue-600 mb-3">${item.price.toFixed(2)}</p>

      <div className="flex justify-between">
        <button
          onClick={handleViewDetails}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-3 rounded"
        >
          View Details
        </button>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
