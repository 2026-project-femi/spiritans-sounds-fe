import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    unoptimized: true,
    minimumCacheTTL: 86400,
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'assets.spiritanssound.com',
    },
  ],
  },
  experimental: { turbopackFileSystemCacheForDev: false },
  serverExternalPackages: ['drizzle-kit'],
};

export default withPayload(nextConfig);