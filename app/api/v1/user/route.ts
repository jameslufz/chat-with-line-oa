import { createClient } from "@/lib/suprabase/server"

export async function GET()
{   
    const supabase = await createClient()
    const { data: user, error } = await supabase.from("user").select().eq("is_blocked", false)

    if(error)
    {
        console.log(error)
    }

    return Response.json(user)
}