import type { NextConfig } from "next";

const BACKEND = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND}/api/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${BACKEND}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
