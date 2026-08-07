import { MAX_CHAT_PER_PAGE } from "@/constant"
import { createClient } from "@/lib/suprabase/server"

export async function GET(request: Request)
{   
    const url = new URL(request.url)
    const userId = url.searchParams.get("uid")
    const page = url.searchParams.get("p") || "1"

    const supabase = await createClient()
    const { data: user, error } = await supabase.rpc("get_conversation", {
        target_user_id: userId,
        skip_rows: (MAX_CHAT_PER_PAGE * (Number(page) - 1)),
        limit_rows: MAX_CHAT_PER_PAGE
    })

    if(error)
    {
        console.log("[GET] /message", error)
    }

    return Response.json(user)
}

export interface ChatMessage
{
    userId: string
    name: string
    pictureUrl: string
    eventId: string
    message: string
    quoteToken: string
    markAsReadToken: string
    replyToken: string
    stickerId?: string
    packageId?: string
    sentAt: string
    readAt?: string
    isSelf: boolean
}