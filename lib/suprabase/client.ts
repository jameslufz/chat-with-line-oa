import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any, "public", "public", any, any> 

export const supabaseClient = () =>
{
    if(client) return client

    client = createBrowserClient(url, publicKey)
    return client
}