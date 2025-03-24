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
