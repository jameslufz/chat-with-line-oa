'use client'

import { ChatMessage } from "@/app/api/v1/message/route";
import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";

const ChatDisplay: ChatDisplayComponent = ({ chat }) =>
{
    const chatArea = useRef<HTMLDivElement>(null)

    useEffect(() =>
    {
        if(chatArea.current)
        {
            chatArea.current.scrollIntoView({ behavior: "smooth" })
            chatArea.current.scrollTo(0, chatArea.current.scrollHeight)
        }
    },
    [chat])

    return (
        <div
            className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-6 py-6 dark:bg-zinc-900"
            id="chat_area"
            ref={chatArea}
        >
            {
                chat.map((message) =>
                {
                    const self = message.isSelf
                    return (
                        <div
                            key={message.eventId}
                            className={clsx(
                                `flex`,
                                (self ? "justify-end" : "justify-start"),
                            )}
                        >
                            <div className="flex max-w-[75%] flex-col gap-1">
                                <div
                                    className={clsx(
                                        `rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap`,
                                        (self ? "bg-[#00B900] text-white" : "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100")
                                    )}
                                >
                                    {message.message}
                                </div>
                                <span
                                    className={clsx(
                                        `text-xs text-zinc-400`,
                                        (self ? "text-right" : "text-left"),
                                    )}
                                >
                                    {formatBubbleTime(message.sentAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
        </div>
    )
}

export default ChatDisplay

export const formatBubbleTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })


export interface ChatDisplayProps
{
    children?: ReactNode
    chat: ChatMessage[]
}

export type ChatDisplayComponent = (props: ChatDisplayProps) => ReactNode