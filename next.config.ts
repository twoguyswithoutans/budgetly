import withPWA, { PWAConfig } from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: { optimizeCss: true },
};

const pwaConfig: PWAConfig = {
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development",
	buildExcludes: [/app-build-manifest\.json$/],
};

export default withPWA(pwaConfig)(nextConfig);