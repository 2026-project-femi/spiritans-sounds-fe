import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["cdn.sanity.io"],
		unoptimized: true, // TEMPORARY: free-tier quota exhausted — remove once quota resets and permanent fixes are live
		minimumCacheTTL: 86400, // cache optimized images for 24 hours (permanent)
	},
};

export default nextConfig;
