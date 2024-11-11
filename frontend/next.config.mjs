// next.config.mjs
const nextConfig = {
  distDir: "build", // Custom build output directory
  reactStrictMode: true, // Enable React Strict Mode for better error handling
  async redirects() {
    return [
      {
        source: "/source-page",
        destination: "/destination-page",
        permanent: true,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
