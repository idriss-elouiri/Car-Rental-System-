/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  output: "export",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Ensure this is set
  },
};

export default nextConfig;
