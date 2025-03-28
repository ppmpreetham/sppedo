"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Advertisement() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const images = [
    "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1920&h=800&q=90", // Streetwear showcase
    "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1920&h=800&q=90", // Urban fashion
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&h=800&q=90", // Streetstyle collection
    "https://images.unsplash.com/photo-1512327536842-5aa37d1ba3e3?w=1920&h=800&q=90", // Street culture
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[800px] group">
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`Streetwear collection ${currentImageIndex + 1}`}
          fill
          className={`transition-opacity duration-500 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectFit: "cover",
            objectPosition: "center 25%",
          }}
          sizes="100vw"
          priority
          quality={90}
          onLoad={() => setIsLoading(false)}
          onError={() =>
            console.error(`Failed to load image: ${images[currentImageIndex]}`)
          }
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white ">
          <h2 className="text-5xl md:text-6xl lg:text-9xl font-bold mb-4 font-murmure mix-blend-difference">
            Sppedo
          </h2>
          <p className="text-xl md:text-6xl mb-8 font-murmure mix-blend-difference">
            Web3 Streetwear Collection
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-lg"
          >
            Explore Collection
          </Link>
        </div>

        <button
          onClick={previousImage}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
