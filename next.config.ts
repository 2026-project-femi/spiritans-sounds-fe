import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
    unoptimized: true,
    minimumCacheTTL: 86400,
  },
  experimental: { turbopackFileSystemCacheForDev: false },
  serverExternalPackages: ['drizzle-kit'],
};

export default withPayload(nextConfig);