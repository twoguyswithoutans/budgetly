declare module "next-pwa" {
    import type { NextConfig } from "next";

    export interface PWAConfig {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
        buildExcludes?: (RegExp | string)[];
        [key: string]: any;
    }

    const withPWA: (config?: PWAConfig) => (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
}