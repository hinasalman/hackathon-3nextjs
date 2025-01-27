 //import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
   /* config options here */
//};

//export default nextConfig;






import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io","images.remotePatterns"], // Sanity ke images ke liye domain allow karna zaroori hai
  },
};
