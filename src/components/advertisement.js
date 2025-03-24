'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Advertisement() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const images = [
        '/banner images/image1.png',
        '/banner images/image2.png',
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
        <div className="relative w-full h-[400px] group">
            <div className="relative w-full h-full overflow-hidden">
                <Image
                    src={images[currentImageIndex]}
                    alt={`Advertisement banner ${currentImageIndex + 1}`}
                    fill
                    className={`transition-opacity duration-300 ease-in-out ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ objectFit: 'cover' }}
                    priority
                    onLoadingComplete={() => setIsLoading(false)}
                    onError={() => console.error(`Failed to load image: ${images[currentImageIndex]}`)}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                
                <button 
                    onClick={previousImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6"/>
                </button>
                <button 
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
}