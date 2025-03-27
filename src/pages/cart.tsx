import { useState, useEffect } from "react";
import { useStore } from "../store/store";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Connect from "../components/buttons/Connect";
import "../app/globals.css";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

export default function CartPage() {
  const [checkoutStep, setCheckoutStep] = useState(0);
  const cartItems = useStore((state) => state.user.cartItems);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const router = useRouter();
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  // Estimated Ethereum conversion (for demonstration)
  const ethRate = 2500; // USD to ETH exchange rate (example value)
  const ethTotal = total / ethRate;

  // Checkout form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  // Listen for account changes from MetaMask
  useEffect(() => {
    // Check if the Connect component has set an account to localStorage
    const checkMetaMaskConnection = () => {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setIsMetaMaskConnected(true);
            } else {
              setIsMetaMaskConnected(false);
              setAccount(null);
            }
          })
          .catch(console.error);
      }
    };

    checkMetaMaskConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsMetaMaskConnected(true);
        } else {
          setIsMetaMaskConnected(false);
          setAccount(null);
        }
      });
    }

    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Process crypto payment
  const processPayment = async () => {
    if (!isMetaMaskConnected) {
      alert("Please connect your MetaMask wallet first");
      return;
    }

    setLoading(true);

    try {
      // Demo store wallet address
      const storeWallet = "0x0000000000000000000000000000000000000000"; // Replace with actual address in production

      // Convert price to wei (assuming total is in ether)
      const totalInWei = window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: storeWallet,
            value: `0x${Math.floor(ethTotal * 1e18).toString(16)}`,
            gas: "0x5208", // 21000 gas
          },
        ],
      });

      const txHash = await totalInWei;
      setTransactionHash(txHash);

      // Success - move to confirmation step
      setCheckoutStep(2);

      // Clear cart after successful payment - in real app, wait for blockchain confirmation first
      setTimeout(() => {
        clearCart();
      }, 3000);
    } catch (error) {
      console.error("Payment failed:", error);
      alert(`Payment failed: ${error.message || "Transaction rejected"}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleCheckout = (e) => {
    e.preventDefault();

    if (checkoutStep < 1) {
      setCheckoutStep(checkoutStep + 1);
    } else {
      processPayment();
    }
  };

  // Function to get the quantity of specific items in cart
  const getItemCount = (id) => {
    return cartItems.filter((item) => item.id === id).length;
  };

  // Function to get unique items
  const getUniqueItems = () => {
    const uniqueItems: {
      id: string;
      name: string;
      description: string;
      color: string;
      availableSizes: string[];
      price: number;
      quantity: number;
    }[] = [];
    const seenIds = new Set();

    cartItems.forEach((item) => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueItems.push({
          ...item,
          quantity: getItemCount(item.id),
        });
      }
    });

    return uniqueItems;
  };

  // Remove all instances of an item by ID
  const removeAllOfItem = (id) => {
    cartItems
      .filter((item) => item.id === id)
      .forEach(() => {
        removeFromCart(id);
      });
  };

  const getColorHex = (color) => {
    const colorMap = {
      white: "#ffffff",
      black: "#222222",
      red: "#ff3333",
      blue: "#3333ff",
      gray: "#999999",
      brown: "#8b4513",
    };
    return colorMap[color] || "#ffffff";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Your Cart | 3D Shopping Experience</title>
        <meta name="description" content="Review your cart and checkout" />
      </Head>

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link
            href="/shop"
            className="text-blue-400 hover:underline flex items-center"
          >
            ← Back to Store
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {checkoutStep === 0
              ? "Your Shopping Cart"
              : checkoutStep === 1
              ? "Complete Your Purchase with Crypto"
              : "Order Confirmation"}
          </h1>

          {cartItems.length === 0 && checkoutStep !== 2 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <p className="mb-6 text-xl text-gray-400">Your cart is empty</p>
              <Link
                href="/shop"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
              {/* Checkout Steps */}
              <div className="bg-gray-800 p-4">
                <div className="flex justify-between">
                  <div
                    className={`flex-1 text-center ${
                      checkoutStep >= 0 ? "text-blue-400" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        checkoutStep >= 0 ? "bg-blue-600" : "bg-gray-700"
                      }`}
                    >
                      1
                    </div>
                    <p className="mt-1 text-sm">Review Cart</p>
                  </div>
                  <div
                    className={`flex-1 text-center ${
                      checkoutStep >= 1 ? "text-blue-400" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        checkoutStep >= 1 ? "bg-blue-600" : "bg-gray-700"
                      }`}
                    >
                      2
                    </div>
                    <p className="mt-1 text-sm">Blockchain Payment</p>
                  </div>
                  <div
                    className={`flex-1 text-center ${
                      checkoutStep >= 2 ? "text-blue-400" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                        checkoutStep >= 2 ? "bg-blue-600" : "bg-gray-700"
                      }`}
                    >
                      3
                    </div>
                    <p className="mt-1 text-sm">Confirmation</p>
                  </div>
                </div>
              </div>

              {/* Cart Items (Step 0) */}
              {checkoutStep === 0 && (
                <div className="p-6">
                  {getUniqueItems().map((item) => (
                    <div
                      key={item.id}
                      className="mb-6 p-4 border border-gray-800 rounded-lg bg-gray-800"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Color indicator and basic info */}
                        <div className="flex items-start gap-3 md:w-1/2">
                          <div
                            className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-600 mt-1"
                            style={{
                              backgroundColor: getColorHex(item.color),
                            }}
                          ></div>
                          <div>
                            <h3 className="font-bold text-xl">{item.name}</h3>
                            <p className="text-sm text-gray-400 mt-1 mb-2">
                              {item.description.substring(0, 100)}...
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">
                                Color:{" "}
                                <span className="capitalize">{item.color}</span>
                              </span>
                              <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">
                                Size: {item.availableSizes[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price and quantity */}
                        <div className="flex justify-between items-start md:w-1/2 mt-4 md:mt-0">
                          <div>
                            <div className="text-sm text-gray-400">Price</div>
                            <div className="text-lg font-bold text-blue-400">
                              ${item.price.toFixed(2)}
                            </div>
                            <div className="flex items-center mt-2">
                              <span className="text-gray-400 mr-2">Qty:</span>
                              <span className="text-white font-bold">
                                {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              Subtotal
                            </div>
                            <div className="text-lg font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeAllOfItem(item.id)}
                              className="text-red-500 hover:text-red-400 mt-4 text-sm flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 space-y-3 border-t border-gray-700 pt-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-700">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Link
                      href="/shop"
                      className="flex-1 py-3 bg-gray-800 text-center text-white rounded-md hover:bg-gray-700 transition font-medium"
                    >
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* Crypto Payment (Step 1) */}
              {checkoutStep === 1 && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Payment Details
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Complete your purchase using cryptocurrency with MetaMask
                      wallet.
                    </p>

                    {/* Order Summary */}
                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-lg font-medium mb-3">
                        Order Summary
                      </h4>
                      <div className="space-y-2 mb-4">
                        {getUniqueItems().map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-2 border-b border-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: getColorHex(item.color),
                                }}
                              ></div>
                              <span className="text-sm">
                                {item.name} × {item.quantity}
                              </span>
                            </div>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-gray-700 flex justify-between font-bold">
                        <span>Total</span>
                        <div className="text-right">
                          <div>${total.toFixed(2)}</div>
                          <div className="text-sm text-blue-400">
                            ≈ {ethTotal.toFixed(5)} ETH
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-5 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400">Payment Method:</span>
                        <span className="font-bold">Ethereum (ETH)</span>
                      </div>

                      <div className="p-4 border border-gray-700 rounded-lg bg-gray-900 text-center mb-6">
                        <p className="text-sm text-gray-400 mb-3">
                          {isMetaMaskConnected
                            ? "Wallet Connected"
                            : "Connect your wallet to continue"}
                        </p>
                        <div className="flex justify-center">
                          <Connect />
                        </div>
                        {isMetaMaskConnected && (
                          <p className="mt-3 text-xs text-green-400">
                            Connected:{" "}
                            {account
                              ? `${account.substring(
                                  0,
                                  6
                                )}...${account.substring(account.length - 4)}`
                              : ""}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 text-sm text-gray-400">
                        <p className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            Your payment is secured by blockchain technology.
                            The transaction will be recorded on the Ethereum
                            network.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <span>
                            Gas fees will be calculated automatically by
                            MetaMask based on current network conditions.
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={() => setCheckoutStep(0)}
                        className="flex-1 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition font-medium"
                      >
                        Back to Cart
                      </button>
                      <button
                        onClick={processPayment}
                        disabled={!isMetaMaskConnected || loading}
                        className={`flex-1 py-3 rounded-md text-white transition font-medium flex items-center justify-center ${
                          isMetaMaskConnected && !loading
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-700 cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Complete Purchase"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-6">
                    This is a demo store. No real cryptocurrency will be
                    transferred.
                  </p>
                </div>
              )}

              {/* Order Confirmation (Step 2) */}
              {checkoutStep === 2 && (
                <div className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Payment Complete!</h2>
                  <p className="text-gray-400 mb-6">
                    Thank you for your purchase. Your transaction has been
                    processed successfully.
                  </p>

                  {transactionHash && (
                    <div className="bg-gray-800 p-4 rounded-lg mb-6 mx-auto max-w-md">
                      <h4 className="text-sm font-medium mb-2 text-gray-400">
                        Transaction Hash
                      </h4>
                      <p className="text-xs text-blue-400 break-all">
                        {transactionHash}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        You can view your transaction on Etherscan once it's
                        confirmed
                      </p>
                    </div>
                  )}

                  <div className="mt-8">
                    <Link
                      href="/shop"
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block transition"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
