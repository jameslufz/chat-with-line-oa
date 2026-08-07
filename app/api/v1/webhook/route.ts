import lineMessagingApiClient from "@/lib/messaging-api/client"
import { GetProfileResponse } from "@/lib/messaging-api/client.interface"
import { WebhookRequest } from "@/lib/messaging-api/webhook.interface"
import { createClient } from "@/lib/suprabase/server"
import { MessageEntity, UserEntity } from "@/lib/suprabase/suprabase.interface"
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js"
import { v7 as uuid } from "uuid"

export async function POST(req: Request)
{
    const supabase = await createClient()

    const b = await req.json() as WebhookRequest
    
    await Promise.all(
        b.events.map(async (event) =>
        {
            if(["follow","unfollow"].includes(event.type))
            {
                const { data: existsUser, error: existsUserError } = await supabase.from("user").select<"*", UserEntity>().eq("user_id", event.source.userId)
                if(existsUserError)
                {
                    console.log("existsUserError:", existsUserError)
                    return Response.json({})
                }

                if(existsUser.length > 0)
                {
                    const { error } = await supabase
                    .from("user")
                    .update<Partial<UserEntity>>({
                        is_blocked: (event.type === "unfollow"),
                        updated_at: (new Date()).toISOString()
                    })
                    .eq("user_id", event.source.userId)

                    if(error)
                    {
                        console.log("update user error:", error)
                        return Response.json({})
                    }
                }
                else
                {
                    const profile = await lineMessagingApiClient<object, GetProfileResponse>("GET", `/profile/${event.source.userId}`)

                    if("message" in profile && typeof profile.message === "string")
                    {
                        console.log(profile)
                        return Response.json({})
                    }

                    const { error } = await insertUser(supabase, event.source.userId, profile.displayName, false, profile.pictureUrl)

                    if(error)
                    {
                        console.log("insert user error", error)
                    }
                }
            }
            else if(event.type === "message")
            {
                const { data, error: checkUserError } = await supabase.from("user").select().eq("user_id", event.source.userId)
                if(checkUserError)
                {
                    console.log("check exist user error", checkUserError)
                }

                if(!data || (data && data.length === 0))
                {
                    const profile = await lineMessagingApiClient<object, GetProfileResponse>("GET", `/profile/${event.source.userId}`)

                    if("message" in profile && typeof profile.message === "string")
                    {
                        throw new Error(profile.message)
                    }

                    const { error } = await insertUser(supabase, event.source.userId, profile.displayName, false, profile.pictureUrl)
                    if(error)
                    {
                        console.log("insert user error", error)
                    }
                }

                const { error } = await supabase.from("message").insert<MessageEntity>({
                    id: uuid(),
                    user_id: event.source.userId,
                    event_id: event.webhookEventId,
                    message: event.message.text,
                    quote_token: event.message.quoteToken,
                    mark_as_read_token: event.message.markAsReadToken,
                    reply_token: event.replyToken,
                    sticker_id: event.message.stickerId,
                    package_id: event.message.packageId,
                    sent_at: (new Date()).toISOString(),
                    is_self: false,
                })

                if(error)
                {
                    console.log("insert chat error", error)
                }
            }

            return null
        })
    )

    return Response.json(b)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = SupabaseClient<any, "public", "public", any, any>

const insertUser =  async(supabase: Supabase, userId: string, userName: string, isBlocked: boolean = false, pictureUrl?: string): Promise<PostgrestSingleResponse<null>> =>
{
    return supabase.from("user").insert<UserEntity>({
        id: uuid(),
        user_id: userId,
        user_name: userName,
        picture_url: pictureUrl,
        is_blocked: isBlocked,
        created_at: (new Date()).toISOString()
    })
}