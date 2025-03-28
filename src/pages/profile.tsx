import React, { useState, useEffect, useRef } from "react";
import "../app/globals.css";
import Header from "../components/header";
import { Wallet, User, ShoppingCart, Heart, Copy } from "lucide-react";
import Connect from "../components/buttons/Connect";
import { getFromStorage, setToStorage } from "../utils/storage";
import { Toaster, toast } from "react-hot-toast";
import { getCounts } from "../utils/counts";
import { useStore } from "../store/store";

// Import GSAP in a way that works with SSR
let gsap;

const Profile = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Create refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<Array<HTMLDivElement | null>>([]);
  const connectContainerRef = useRef<HTMLDivElement>(null);

  // Check wallet connection on mount
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
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
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  // Load counts directly from localStorage
  useEffect(() => {
    const updateCounts = () => {
      // Get counts from localStorage
      const cartItems = JSON.parse(
        localStorage.getItem("sppedo_cart_items") || "[]"
      );
      const favorites = JSON.parse(
        localStorage.getItem("sppedo_favorites") || "[]"
      );

      setCartCount(cartItems.length);
      setFavoritesCount(favorites.length);
    };

    // Initial load
    updateCounts();

    // Update counts when localStorage changes
    window.addEventListener("storage", updateCounts);

    // Update counts every second to catch any changes
    const interval = setInterval(updateCounts, 1000);

    return () => {
      window.removeEventListener("storage", updateCounts);
      clearInterval(interval);
    };
  }, []);

  // Initialize GSAP on client-side only
  useEffect(() => {
    // Dynamically import GSAP only on the client
    const initGSAP = async () => {
      gsap = (await import("gsap")).default;

      // Now that GSAP is loaded, initialize animations
      initAnimations();
    };

    initGSAP();
  }, [account]); // Re-run when account changes

  // Function to handle all animations
  const initAnimations = () => {
    if (!gsap) return;

    if (account) {
      // Main container animation
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }

      // Profile image hover effect
      if (profileImageRef.current) {
        gsap.set(profileImageRef.current, { transformOrigin: "center" });

        const handleImageEnter = () => {
          gsap.to(profileImageRef.current, { scale: 1.05, duration: 0.2 });
        };

        const handleImageLeave = () => {
          gsap.to(profileImageRef.current, { scale: 1, duration: 0.2 });
        };

        profileImageRef.current.addEventListener(
          "mouseenter",
          handleImageEnter
        );
        profileImageRef.current.addEventListener(
          "mouseleave",
          handleImageLeave
        );
      }

      // Stats hover effects
      statsRefs.current.forEach((item) => {
        if (item) {
          gsap.set(item, { transformOrigin: "center" });

          const handleItemEnter = () => {
            gsap.to(item, { scale: 1.02, duration: 0.2 });
          };

          const handleItemLeave = () => {
            gsap.to(item, { scale: 1, duration: 0.2 });
          };

          item.addEventListener("mouseenter", handleItemEnter);
          item.addEventListener("mouseleave", handleItemLeave);
        }
      });
    } else {
      // Connect wallet animation
      if (connectContainerRef.current) {
        gsap.fromTo(
          connectContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }
    }
  };

  // Cleanup function for event listeners
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        if (profileImageRef.current) {
          profileImageRef.current.removeEventListener("mouseenter", () => {});
          profileImageRef.current.removeEventListener("mouseleave", () => {});
        }

        statsRefs.current.forEach((item) => {
          if (item) {
            item.removeEventListener("mouseenter", () => {});
            item.removeEventListener("mouseleave", () => {});
          }
        });
      }
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!", {
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <div ref={connectContainerRef} className="space-y-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-zinc-400">
              Connect your wallet to view your profile
            </p>
            <div className="flex justify-center">
              <Connect />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Header />
      <Toaster position="bottom-right" />
      <main className="container mx-auto px-4 py-16">
        <div ref={containerRef} className="max-w-4xl mx-auto">
          <div className="bg-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div ref={profileImageRef} className="relative">
                <img
                  src="https://avatars.githubusercontent.com/u/124599?v=4"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-purple-500/30"
                />
                <div className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full">
                  <User size={20} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Sreeyansh Dhenavahi</h1>
                <div className="flex items-center gap-2 justify-center md:justify-start text-zinc-400">
                  <Wallet size={16} />
                  <span className="font-mono">
                    {`${account.substring(0, 6)}...${account.substring(
                      account.length - 4
                    )}`}
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
              <div
                ref={(el) => {
                  statsRefs.current[0] = el;
                }}
                className="bg-zinc-700/30 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
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
              </div>

              <div
                ref={(el) => {
                  statsRefs.current[1] = el;
                }}
                className="bg-zinc-700/30 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
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
              </div>

              <div
                ref={(el) => {
                  statsRefs.current[2] = el;
                }}
                className="bg-zinc-700/30 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
