const accessToken = process.env.CHANNEL_ACCESS_TOKEN as string

const LineMessagingApiClient: ApiClient = async (method, api, payload) =>
{
    const headers = new Headers()
    headers.append("Content-type", "application/json")
    headers.append("Accept", "*/*")
    headers.append("Authorization", "Bearer " + accessToken)
    
    const res = await fetch(api, {
        mode: "cors",
        method,
        headers,
        body: (method !== "GET" ? JSON.stringify(payload) : undefined),
    })

    console.log(api)
    const data = await res.json()
    return data
}

export type ApiMethod =  "POST" | "GET"
export type ApiClient = <P = object, R = unknown>(method: ApiMethod, path: string, payload?: P) => Promise<R>

export default LineMessagingApiClient