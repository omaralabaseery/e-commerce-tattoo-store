/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Keep this an explicit allow-list (avoid wildcard hostnames, which expose
    // the Image Optimizer to abuse). Add your real CDN/host here.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
