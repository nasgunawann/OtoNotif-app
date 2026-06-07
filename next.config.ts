import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_STANDALONE === "true" ? "standalone" : undefined,
};
console.log(`> Build Output Mode: ${nextConfig.output || "standard"}`);
export default nextConfig;
