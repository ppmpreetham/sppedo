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

const Kids = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white">
      <Header />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1920&q=80"
          alt="Kids Streetwear"
          className="w-full h-full object-cover"
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-center">
            <h1 className="text-6xl sm:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500">
              Mini Rebels
            </h1>
            <p className="text-gray-200 text-xl sm:text-2xl max-w-2xl mx-auto px-4">
              The next generation of street style
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Fun Facts Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Fun Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {funFacts.map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-5xl mb-4">{fact.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{fact.title}</h3>
                <p className="text-gray-300">{fact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Parallax Image Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative h-[50vh] overflow-hidden"
      >
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1617077644557-64be144aa306?w=1920&q=80"
            alt="Kids Fashion"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </motion.section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Style For All</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
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
    description: "Kids streetwear is all about letting personalities shine through vibrant colors and unique designs."
  },
  {
    emoji: "🌟",
    title: "Comfort First",
    description: "Our clothes are designed for active kids who need both style and freedom to move."
  },
  {
    emoji: "🎨",
    title: "Creative Freedom",
    description: "Mix and match pieces to create countless unique combinations."
  }
];

const features = [
  {
    icon: "👕",
    title: "Comfy Fits",
    description: "Designed for maximum comfort and style"
  },
  {
    icon: "🌈",
    title: "Bold Colors",
    description: "Vibrant palettes that pop"
  },
  {
    icon: "♻️",
    title: "Eco-Friendly",
    description: "Sustainable materials for a better future"
  },
  {
    icon: "🎨",
    title: "Creative Designs",
    description: "Unique patterns and graphics"
  }
];

export default Kids;