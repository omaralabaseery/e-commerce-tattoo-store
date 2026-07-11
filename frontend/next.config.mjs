/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle: the Docker runner stage copies .next/standalone
  // instead of the full node_modules — keeps the image (and the small VPS disk) lean.
  output: "standalone",
  images: {
    // Keep this an explicit allow-list (avoid wildcard hostnames, which expose
    // the Image Optimizer to abuse). Add your real CDN/host here.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
