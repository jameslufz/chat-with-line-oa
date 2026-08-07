export type WebhookEventType = "message" | "edit" | "unsend" | "follow" | "unfollow" | "join" | "leave"
export interface WebhookEvents
{
    type: WebhookEventType
    mode: string
    timestamp: number
    source: {
        type: string
        userId: string
    }
    webhookEventId: string
    deliveryContext: {
        isRedelivery: boolean
    }
    follow: {
        isUnblocked: boolean
    }
    message: {
        type: string
        id: string
        quoteToken: string
        markAsReadToken: string
        text: string
        stickerId: string
        packageId: string
    }
    replyToken: string
}

export interface WebhookRequest
{
    destination: string
    events: WebhookEvents[]
}