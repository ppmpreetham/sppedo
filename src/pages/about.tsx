import React from "react";
import "../app/globals.css";
import Header from "../components/header";
import Announcement from "../components/announcement";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
       {/* <Announcement /> */}
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-white to-emerald-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Welcome to SPPEDO
          </motion.h1>
          
          <div className="space-y-12">
            <motion.section 
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-zinc-800 hover:border-purple-500/50"
              whileHover={{ y: -5 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">Fashion Meets Web3</h2>
              <p className="text-gray-300 leading-relaxed">
                SPPEDO bridges the gap between physical fashion and digital ownership.
                Every piece in our collection comes with its own unique NFT, creating
                a perfect fusion of traditional retail and blockchain technology.
              </p>
            </motion.section>

            <section className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-emerald-300">Physical Collection</h3>
                <p className="text-gray-300">
                  Browse and purchase high-quality clothing pieces designed for both
                  style and comfort. Each item is carefully crafted to meet our
                  exceptional standards.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-bl from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border border-zinc-800 hover:border-blue-500/50"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-300">Digital Ownership</h3>
                <p className="text-gray-300">
                  When you purchase any item, you automatically receive an NFT
                  proving ownership of your unique piece. Connect your wallet to
                  view your digital collection.
                </p>
              </motion.div>
            </section>

            <motion.section 
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 border border-zinc-800 hover:border-pink-500/50"
              whileHover={{ y: -5 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-pink-300">How It Works</h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-4">
                {['Browse our collection and select your favorite pieces',
                  'Purchase the physical item',
                  'Connect your Web3 wallet',
                  'Receive your NFT certificate of authenticity',
                  'Track your fashion collection in the digital world'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </motion.li>
                ))}
              </ol>
            </motion.section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default About;