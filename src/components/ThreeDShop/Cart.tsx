import { useState } from "react";
import { useStore } from "../../store/store";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useStore((state) => state.user.cartItems);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute left-4 top-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-10"
      >
        🛒 {cartItems.length}
      </button>
    );
  }

  return (
    <div className="absolute left-0 top-0 w-80 h-screen bg-white p-4 shadow-lg overflow-y-auto z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-black">Your cart is empty</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex gap-4">
                  <img
                    src={item.thumbnailPath}
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-black">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
