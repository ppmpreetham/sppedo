import { create } from "zustand";
import { ClothingItem, UserState } from "../types";
import { persist } from "zustand/middleware";

interface StoreState {
  // User state
  user: UserState;
  // Available clothing items
  clothingItems: ClothingItem[];
  // Actions
  moveUser: (position: [number, number, number]) => void;
  rotateUser: (rotation: number) => void;
  selectItem: (item: ClothingItem | null) => void;
  addToCart: (item: ClothingItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  initializeCartFromLocalStorage: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial user state
      user: {
        position: [0, 0, 5],
        rotation: 0,
        selectedItem: null,
        cartItems: [],
      },

      // Available clothing items
      clothingItems: [
        {
          id: "tshirt-white",
          name: "Classic White T-Shirt",
          modelPath: "/models/tshirt.glb",
          thumbnailPath: "/thumbnails/tshirt-white.jpg",
          price: 29.99,
          description:
            "A comfortable white t-shirt made from 100% cotton. Perfect for everyday wear.",
          availableSizes: ["S", "M", "L", "XL"],
          color: "white",
          category: "tops",
        },
        {
          id: "tshirt-black",
          name: "Classic Black T-Shirt",
          modelPath: "/models/tshirt.glb",
          thumbnailPath: "/thumbnails/tshirt-black.jpg",
          price: 29.99,
          description:
            "A sleek black t-shirt made from 100% cotton. Versatile and stylish.",
          availableSizes: ["S", "M", "L", "XL"],
          color: "black",
          category: "tops",
        },
        {
          id: "tshirt-red",
          name: "Vibrant Red T-Shirt",
          modelPath: "/models/tshirt.glb",
          thumbnailPath: "/thumbnails/tshirt-red.jpg",
          price: 32.99,
          description:
            "A bold red t-shirt that makes a statement. Made from premium cotton.",
          availableSizes: ["S", "M", "L", "XL"],
          color: "red",
          category: "tops",
        },
        {
          id: "jeans-blue",
          name: "Classic Blue Jeans",
          modelPath: "/models/jeans.glb",
          thumbnailPath: "/thumbnails/jeans-blue.jpg",
          price: 59.99,
          description:
            "Classic blue denim jeans with a regular fit. Durable and comfortable for everyday wear.",
          availableSizes: ["30", "32", "34", "36"],
          color: "blue",
          category: "bottoms",
        },
        {
          id: "jeans-black",
          name: "Modern Black Jeans",
          modelPath: "/models/jeans.glb",
          thumbnailPath: "/thumbnails/jeans-black.jpg",
          price: 64.99,
          description:
            "Sleek black jeans with a slim fit. Perfect for a modern, urban look.",
          availableSizes: ["30", "32", "34", "36"],
          color: "black",
          category: "bottoms",
        },
        {
          id: "jeans-gray",
          name: "Casual Gray Jeans",
          modelPath: "/models/jeans.glb",
          thumbnailPath: "/thumbnails/jeans-gray.jpg",
          price: 54.99,
          description:
            "Comfortable gray jeans with a relaxed fit. Great for casual occasions.",
          availableSizes: ["30", "32", "34", "36"],
          color: "gray",
          category: "bottoms",
        },
      ],

      // Actions
      moveUser: (position) =>
        set((state) => ({
          user: { ...state.user, position },
        })),

      rotateUser: (rotation) =>
        set((state) => ({
          user: { ...state.user, rotation },
        })),

      selectItem: (item) =>
        set((state) => ({
          user: { ...state.user, selectedItem: item },
        })),

      addToCart: (item) => {
        set((state) => ({
          user: {
            ...state.user,
            cartItems: [...state.user.cartItems, item],
          },
        }));

        // Also update localStorage
        try {
          const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
          existingCart.push(item);
          localStorage.setItem("cart", JSON.stringify(existingCart));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const indexToRemove = state.user.cartItems.findIndex(
            (item) => item.id === itemId
          );

          if (indexToRemove === -1) return state; // Item not found

          const updatedCartItems = [
            ...state.user.cartItems.slice(0, indexToRemove),
            ...state.user.cartItems.slice(indexToRemove + 1),
          ];

          // Update localStorage
          try {
            localStorage.setItem("cart", JSON.stringify(updatedCartItems));
          } catch (error) {
            console.error("Error updating localStorage:", error);
          }

          return {
            user: {
              ...state.user,
              cartItems: updatedCartItems,
            },
          };
        });
      },

      clearCart: () => {
        set((state) => ({
          user: {
            ...state.user,
            cartItems: [],
          },
        }));

        // Clear localStorage
        try {
          localStorage.removeItem("cart");
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      },

      initializeCartFromLocalStorage: () => {
        try {
          if (typeof window !== "undefined") {
            const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            set((state) => ({
              user: {
                ...state.user,
                cartItems: savedCart,
              },
            }));
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      },
    }),
    {
      name: "shopping-cart-storage",
      partialize: (state) => ({ user: { cartItems: state.user.cartItems } }),
    }
  )
);
