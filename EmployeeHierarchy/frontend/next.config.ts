import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = {
        type: 'memory', 
      };
    }
    return config;
  },
};

export default nextConfig;