import { useState, useEffect } from "react";
import { useStore } from "../store/store";
import Head from "next/head";
import Link from "next/link";
import "../app/globals.css";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        eventName: string,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}

export default function CartPage() {
  const cartItems = useStore((state) => state.user.cartItems);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [account, setAccount] = useState("");

  // Get the total price of all items in cart
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Check if MetaMask is connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsProcessing(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsProcessing(false);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setIsProcessing(false);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install MetaMask to proceed with checkout."
      );
    }
  };

  // Process payment with MetaMask
  const processPayment = async () => {
    if (!account) {
      alert("Please connect your MetaMask wallet first!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsProcessing(true);
    setTransactionStatus("Initiating transaction...");

    try {
      // const priceInEth = (totalPrice / 1500).toFixed(6); // Example conversion rate: 1 ETH = $1500 USD

      // Fixed test amount: 0.001 ETH
      const testPriceInEth = "0.001";

      // Create transaction parameters
      const transactionParameters = {
        to: "0x1ef76c89cc56a39198cacE251b91808930E8B14A",
        from: account,
        // Original dynamic price calculation
        // value: parseInt((Number(priceInEth) * 10 ** 18).toString()).toString(16),

        // Fixed test value (0.001 ETH)
        value: parseInt(
          (Number(testPriceInEth) * 10 ** 18).toString()
        ).toString(16),
        gas: (21000).toString(16),
      };

      setTransactionStatus("Please confirm the transaction in MetaMask...");

      // Send transaction
      if (!window.ethereum) {
        throw new Error("MetaMask is not available.");
      }
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setTransactionStatus(
        `Transaction submitted! Hash: ${txHash.substring(0, 10)}...`
      );

      // Clear cart after successful payment
      const clearCart = useStore.getState().clearCart;
      clearCart();

      setTimeout(() => {
        setTransactionStatus(
          `Payment successful! Thank you for your purchase.`
        );
        setIsProcessing(false);
      }, 3000);
    } catch (error) {
      console.error("Transaction error:", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Your Cart | 3D Shopping Experience</title>
        <meta name="description" content="View your cart and checkout" />
      </Head>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/shop"
              className="text-blue-400 hover:underline flex items-center"
            >
              ← Back to Store
            </Link>
            <h1 className="text-3xl font-bold mt-4">Your Shopping Cart</h1>
          </div>
          <div>
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {isProcessing ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="text-sm bg-gray-800 p-2 rounded-md">
                <span className="text-gray-400">Connected:</span>{" "}
                {account.substring(0, 6)}...{account.substring(38)}
              </div>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl mb-4">Your cart is empty</h2>
            <p className="mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items - LEFT & MIDDLE */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Cart Items ({cartItems.length})
                </h2>

                <ul className="divide-y divide-gray-700">
                  {cartItems.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.thumbnailPath}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="mt-1 text-sm text-gray-400">
                            {item.color && (
                              <p>
                                Color:{" "}
                                {item.color.charAt(0).toUpperCase() +
                                  item.color.slice(1)}
                              </p>
                            )}
                            {item.selectedSize && (
                              <p>Size: {item.selectedSize}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between">
                          <button
                            onClick={() =>
                              removeFromCart(item.cartId || item.id)
                            }
                            className="text-sm font-medium text-red-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order summary - RIGHT */}
            <div className="bg-gray-900 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-4">
                  <div>
                    <p>Subtotal</p>
                    <p className="text-sm text-gray-400">
                      {cartItems.length} items
                    </p>
                  </div>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex justify-between border-b border-gray-700 pb-4">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>

                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <div className="text-right">
                    <p>${totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">
                      ≈ {(totalPrice / 1500).toFixed(6)} ETH
                    </p>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={!account || isProcessing || cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-md text-center text-white font-medium mt-4
                    ${
                      account && !isProcessing && cartItems.length > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                >
                  {isProcessing ? "Processing..." : "Checkout with MetaMask"}
                </button>

                {!account && (
                  <p className="text-sm text-center text-yellow-400 mt-2">
                    Please connect your MetaMask wallet to checkout
                  </p>
                )}

                {transactionStatus && (
                  <div
                    className={`mt-4 p-3 rounded-md text-sm ${
                      transactionStatus.includes("failed")
                        ? "bg-red-900 text-red-200"
                        : "bg-blue-900 text-blue-200"
                    }`}
                  >
                    {transactionStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
