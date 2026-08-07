import { SendMessageRequest } from "@/app/api/v1/message/send/route"

const LINE_API = "https://api.line.me/v2/bot"
const accessToken = process.env.CHANNEL_ACCESS_TOKEN as string

const lineMessagingApiClient: ApiClient = async (method, path, payload, moreHeaders?: Record<string, string>[]) =>
{
    const headers = new Headers()
    headers.append("Content-type", "application/json")
    headers.append("Accept", "*/*")
    headers.append("Authorization", "Bearer " + accessToken)

    if(moreHeaders && moreHeaders.length > 0)
    {
        for(const header of moreHeaders)
        {
            const [key] = Object.keys(header)
            const [value] = Object.values(header)
            headers.append(key, value)
        }
    }

    const api = (path.includes("/api/v1") ? path : LINE_API + path)
    const res = await fetch(api, {
        mode: "cors",
        method,
        headers,
        body: (method !== "GET" ? JSON.stringify(payload) : undefined),
    })

    const data = await res.json()
    return data
}

export type ApiMethod =  "POST" | "GET"
export type ApiClient = <P = object, R = unknown>(method: ApiMethod, path: string, payload?: P) => Promise<R>

export default lineMessagingApiClient

export const markAsRead = (id: string, token: string) => lineMessagingApiClient(
    "POST",
    "/api/v1/message/read",
    {
        uid: id,
        markAsReadToken: token
    }
)

export const sendMessage = (uid: SendMessageRequest["uid"], text: SendMessageRequest["text"]) => lineMessagingApiClient(
    "POST",
    "/api/v1/message/send",
    {
        uid,
        text,
    }
)