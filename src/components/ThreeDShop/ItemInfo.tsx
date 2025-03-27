import { ClothingItem } from "../../types";
import { useStore } from "../../store/store";
import { useRouter } from "next/router";

type ItemInfoProps = {
  item: ClothingItem;
};

export function ItemInfo({ item }: ItemInfoProps) {
  const router = useRouter();
  const selectItem = useStore((state) => state.selectItem);

  const handleViewProduct = () => {
    selectItem(item);
    router.push(`/product?id=${item.id}`);
  };

  return (
    <div className="fixed right-8 top-1/3 transform -translate-y-1/2 bg-black bg-opacity-90 p-4 rounded-lg shadow-lg w-64 z-50 border border-gray-700">
      <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
      <p className="text-gray-300 mb-2 text-sm">
        {item.description.substring(0, 60)}...
      </p>
      <p className="font-bold text-blue-400 mb-3">${item.price.toFixed(2)}</p>

      <button
        onClick={handleViewProduct}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition-colors"
      >
        Click to view
      </button>
    </div>
  );
}
