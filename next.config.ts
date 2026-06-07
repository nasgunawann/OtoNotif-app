import type { NextConfig } from "next";

const isStandalone = process.env.NEXT_STANDALONE === "true";

const nextConfig: NextConfig = {
  // 1. Keep your conditional build output
  output: isStandalone ? "standalone" : undefined,

  allowedDevOrigins: ["192.168.1.8"],
};

console.log(`> Build Output Mode: ${nextConfig.output ?? "standard"}`);

export default nextConfig;
