export interface ClothingItem {
  id: string;
  name: string;
  modelPath: string;
  thumbnailPath: string;
  price: number;
  description: string;
  availableSizes: string[];
  color: string;
  category: string;
}

export interface UserState {
  position: [number, number, number];
  rotation: number;
  selectedItem: ClothingItem | null;
  cartItems: ClothingItem[];
}

export interface ClothingItem {
  id: string;
  name: string;
  modelPath: string;
  thumbnailPath: string;
  price: number;
  description: string;
  availableSizes: string[];
  color: string;
  category: string;
  selectedSize?: string; // Add this optional field
  cartId?: string; // Add this optional field for unique cart identification
}
