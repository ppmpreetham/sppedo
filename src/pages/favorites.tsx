import React, { useState, useEffect, useRef } from "react";
import "../app/globals.css";
import Header from "../components/header";
import Announcement from "../components/announcement";
import { Heart } from "lucide-react";

// Import GSAP in a way that works with SSR
let gsap;

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Create refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Initialize GSAP on client-side only
  useEffect(() => {
    // Dynamically import GSAP only on the client
    const initGSAP = async () => {
      gsap = (await import("gsap")).default;

      // Now that GSAP is loaded, initialize animations
      initAnimations();
    };

    initGSAP();
  }, []);

  // Function to handle all animations
  const initAnimations = () => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }

    // Items animation
    if (itemRefs.current.length > 0) {
      itemRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: index * 0.1,
            }
          );

          // Add hover effect
          gsap.set(item, { transformOrigin: "center" });

          const handleItemEnter = () => {
            gsap.to(item, { scale: 1.05, duration: 0.2 });
          };

          const handleItemLeave = () => {
            gsap.to(item, { scale: 1, duration: 0.2 });
          };

          item.addEventListener("mouseenter", handleItemEnter);
          item.addEventListener("mouseleave", handleItemLeave);
        }
      });
    }
  };

  // Cleanup function for event listeners
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        itemRefs.current.forEach((item) => {
          if (item) {
            item.removeEventListener("mouseenter", () => {});
            item.removeEventListener("mouseleave", () => {});
          }
        });
      }
    };
  }, []);

  const clothingItems: ClothingItem[] = [
    {
      id: 1,
      name: "Classic Blue Jeans",
      category: "Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500",
    },
    {
      id: 2,
      name: "Black Jeans",
      category: "Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500",
    },
    {
      id: 3,
      name: "Brown Jeans",
      category: "Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=500",
    },
    {
      id: 4,
      name: "Grey Jeans",
      category: "Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500",
    },
    {
      id: 5,
      name: "Basic Blue T-Shirt",
      category: "T-Shirts",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500",
    },
    {
      id: 6,
      name: "Classic Red T-Shirt",
      category: "T-Shirts",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500",
    },
    {
      id: 7,
      name: "Basic Black T-Shirt",
      category: "T-Shirts",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500",
    },
    {
      id: 8,
      name: "Basic White T-Shirt",
      category: "T-Shirts",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500",
    },
  ];

  const toggleFavorite = (itemId: number) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* <Announcement /> */}
      <Header />

      <main className="container mx-auto px-4 py-16">
        <h1 ref={titleRef} className="text-4xl font-bold mb-8 text-center">
          Your Favorites
        </h1>

        <div
          ref={itemsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {clothingItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-700 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      favorites.includes(item.id)
                        ? "fill-pink-500 text-pink-500"
                        : "fill-none text-white"
                    }`}
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-zinc-400">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
