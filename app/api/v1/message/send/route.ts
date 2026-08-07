import lineMessagingApiClient from "@/lib/messaging-api/client"
import { createClient } from "@/lib/suprabase/server"
import { MessageEntity } from "@/lib/suprabase/suprabase.interface"
import { v7 as uuid } from "uuid"

export async function POST(request: Request)
{   
    const b = await request.json() as SendMessageRequest

    const userId = b.uid
    const text = b.text

    const now = new Date()

    const body = {
        to: userId,
        messages: [
            {
                type: "text",
                text,
            }
        ]
     } satisfies LineMessagePushRequest

    const supabase = await createClient()
    const [{ error }] = await Promise.all([
        supabase
        .from("message")
        .insert<MessageEntity>({
            id: uuid(),
            user_id: userId,
            event_id: uuid(),
            message: text,
            sent_at: now.toISOString(),
            read_at: now.toISOString(),
            is_self: true,
        }),
        lineMessagingApiClient("POST", "/message/push", body),
    ])

    if(error)
    {
        console.log(error)
    }

    return Response.json({})
}

export interface SendMessageRequest
{
    uid: string
    text: string
}

export interface LineMessagePushRequest
{
    to: string
    messages: { type: string; text: string; }[]
}