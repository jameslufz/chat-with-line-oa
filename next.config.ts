import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.1.108","snagged-motivator-womankind.ngrok-free.dev"],
    images: {
        remotePatterns: [
            new URL("https://sprofile.line-scdn.net/**")
        ]
    }
};

export default nextConfig;
