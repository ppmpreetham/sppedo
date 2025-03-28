import { Suspense } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import "../app/globals.css";

// dynamic import with SSR disabled for Three.js
const ShoppingMetaverse = dynamic(
  () =>
    import("../components/ThreeDShop/ShoppingMetaverse").then(
      (mod) => mod.ShoppingMetaverse
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Head>
        <title>3D Shopping Metaverse</title>
        <meta
          name="description"
          content="Shop for clothes in a 3D virtual store"
        />
      </Head>

      <main className="h-full w-full">
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              Loading 3D Experience...
            </div>
          }
        >
          <ShoppingMetaverse />
        </Suspense>
      </main>
    </div>
  );
}
