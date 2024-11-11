const nextConfig = {
  distDir: "build", // Custom build output directory
  reactStrictMode: true,
  basePath: '/car-rental-system', // If you're using a subdirectory
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
