import { NextRequest, NextResponse } from "next/server";
import * as crypto from "node:crypto"

export async function proxy(req: NextRequest)
{
    const signature = req.headers.get("x-line-signature")
    if(!signature)
    {
        return NextResponse.json({ message: "unauthorized" }, { status: 401 })
    }

    const b = await req.json()
    const url = new URL(req.url)
    console.log("request info:", {
        host: url.origin,
        path: url.pathname,
        method: req.method,
        body: b,
    })

    const isLINE = validateSignature(JSON.stringify(b), signature)
    console.log("isLINE", isLINE)
}

export const config = {
    matcher: "/api/v1/:path*"
}

const validateSignature = (body: string, lineSignature: string): boolean =>
{
    const channelSecret = process.env.CHANNEL_SECRET as string
    const signature = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");

    return lineSignature === signature
}