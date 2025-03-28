import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { ShoppingCart, Heart } from "lucide-react";
import { useStore } from "../store/store";
import "../app/globals.css";

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

const Kids = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.user.favorites);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const funFactsRef = useRef<HTMLElement>(null);
  const funFactItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const parallaxRef = useRef<HTMLElement>(null);
  const parallaxImageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const featureItemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const initGSAP = async () => {
      gsap = (await import("gsap")).default;
      ScrollTrigger = (await import("gsap/ScrollTrigger")).default;

      gsap.registerPlugin(ScrollTrigger);

      initAnimations();
    };

    initGSAP();

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  const initAnimations = () => {
    if (heroRef.current && heroContentRef.current) {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

      gsap.fromTo(
        heroContentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5 }
      );
    }

    if (funFactsRef.current) {
      gsap.fromTo(
        funFactsRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: funFactsRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      funFactItemRefs.current.forEach((item, index) => {
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

    if (parallaxRef.current && parallaxImageRef.current) {
      gsap.fromTo(
        parallaxRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        parallaxImageRef.current,
        { y: -50 },
        {
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    if (featuresRef.current) {
      featureItemRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: index * 0.1,
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true,
              },
            }
          );

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
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        funFactItemRefs.current.forEach((item) => {
          if (item) {
            item.removeEventListener("mouseenter", () => {});
            item.removeEventListener("mouseleave", () => {});
          }
        });

        featureItemRefs.current.forEach((item) => {
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
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white">
      <Header />

      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1920&q=80"
          alt="Kids Streetwear"
          className="w-full h-full object-cover"
        />
        <div
          ref={heroContentRef}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center">
            <h1 className="text-6xl sm:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500">
              Mini Rebels
            </h1>
            <p className="text-gray-200 text-xl sm:text-2xl max-w-2xl mx-auto px-4">
              The next generation of street style
            </p>
          </div>
        </div>
      </div>

      <section
        ref={funFactsRef}
        className="py-24 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Fun Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {funFacts.map((fact, index) => (
              <div
                key={fact.title}
                ref={(el) => {
                  funFactItemRefs.current[index] = el;
                }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors border border-zinc-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="text-5xl mb-4">{fact.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{fact.title}</h3>
                <p className="text-gray-300">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={parallaxRef} className="relative h-[50vh] overflow-hidden">
        <div ref={parallaxImageRef} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1617077644557-64be144aa306?w=1920&q=80"
            alt="Kids Fashion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </section>

      <section ref={featuresRef} className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Style For All
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => {
                  featureItemRefs.current[index] = el;
                }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const funFacts = [
  {
    emoji: "🌈",
    title: "Express Yourself",
    description:
      "Kids streetwear is all about letting personalities shine through vibrant colors and unique designs.",
  },
  {
    emoji: "🌟",
    title: "Comfort First",
    description:
      "Our clothes are designed for active kids who need both style and freedom to move.",
  },
  {
    emoji: "🎨",
    title: "Creative Freedom",
    description:
      "Mix and match pieces to create countless unique combinations.",
  },
];

const features = [
  {
    icon: "👕",
    title: "Comfy Fits",
    description: "Designed for maximum comfort and style",
  },
  {
    icon: "🌈",
    title: "Bold Colors",
    description: "Vibrant palettes that pop",
  },
  {
    icon: "♻️",
    title: "Eco-Friendly",
    description: "Sustainable materials for a better future",
  },
  {
    icon: "🎨",
    title: "Creative Designs",
    description: "Unique patterns and graphics",
  },
];

export default Kids;
