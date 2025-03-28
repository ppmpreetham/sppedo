import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { ShoppingCart, Heart } from "lucide-react";
import { useStore } from "../store/store";
import "../app/globals.css";

// Import GSAP in a way that works with SSR
let gsap;
let ScrollTrigger;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
}

const Men = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.user.favorites);

  // Create refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLElement>(null);
  const cultureImageRef = useRef<HTMLImageElement>(null);
  const styleGridRef = useRef<HTMLElement>(null);
  const styleElementRefs = useRef<Array<HTMLDivElement | null>>([]);
  const inspirationRef = useRef<HTMLElement>(null);

  // Initialize GSAP on client-side only
  useEffect(() => {
    // Dynamically import GSAP only on the client
    const initGSAP = async () => {
      gsap = (await import("gsap")).default;
      ScrollTrigger = (await import("gsap/ScrollTrigger")).default;

      // Register ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Now that GSAP is loaded, initialize animations
      initAnimations();
    };

    initGSAP();

    // Cleanup function
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  // Function to handle all animations
  const initAnimations = () => {
    // Hero section animations
    if (heroRef.current && heroContentRef.current) {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

      gsap.fromTo(
        heroContentRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.5 }
      );
    }

    // Culture section animation
    if (cultureRef.current) {
      gsap.fromTo(
        cultureRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: cultureRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Add hover effect to the culture image
      if (cultureImageRef.current) {
        gsap.set(cultureImageRef.current, { transformOrigin: "center" });

        const handleImageEnter = () => {
          gsap.to(cultureImageRef.current, { scale: 1.05, duration: 0.3 });
        };

        const handleImageLeave = () => {
          gsap.to(cultureImageRef.current, { scale: 1, duration: 0.3 });
        };

        cultureImageRef.current.addEventListener(
          "mouseenter",
          handleImageEnter
        );
        cultureImageRef.current.addEventListener(
          "mouseleave",
          handleImageLeave
        );
      }
    }

    // Style Grid section animation
    if (styleGridRef.current) {
      gsap.fromTo(
        styleGridRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: styleGridRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Animate individual style elements
      styleElementRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.2,
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true,
              },
            }
          );

          // Add hover effect like in about.tsx
          gsap.set(item, { transformOrigin: "center" });

          const handleItemEnter = () => {
            gsap.to(item, { y: -5, scale: 1.05, duration: 0.3 });
          };

          const handleItemLeave = () => {
            gsap.to(item, { y: 0, scale: 1, duration: 0.3 });
          };

          item.addEventListener("mouseenter", handleItemEnter);
          item.addEventListener("mouseleave", handleItemLeave);
        }
      });
    }

    // Inspiration section animation
    if (inspirationRef.current) {
      gsap.fromTo(
        inspirationRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: inspirationRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  };

  // Create a cleanup function for the hover effects to prevent memory leaks
  useEffect(() => {
    return () => {
      // This will run when the component unmounts
      if (typeof window !== "undefined") {
        // Clean up event listeners
        if (cultureImageRef.current) {
          cultureImageRef.current.removeEventListener("mouseenter", () => {});
          cultureImageRef.current.removeEventListener("mouseleave", () => {});
        }

        styleElementRefs.current.forEach((item) => {
          if (item) {
            item.removeEventListener("mouseenter", () => {});
            item.removeEventListener("mouseleave", () => {});
          }
        });
      }
    };
  }, []);

  const products: Product[] = [
    {
      id: "cargo-pants-black",
      name: "Tactical Cargo Pants",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=1000&fit=crop",
      category: "pants",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "oversized-hoodie",
      name: "Oversized Essential Hoodie",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "tech-jacket",
      name: "Urban Tech Jacket",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop",
      category: "jackets",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "graphic-tee",
      name: "Street Art Graphic Tee",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",
      category: "tees",
      sizes: ["S", "M", "L", "XL"],
    },
    // Add more products as needed
  ];

  const categories = [
    { id: "all", name: "All" },
    { id: "tees", name: "T-Shirts" },
    { id: "hoodies", name: "Hoodies" },
    { id: "pants", name: "Pants" },
    { id: "jackets", name: "Jackets" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Header />

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80"
          alt="Men's Streetwear"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20 px-8 sm:px-16">
          <div ref={heroContentRef}>
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Streetwear
            </h1>
            <p className="text-gray-300 text-xl sm:text-2xl max-w-2xl">
              Where urban culture meets contemporary fashion
            </p>
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <section ref={cultureRef} className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Culture</h2>
            <p className="text-gray-300 leading-relaxed">
              Streetwear isn't just clothing; it's a cultural movement that
              emerged from the streets, blending urban lifestyle, hip-hop
              culture, and contemporary fashion. Our collection celebrates this
              rich heritage while pushing boundaries with modern
              interpretations.
            </p>
          </div>
          <img
            ref={cultureImageRef}
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=600&fit=crop"
            alt="Street Culture"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Style Grid */}
      <section ref={styleGridRef} className="bg-zinc-900/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Style Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {styleElements.map((element, index) => (
              <div
                key={element.title}
                ref={(el) => {
                  styleElementRefs.current[index] = el;
                }}
                className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-zinc-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                <img
                  src={element.image}
                  alt={element.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
                <p className="text-gray-400">{element.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section ref={inspirationRef} className="relative h-[60vh] mt-24">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=1920&q=80"
          alt="Urban Inspiration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Urban Inspiration</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Drawing inspiration from city landscapes, street art, and urban
              culture
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Style elements data
const styleElements = [
  {
    title: "Urban Essentials",
    description:
      "Core pieces that form the foundation of streetwear style, from premium tees to essential hoodies.",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=500&fit=crop",
  },
  {
    title: "Technical Wear",
    description:
      "Innovative fabrics and functional designs meet street style aesthetics.",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=500&fit=crop",
  },
  {
    title: "Statement Pieces",
    description: "Bold designs and unique elements that elevate every outfit.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=500&fit=crop",
  },
];

export default Men;
