import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string

export const suprabaseClient = async () => createClient(url, publicKey)