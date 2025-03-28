import React, { useState, useEffect } from "react";
import "../app/globals.css";
import Header from "../components/header";
import { motion } from "framer-motion";
import { Wallet, User, ShoppingCart, Heart, Copy } from "lucide-react";
import Connect from "../components/buttons/Connect";
import { getFromStorage, setToStorage } from "../utils/storage";
import { Toaster, toast } from 'react-hot-toast';
import { getCounts } from "../utils/counts";
import { useStore } from "../store/store";

const Profile = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Check wallet connection on mount
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Load counts directly from localStorage
  useEffect(() => {
    const updateCounts = () => {
      // Get counts from localStorage
      const cartItems = JSON.parse(localStorage.getItem('sppedo_cart_items') || '[]');
      const favorites = JSON.parse(localStorage.getItem('sppedo_favorites') || '[]');
      
      setCartCount(cartItems.length);
      setFavoritesCount(favorites.length);
    };

    // Initial load
    updateCounts();

    // Update counts when localStorage changes
    window.addEventListener('storage', updateCounts);
    
    // Update counts every second to catch any changes
    const interval = setInterval(updateCounts, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!', {
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-zinc-400">
              Connect your wallet to view your profile
            </p>
            <div className="flex justify-center">
              <Connect />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Header />
      <Toaster position="bottom-right" />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/124599?v=4"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-purple-500/30"
                />
                <div className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full">
                  <User size={20} />
                </div>
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Sreeyansh Dhenavahi</h1>
                <div className="flex items-center gap-2 justify-center md:justify-start text-zinc-400">
                  <Wallet size={16} />
                  <span className="font-mono">
                    {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                  </span>
                  <button
                    onClick={() => copyToClipboard(account)}
                    className="p-1 hover:text-purple-400 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-700/30 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <User className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400">Member Since</p>
                    <p className="font-semibold">March 2024</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-700/30 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <ShoppingCart className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400">Cart Items</p>
                    <p className="font-semibold">{cartCount} items</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-700/30 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Heart className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400">Favorites</p>
                    <p className="font-semibold">{favoritesCount} items</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;