import { NextRequest, NextResponse } from "next/server";
import * as crypto from "node:crypto"

export async function proxy(req: NextRequest)
{
    const url = new URL(req.url)
    if(url.pathname.includes("webhook"))
    {
        const signature = req.headers.get("x-line-signature")
        if(!signature)
        {
            return NextResponse.json({ message: "unauthorized" }, { status: 401 })
        }

        const b = await req.json()
        const isLINE = validateSignature(JSON.stringify(b), signature)
        if(!isLINE)
        {
            return NextResponse.json({ message: "unauthorized" }, { status: 401 })
        }
    }

    return NextResponse.next()
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