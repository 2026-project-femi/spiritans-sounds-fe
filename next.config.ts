import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL: 86400,
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io', 
    },
  ],
  },
  experimental: { turbopackFileSystemCacheForDev: false },
  serverExternalPackages: ['drizzle-kit'],
};

export default withPayload(nextConfig);