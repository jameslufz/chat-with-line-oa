'use client'

import { ChatMessage } from "@/app/api/v1/message/route";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LoadingIcon } from "../icons";
import { LINE_STICKER_URL, MAX_CHAT_PER_PAGE } from "@/constant";

const ChatDisplay: ChatDisplayComponent = ({ chat, selectedUserId }) =>
{
    const chatArea = useRef<HTMLDivElement>(null)

    const [page, setPage] = useState(1)
    const handleNextPage = useCallback(() => setPage(page+1), [page])

    /**
     * 
     * Smooth scroll.
     */
    useEffect(() =>
    {
        const chatEl = chatArea.current
        if(chatEl)
        {
            chatEl.scrollIntoView({ behavior: "smooth" })
            chatEl.scrollTo(0, chatEl.scrollHeight)
        }
    },
    [chat])

    const [moreMessageStore, setMoreMessageStore] = useState<ChatMessage[]>([])
    const [isNoMoreMessages, setIsNoMoreMessages] = useState<boolean>(false)
    const { isFetching: isLoadingMoreMessages } = useQuery({
        queryKey: ["moreMessages", selectedUserId, page],
        queryFn: async () =>
        {
            if(page > 1)
            {
                if(!chat) return null

                const res = await fetch("/api/v1/message?uid=" + selectedUserId + "&p=" + page, { method: "GET" })
                const data = await res.json()

                if(data.length === 0)
                {
                    setIsNoMoreMessages(true)
                }
                else
                {
                    if(data.length < MAX_CHAT_PER_PAGE)
                    {
                        setIsNoMoreMessages(true)
                    }

                    setMoreMessageStore([...moreMessageStore, ...data])
                }

                return data
            }

            return []
        },
        enabled: (selectedUserId !== null),
        refetchOnWindowFocus: false,
    })

    /**
     * 
     * Handle scroll to top.
     */
    useEffect(() =>
    {
        const chatEl = chatArea.current
        const handleOnScroll = (e: Event) =>
        {
            const { scrollTop, clientHeight, scrollHeight } = e.currentTarget as HTMLDivElement
            const isAtTop = ((Math.abs(scrollTop) + clientHeight) >= (scrollHeight - 0.5))
            if(isAtTop && !isNoMoreMessages)
            {
                handleNextPage()
            }
        }

        if(chatEl)
        {
            chatEl.addEventListener("scroll", handleOnScroll)
        }

        return () => {
            if(chatEl) {
                return chatEl.removeEventListener("scroll", handleOnScroll)
            }
        }
    },
    [handleNextPage, isNoMoreMessages])

    return (
        <div
            className="flex flex-col-reverse flex-1 space-y-4 overflow-y-auto bg-gray-50 px-6 py-6 dark:bg-zinc-900"
            id="chat_area"
            ref={chatArea}
        >
            {
                [...chat, ...moreMessageStore].map((message) =>
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
                                    {
                                        message.message === "" && message.stickerId ? (
                                            <Image
                                                src={LINE_STICKER_URL.replaceAll("%s", message.stickerId)}
                                                width={128}
                                                height={128}
                                                alt="sticker"
                                                className="size-32"
                                            />
                                        ) : (
                                            message.message
                                        )
                                    }
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
                })
            }
            {
                isLoadingMoreMessages && (
                    <div className="inline-flex justify-center items-center">
                        <LoadingIcon width="60" height="60" />
                    </div>
                )
            }
            {
                isNoMoreMessages && (
                    <div className="inline-flex justify-center items-center">
                        <span className="text-zinc-700 text-sm">- สิ้นสุดข้อมูล -</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatDisplay

export const formatBubbleTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })


export interface ChatDisplayProps
{
    children?: ReactNode
    chat: ChatMessage[]
    selectedUserId: string
}

export type ChatDisplayComponent = (props: ChatDisplayProps) => ReactNode