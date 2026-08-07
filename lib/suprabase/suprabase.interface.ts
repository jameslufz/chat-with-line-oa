export interface UserEntity
{
    id: string
    user_id: string
    user_name: string
    picture_url?: string
    is_blocked: boolean
    created_at: string
    updated_at?: string
}

export interface MessageEntity
{
    id: string
    user_id: string
    event_id: string
    message: string
    quote_token?: string
    mark_as_read_token?: string
    reply_token?: string
    sticker_id?: string
    package_id?: string
    sent_at: string
    read_at?: string
    is_self: boolean
}