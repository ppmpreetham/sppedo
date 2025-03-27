import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from "../components/header";
import { ShoppingCart, Heart } from 'lucide-react';
import { useStore } from "../store/store";
import "../app/globals.css"

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
}

const Men = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addToCart = useStore((state) => state.addToCart);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const favorites = useStore((state) => state.user.favorites);

  const products: Product[] = [
    {
      id: 'cargo-pants-black',
      name: 'Tactical Cargo Pants',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=1000&fit=crop',
      category: 'pants',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'oversized-hoodie',
      name: 'Oversized Essential Hoodie',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
      category: 'hoodies',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'tech-jacket',
      name: 'Urban Tech Jacket',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
      category: 'jackets',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'graphic-tee',
      name: 'Street Art Graphic Tee',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop',
      category: 'tees',
      sizes: ['S', 'M', 'L', 'XL']
    },
    // Add more products as needed
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'tees', name: 'T-Shirts' },
    { id: 'hoodies', name: 'Hoodies' },
    { id: 'pants', name: 'Pants' },
    { id: 'jackets', name: 'Jackets' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80"
          alt="Men's Streetwear"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20 px-8 sm:px-16">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Streetwear
            </h1>
            <p className="text-gray-300 text-xl sm:text-2xl max-w-2xl">
              Where urban culture meets contemporary fashion
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Culture Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Culture</h2>
            <p className="text-gray-300 leading-relaxed">
              Streetwear isn't just clothing; it's a cultural movement that emerged from the streets, 
              blending urban lifestyle, hip-hop culture, and contemporary fashion. Our collection 
              celebrates this rich heritage while pushing boundaries with modern interpretations.
            </p>
          </div>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=600&fit=crop"
            alt="Street Culture"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </motion.section>

      {/* Style Grid */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-zinc-900/50 py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Style Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {styleElements.map((element, index) => (
              <motion.div
                key={element.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-black/30 p-6 rounded-xl backdrop-blur-sm"
              >
                <img 
                  src={element.image} 
                  alt={element.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
                <p className="text-gray-400">{element.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Inspiration Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative h-[60vh] mt-24"
      >
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
              Drawing inspiration from city landscapes, street art, and urban culture
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// Style elements data
const styleElements = [
  {
    title: "Urban Essentials",
    description: "Core pieces that form the foundation of streetwear style, from premium tees to essential hoodies.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=500&fit=crop"
  },
  {
    title: "Technical Wear",
    description: "Innovative fabrics and functional designs meet street style aesthetics.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=500&fit=crop"
  },
  {
    title: "Statement Pieces",
    description: "Bold designs and unique elements that elevate every outfit.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=500&fit=crop"
  }
];

export default Men;