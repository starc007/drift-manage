import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
  experimental: {
    turbo: {
      root: "..",
      resolveAlias: {
        fs: { browser: "./node-browser-compatibility.js" },
        crypto: { browser: "crypto-browserify" },
      },
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
