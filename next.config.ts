import type { NextConfig } from "next";

// Check if standalone has been explicitly disabled for local use
const disableStandalone = process.env.DISABLE_STANDALONE === "true";

const nextConfig: NextConfig = {
  // 1. Defaults to standalone unless overridden by your environment flag
  output: disableStandalone ? undefined : "standalone",
};

console.log(`> Build Output Mode: ${nextConfig.output ?? "standard"}`);

export default nextConfig;
