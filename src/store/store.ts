import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClothingItem, UserState } from "@/types";

interface StoreState {
  user: UserState;
  clothingItems: ClothingItem[];
  // Actions
  moveUser: (position: [number, number, number]) => void;
  rotateUser: (rotation: number) => void;
  selectItem: (item: ClothingItem | null) => void;
  addToCart: (item: ClothingItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void; // New function to clear the cart
  toggleFavorite: (itemId: string) => void; // New function to toggle favorite items
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: {
        position: [0, 1, 0],
        rotation: 0,
        selectedItem: null,
        cartItems: [],
        favorites: [],
      },
      clothingItems: [
        // T-Shirts
        {
          id: "tshirt-white",
          name: "Basic White T-Shirt",
          modelPath: "../../../models/tshirt.glb",
          thumbnailPath: "/images/tshirt-thumb.jpg",
          price: 29.99,
          description: "Comfortable cotton t-shirt in classic white",
          availableSizes: ["S", "M", "L", "XL"],
          color: "white",
          category: "tops",
        },
        {
          id: "tshirt-black",
          name: "Basic Black T-Shirt",
          modelPath: "../../../models/tshirt.glb",
          thumbnailPath: "/images/tshirt-thumb.jpg",
          price: 29.99,
          description: "Comfortable cotton t-shirt in sleek black",
          availableSizes: ["S", "M", "L", "XL"],
          color: "black",
          category: "tops",
        },
        {
          id: "tshirt-red",
          name: "Basic Red T-Shirt",
          modelPath: "../../../models/tshirt.glb",
          thumbnailPath: "/images/tshirt-thumb.jpg",
          price: 29.99,
          description: "Comfortable cotton t-shirt in vibrant red",
          availableSizes: ["S", "M", "L", "XL"],
          color: "red",
          category: "tops",
        },
        {
          id: "tshirt-blue",
          name: "Classic Blue T-Shirt",
          modelPath: "../../../models/tshirt.glb",
          thumbnailPath: "/images/tshirt-thumb.jpg",
          price: 29.99,
          description: "Comfortable cotton t-shirt in cool blue",
          availableSizes: ["S", "M", "L", "XL"],
          color: "blue",
          category: "tops",
        },

        // Jeans
        {
          id: "jeans-blue",
          name: "Classic Blue Jeans",
          modelPath: "../../../models/jeans.glb",
          thumbnailPath: "/images/jeans-thumb.jpg",
          price: 59.99,
          description: "Classic straight fit jeans in traditional blue",
          availableSizes: ["S", "M", "L", "XL"],
          color: "blue",
          category: "bottoms",
        },
        {
          id: "jeans-black",
          name: "Classic Black Jeans",
          modelPath: "../../../models/jeans.glb",
          thumbnailPath: "/images/jeans-thumb.jpg",
          price: 59.99,
          description: "Classic straight fit jeans in versatile black",
          availableSizes: ["S", "M", "L", "XL"],
          color: "black",
          category: "bottoms",
        },
        {
          id: "jeans-gray",
          name: "Classic Gray Jeans",
          modelPath: "../../../models/jeans.glb",
          thumbnailPath: "/images/jeans-thumb.jpg",
          price: 59.99,
          description: "Classic straight fit jeans in stylish gray",
          availableSizes: ["S", "M", "L", "XL"],
          color: "gray",
          category: "bottoms",
        },
        {
          id: "jeans-brown",
          name: "Classic Brown Jeans",
          modelPath: "../../../models/jeans.glb",
          thumbnailPath: "/images/jeans-thumb.jpg",
          price: 59.99,
          description: "Classic straight fit jeans in earthy brown",
          availableSizes: ["S", "M", "L", "XL"],
          color: "brown",
          category: "bottoms",
        },
      ],
      moveUser: (position) =>
        set((state) => ({ user: { ...state.user, position } })),
      rotateUser: (rotation) =>
        set((state) => ({ user: { ...state.user, rotation } })),
      selectItem: (item) =>
        set((state) => ({ user: { ...state.user, selectedItem: item } })),
      addToCart: (item) => {
        set((state) => {
          const newCartItems = [
            ...state.user.cartItems,
            { ...item, cartId: `${item.id}-${Date.now()}` },
          ];
          localStorage.setItem(
            "sppedo_cart_count",
            newCartItems.length.toString()
          );
          return { user: { ...state.user, cartItems: newCartItems } };
        });
      },
      removeFromCart: (itemId) => {
        set((state) => {
          const newCartItems = state.user.cartItems.filter(
            (item) => (item.cartId || item.id) !== itemId
          );
          localStorage.setItem(
            "sppedo_cart_count",
            newCartItems.length.toString()
          );
          return { user: { ...state.user, cartItems: newCartItems } };
        });
      },
      clearCart: () =>
        set((state) => ({
          user: {
            ...state.user,
            cartItems: [],
          },
        })),
      toggleFavorite: (itemId) => {
        set((state) => {
          const newFavorites = state.user.favorites.includes(itemId)
            ? state.user.favorites.filter((id) => id !== itemId)
            : [...state.user.favorites, itemId];
          localStorage.setItem(
            "sppedo_favorites_count",
            newFavorites.length.toString()
          );
          return { user: { ...state.user, favorites: newFavorites } };
        });
      },
    }),
    {
      name: "sppedo-storage",
    }
  )
);
