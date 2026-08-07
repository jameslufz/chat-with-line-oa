import lineMessagingApiClient from "@/lib/messaging-api/client"
import { createClient } from "@/lib/suprabase/server"
import { MessageEntity } from "@/lib/suprabase/suprabase.interface"

export async function POST(request: Request)
{   
    const b = await request.json() as ReadMessageRequest

    const userId = b.uid
    const markAsReadToken = b.markAsReadToken

    const now = new Date()

    const supabase = await createClient()
    const [update] = await Promise.all([
        supabase
        .from("message")
        .update<Partial<MessageEntity>>({
            read_at: now.toISOString()
        })
        .eq("user_id", userId),
        lineMessagingApiClient("POST", "/chat/markAsRead", { markAsReadToken }),
    ])

    if(update.error)
    {
        console.log("[POST] /message/read", update.error)
    }

    return Response.json({})
}

export interface ReadMessageRequest
{
    uid: string
    markAsReadToken: string
}