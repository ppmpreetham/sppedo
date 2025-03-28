import React, { useEffect, useRef } from "react";
import "../app/globals.css";
import Header from "../components/header";
import Announcement from "../components/announcement";
import gsap from "gsap";

const About = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Refs = useRef<Array<HTMLDivElement | null>>([]);
  const section3Ref = useRef<HTMLElement>(null);
  const listItemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    // Initial fade-in animation for main content
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );

    // Add hover effect for title
    if (titleRef.current) {
      gsap.set(titleRef.current, { transformOrigin: "center" });

      const handleTitleEnter = () => {
        gsap.to(titleRef.current, { scale: 1.02, duration: 0.2 });
      };

      const handleTitleLeave = () => {
        gsap.to(titleRef.current, { scale: 1, duration: 0.2 });
      };

      titleRef.current.addEventListener("mouseenter", handleTitleEnter);
      titleRef.current.addEventListener("mouseleave", handleTitleLeave);

      // Cleanup
      return () => {
        if (titleRef.current) {
          titleRef.current.removeEventListener("mouseenter", handleTitleEnter);
          titleRef.current.removeEventListener("mouseleave", handleTitleLeave);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Add hover effects for sections
    const sections = [
      section1Ref.current,
      ...section2Refs.current.filter(Boolean),
      section3Ref.current,
    ].filter(Boolean);

    const sectionEnterHandlers: Record<number, () => void> = {};
    const sectionLeaveHandlers: Record<number, () => void> = {};

    sections.forEach((section, index) => {
      if (section) {
        gsap.set(section, { transformOrigin: "center" });

        sectionEnterHandlers[index] = () => {
          gsap.to(section, { y: -5, scale: 1.05, duration: 0.3 });
        };

        sectionLeaveHandlers[index] = () => {
          gsap.to(section, { y: 0, scale: 1, duration: 0.3 });
        };

        section.addEventListener("mouseenter", sectionEnterHandlers[index]);
        section.addEventListener("mouseleave", sectionLeaveHandlers[index]);
      }
    });

    return () => {
      sections.forEach((section, index) => {
        if (section) {
          section.removeEventListener(
            "mouseenter",
            sectionEnterHandlers[index]
          );
          section.removeEventListener(
            "mouseleave",
            sectionLeaveHandlers[index]
          );
        }
      });
    };
  }, []);

  useEffect(() => {
    // Animate list items
    const validListItems = listItemRefs.current.filter(Boolean);

    validListItems.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, delay: index * 0.1 }
        );
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* <Announcement /> */}
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div ref={mainRef} className="max-w-4xl mx-auto">
          <h1
            ref={titleRef}
            className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-white to-emerald-400 bg-clip-text text-transparent"
          >
            Welcome to SPPEDO
          </h1>

          <div className="space-y-12">
            <section
              ref={section1Ref}
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 border border-zinc-800 hover:border-purple-500/50"
            >
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Fashion Meets Web3
              </h2>
              <p className="text-gray-300 leading-relaxed">
                SPPEDO bridges the gap between physical fashion and digital
                ownership. Every piece in our collection comes with its own
                unique NFT, creating a perfect fusion of traditional retail and
                blockchain technology.
              </p>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div
                ref={(el) => {
                  section2Refs.current[0] = el;
                }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50"
              >
                <h3 className="text-xl font-semibold mb-4 text-emerald-300">
                  Physical Collection
                </h3>
                <p className="text-gray-300">
                  Browse and purchase high-quality clothing pieces designed for
                  both style and comfort. Each item is carefully crafted to meet
                  our exceptional standards.
                </p>
              </div>

              <div
                ref={(el) => {
                  section2Refs.current[1] = el;
                }}
                className="bg-gradient-to-bl from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border border-zinc-800 hover:border-blue-500/50"
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-300">
                  Digital Ownership
                </h3>
                <p className="text-gray-300">
                  When you purchase any item, you automatically receive an NFT
                  proving ownership of your unique piece. Connect your wallet to
                  view your digital collection.
                </p>
              </div>
            </section>

            <section
              ref={section3Ref}
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 border border-zinc-800 hover:border-pink-500/50"
            >
              <h2 className="text-2xl font-semibold mb-4 text-pink-300">
                How It Works
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-4">
                {[
                  "Browse our collection and select your favorite pieces",
                  "Purchase the physical item",
                  "Connect your Web3 wallet",
                  "Receive your NFT certificate of authenticity",
                  "Track your fashion collection in the digital world",
                ].map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => {
                      listItemRefs.current[index] = el;
                    }}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
