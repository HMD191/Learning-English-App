import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Cho phép deploy ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Cho phép deploy ngay cả khi có lỗi TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
