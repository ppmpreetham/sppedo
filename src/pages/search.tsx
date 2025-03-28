import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store/store";
import Header from "../components/header";
import { Search as SearchIcon } from "lucide-react";
import "../app/globals.css";

// Import GSAP in a way that works with SSR
let gsap;

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string; // Changed from thumbnailPath
  description: string;
  color: string;
  category: string;
}

const defaultItems = [
  {
    id: "streetwear-hoodie-1",
    name: "Urban Classic Hoodie",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
    description: "Classic urban style hoodie in premium cotton",
    color: "black",
    category: "hoodies",
  },
  {
    id: "tech-cargo-1",
    name: "Tech Cargo Pants",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=1000&fit=crop",
    description: "Modern cargo pants with technical details",
    color: "black",
    category: "pants",
  },
  {
    id: "street-jacket-1",
    name: "Urban Tech Jacket",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop",
    description: "Weather-resistant street style jacket",
    color: "black",
    category: "jackets",
  },
  {
    id: "graphic-tee-1",
    name: "Street Art Tee",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",
    description: "Graphic t-shirt with street art design",
    color: "white",
    category: "tees",
  },
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const clothingItems = useStore((state) => state.clothingItems);
  const allItems = [...defaultItems, ...clothingItems];

  // Create refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const noResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allItems.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.color.toLowerCase().includes(searchLower)
        );
      });
      setResults(filtered);
    } else {
      setResults(defaultItems); // Show default items when search is empty
    }
  }, [searchTerm, clothingItems]);

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

  // Re-run animations when results change
  useEffect(() => {
    if (gsap) {
      animateResults();
    }
  }, [results]);

  // Function to handle all animations
  const initAnimations = () => {
    if (!gsap) return;

    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      );
    }

    // Animate search box
    if (searchBoxRef.current) {
      gsap.fromTo(
        searchBoxRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
      );
    }

    // Initial results animation
    animateResults();
  };

  // Animate search results
  const animateResults = () => {
    if (!gsap) return;

    // Reset item refs array to match current results
    itemRefs.current = itemRefs.current.slice(0, results.length);

    // Animate items
    itemRefs.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: index * 0.05,
            clearProps: "scale", // This helps with hover animations
          }
        );

        // Add hover effect
        gsap.set(item, { transformOrigin: "center" });

        const handleItemEnter = () => {
          gsap.to(item, { y: -5, scale: 1.02, duration: 0.3 });
        };

        const handleItemLeave = () => {
          gsap.to(item, { y: 0, scale: 1, duration: 0.3 });
        };

        // Remove existing listeners to prevent duplicates
        item.removeEventListener("mouseenter", handleItemEnter);
        item.removeEventListener("mouseleave", handleItemLeave);

        // Add new listeners
        item.addEventListener("mouseenter", handleItemEnter);
        item.addEventListener("mouseleave", handleItemLeave);
      }
    });

    // Animate no results message if needed
    if (searchTerm && results.length === 0 && noResultsRef.current) {
      gsap.fromTo(
        noResultsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Header />

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[40vh] mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80"
          alt="Search Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="max-w-2xl w-full px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Find Your Style
            </h1>
            <div ref={searchBoxRef} className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-8">
        <div
          ref={resultsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {results.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="bg-zinc-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-zinc-700/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-colors duration-300"
            >
              <div className="relative pb-[100%]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-medium">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 capitalize px-3 py-1 bg-zinc-700/50 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchTerm && results.length === 0 && (
          <div ref={noResultsRef} className="text-center mt-12">
            <p className="text-gray-400 text-lg">
              No items found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
