export interface UserEntity
{
    id: string
    user_id: string
    user_name: string
    picture_url?: string
    is_blocked: boolean
    created_at: Date
    updated_at?: Date
}

export interface MessageEntity
{
    id: string
    user_id: string
    event_id: string
    message: string
    quote_token: string
    mark_as_read_token: string
    reply_token: string
    sticker_id?: string
    package_id?: string
    sent_at: Date
    read_at?: Date
}