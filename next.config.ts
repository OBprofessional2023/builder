import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: "loose", // 👈 allow importing ESM-only packages like @react-pdf/renderer
  },
};

export default nextConfig;
