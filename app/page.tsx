'use client'

import { useEffect, useState } from "react";
import { ChatEmptyIcon, LoadingIcon, SearchIcon } from "./components/icons";
import { supabaseClient } from "@/lib/suprabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserFriends } from "./api/v1/user/route";
import Image from "next/image";
import { ChatMessage } from "./api/v1/message/route";
import clsx from "clsx";
import { markAsRead } from "@/lib/messaging-api/client";
import InputForm from "./components/chat/input";
import { MessageEntity } from "@/lib/suprabase/suprabase.interface";
import ChatDisplay, { formatBubbleTime } from "./components/chat/chat";

const headers = new Headers()
headers.append("content-type", "application/json")
headers.append("accept", "*/*")

export default function Home()
{
    /**
     * 
     * Load list added friends.
     */
    const { data: users, isFetching: isLoadingUser, refetch: reloadUsers } = useQuery<UserFriends[]>({
        queryKey: ["listUsers"],
        queryFn: async () =>
        {
            const res = await fetch("/api/v1/user", { method: "GET" })
            const data = await res.json()
            return data
        }
    })

    /**
     * 
     * Load chat conversation.
     */
    const [selectedChat, setSelectedChat] = useState<UserFriends | null>(null)
    const { data: chat, isFetching: isChatLoading } = useQuery<ChatMessage[]>({
        queryKey: ["chatMessage"],
        queryFn: async () =>
        {
            if(!selectedChat) return null

            const res = await fetch("/api/v1/message?uid=" + selectedChat?.userId, { method: "GET" })
            return res.json()
        },
        enabled: (selectedChat !== null),
    })

    /**
     * 
     * Handle select user and read all message.
     */
    const handleSelectUser = async (user: UserFriends) =>
    {
        setSelectedChat(user)

        await markAsRead(user.userId, user.markAsReadToken)

        const badgeUnread = document.getElementById(`unread_badge_${user.userId}`) as HTMLSpanElement
        if(badgeUnread)
        {
            badgeUnread.remove()
        }
    }

    const handleSendMessage = (self: boolean, message: string, sentAt: string) =>
    {
        const chatArea = document.getElementById("chat_area")
        if(!chatArea) return

        const divWrapper = document.createElement("div")
        divWrapper.className = `flex ${(self ? "justify-end" : "justify-start")}`

        const divMessage = document.createElement("div")
        divMessage.className = `flex max-w-[75%] flex-col gap-1`

        const divText = document.createElement("div")
        divText.className = `rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${(self ? "bg-[#00B900] text-white" : "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100")}`
        divText.textContent = message

        const spanTime = document.createElement("span")
        spanTime.className = `text-xs text-zinc-400 ${(self ? "text-right" : "text-left")}`
        spanTime.textContent = formatBubbleTime(sentAt)

        divMessage.append(divText)
        divMessage.append(spanTime)

        divWrapper.append(divMessage)

        chatArea.append(divWrapper)
    }

    const supabase = supabaseClient()
    useEffect(() =>
    {
        const channel = supabase
        .channel('messages-channel')
        .on<MessageEntity>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message' }, async (payload) =>
        {
            if(selectedChat)
            {
                const message = payload.new
                handleSendMessage(message.is_self, message.message, message.sent_at)

                const chatArea = document.getElementById("chat_area")
                if(!chatArea) return

                chatArea.scroll({ behavior: "smooth" })
                chatArea.scrollTo(0, chatArea.scrollHeight)

                if(!message.is_self && message.mark_as_read_token) {
                    markAsRead(message.user_id, message.mark_as_read_token).catch()
                }
            }

            reloadUsers()
        })
        .subscribe((status, err) => {
            console.log("subscribe status", status, err)
        })

        return () => {
            supabase.removeChannel(channel)
        }
    },
    [supabase, selectedChat, reloadUsers])

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="border-b border-gray-200 px-4 py-4 dark:border-zinc-700">
                    <h1 className="flex items-center gap-2 text-lg font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00B900]" />
                        LINE OA Chats
                    </h1>
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-zinc-500 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#00B900] dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700">
                        <SearchIcon />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {
                        isLoadingUser || users === undefined ? (
                            <div className="w-full h-auto flex justify-center items-center">
                                <LoadingIcon width="60" height="60" />
                            </div>
                        ) : (
                            users === null ? (
                                <div className="w-full h-auto flex justify-center items-center">
                                    <span>ไม่สามารถโหลดผู้ใช้ได้</span>
                                </div>
                            ) : (
                                users.map((user) => {
                                    const isActive = selectedChat && (user.userId === selectedChat.userId);
                                    return (
                                        <button
                                            key={user.userId}
                                            type="button"
                                            onClick={() => handleSelectUser(user)}
                                            className={clsx(
                                                `flex cursor-pointer w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors dark:border-zinc-800`,
                                                (isActive ? "bg-[#00B900]/10 dark:bg-[#00B900]/15" : "hover:bg-gray-100 dark:hover:bg-zinc-800"),
                                            )}
                                        >
                                            <Image
                                                src={user.pictureUrl}
                                                width={40}
                                                height={40}
                                                alt={user.name}
                                                loading="eager"
                                                className="size-16 rounded-full"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <span className="truncate font-medium">
                                                        {user.name}
                                                    </span>
                                                    <span className="shrink-0 text-xs text-zinc-400">
                                                        {formatListTime(user.lastUnreadAt)}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 flex items-center justify-between gap-2">
                                                    <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                                                        {user.markAsReadToken ? user.name : "คุณ"}: {user.lastMessage}
                                                    </span>
                                                    {
                                                        user.unread > 0 ? (
                                                            <span
                                                                className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#00B900] px-1.5 text-xs font-semibold text-white"
                                                                id={`unread_badge_${user.userId}`}
                                                            >
                                                                {user.unread}
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        )
                    }
                </div>
            </aside>

            <main className="flex flex-1 flex-col bg-white dark:bg-zinc-800">
                {
                    selectedChat === null ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-400">
                            <ChatEmptyIcon />
                            <p className="text-sm">เลือกผู้ใช้เพื่อเริ่มต้นการสนทนา</p>
                        </div>
                    ) : (
                        chat === undefined || isChatLoading ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-400">
                                <LoadingIcon width="60" height="60" />
                            </div>
                        ) : (
                            chat === null ? (
                                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-400">
                                    <ChatEmptyIcon />
                                    <p className="text-sm">ไม่สามารถโหลดแชตได้</p>
                                </div>
                            ) : (
                                <>
                                    <header className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
                                        <Image
                                            src={selectedChat.pictureUrl}
                                            width={40}
                                            height={40}
                                            alt={selectedChat.name}
                                            loading="eager"
                                            className="size-16 rounded-full"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold">
                                                {selectedChat.name}
                                            </p>
                                            <p className="truncate font-mono text-xs text-zinc-400">
                                                {selectedChat.userId}
                                            </p>
                                        </div>
                                    </header>

                                    <ChatDisplay chat={chat} />
                                    <InputForm user={selectedChat} />
                                </>
                            )
                        )
                    )
                }
            </main>
        </div>
    );
}

function formatListTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
        return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
}