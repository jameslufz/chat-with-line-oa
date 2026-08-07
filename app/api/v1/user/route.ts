import { createClient } from "@/lib/suprabase/server"

export async function GET()
{   
    const supabase = await createClient()
    const { data: user, error } = await supabase.rpc("get_users_with_unread")

    if(error)
    {
        console.log(error)
    }

    return Response.json(user)
}

export interface UserFriends
{
    userId: string
    name: string
    pictureUrl: string
    unread: number
    lastUnreadAt: string
    lastMessageId: string
    lastMessage: string
    markAsReadToken: string
}