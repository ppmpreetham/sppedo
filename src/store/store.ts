import { create } from "zustand";
import { ClothingItem, UserState } from "@/types";

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
}

export const useStore = create<StoreState>((set) => ({
  user: {
    position: [0, 1, 0],
    rotation: 0,
    selectedItem: null,
    cartItems: [],
  },
  clothingItems: [
    {
      id: "tshirt-1",
      name: "Basic T-Shirt",
      modelPath: "../../../models/tshirt.glb",
      thumbnailPath: "/images/tshirt-thumb.jpg",
      price: 29.99,
      description: "Comfortable cotton t-shirt",
      availableSizes: ["S", "M", "L", "XL"],
      color: "white",
      category: "tops",
    },
    {
      id: "jeans-1",
      name: "Classic Jeans",
      modelPath: "../../../models/jeans.glb",
      thumbnailPath: "/images/jeans-thumb.jpg",
      price: 59.99,
      description: "Classic straight fit jeans",
      availableSizes: ["S", "M", "L", "XL"],
      color: "blue",
      category: "bottoms",
    },
    // Add more clothing items as needed
  ],
  moveUser: (position) =>
    set((state) => ({ user: { ...state.user, position } })),
  rotateUser: (rotation) =>
    set((state) => ({ user: { ...state.user, rotation } })),
  selectItem: (item) =>
    set((state) => ({ user: { ...state.user, selectedItem: item } })),
  addToCart: (item) =>
    set((state) => ({
      user: {
        ...state.user,
        cartItems: [...state.user.cartItems, item],
      },
    })),
  removeFromCart: (itemId) =>
    set((state) => ({
      user: {
        ...state.user,
        cartItems: state.user.cartItems.filter((item) => item.id !== itemId),
      },
    })),
}));
