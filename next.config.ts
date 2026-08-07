import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "192.168.1.108",
        "snagged-motivator-womankind.ngrok-free.dev",
        "stickershop.line-scdn.net"
    ],
    images: {
        remotePatterns: [
            new URL("https://sprofile.line-scdn.net/**"),
            new URL("https://stickershop.line-scdn.net/stickershop/v1/sticker/**/android/sticker.png"),
        ]
    }
};

export default nextConfig;
