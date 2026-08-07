'use client'

import { useEffect, useMemo, useState } from "react";
import { ChatEmptyIcon, LoadingIcon, SearchIcon } from "./components/icons";
import { supabaseClient } from "@/lib/suprabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserFriends } from "./api/v1/user/route";
import Image from "next/image";
import { ChatMessage } from "./api/v1/message/route";
import { markAsRead } from "@/lib/messaging-api/client";
import InputForm from "./components/chat/input";
import { MessageEntity, UserEntity } from "@/lib/suprabase/suprabase.interface";
import ChatDisplay, { formatBubbleTime } from "./components/chat/chat";
import ListUsers from "./components/chat/users";

const headers = new Headers()
headers.append("content-type", "application/json")
headers.append("accept", "*/*")

export default function Home()
{
    /**
     * 
     * Load list added friends.
    */
    const { data: listUsers, isFetching: isLoadingUsers, isRefetching: isReloadingUser, refetch: reloadUsers } = useQuery<UserFriends[]>({
        queryKey: ["listUsers"],
        queryFn: async () =>
        {
            const res = await fetch("/api/v1/user", { method: "GET" })
            const data = await res.json()
            return data
        },
        refetchOnWindowFocus: false,
    })

    /**
     * 
     * Filter user.
     */
    const [userQuery, setUserQuery] = useState<string>("")
    const handleTypingUserName: React.KeyboardEventHandler<HTMLInputElement> = (e) => setUserQuery(e.currentTarget.value)

    const filterdUsers = useMemo(() =>
    {
        if(!listUsers || (listUsers && userQuery === "")) return listUsers

        return listUsers.filter((user) => user.name.includes(userQuery))
    },
    [listUsers, userQuery])

    /**
     * 
     * Load chat conversation.
     */
    const [selectedChat, setSelectedChat] = useState<UserFriends | null>(null)
    const { data: chat, isFetching: isChatLoading } = useQuery<ChatMessage[]>({
        queryKey: ["chatMessage", selectedChat],
        queryFn: async () =>
        {
            if(!selectedChat) return null

            const res = await fetch("/api/v1/message?uid=" + selectedChat?.userId, { method: "GET" })
            return res.json()
        },
        enabled: (selectedChat !== null),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    })

    /**
     * 
     * Mutate mark as read
     */
    const { mutateAsync: markAsReadChat } = useMutation<unknown, Error, Pick<UserFriends, "userId" | "markAsReadToken">>({
        mutationKey: ["markAsRead"],
        mutationFn: async (user) => markAsRead(user.userId, user.markAsReadToken)
    })

    /**
     * 
     * Handle select user and read all message.
     */
    const handleSelectChat = async (user: UserFriends) =>
    {
        setSelectedChat(user)

        if(user.unread > 0) {
            await markAsReadChat(user)
        }

        const badgeUnread = document.getElementById(`unread_badge_${user.userId}`) as HTMLSpanElement
        if(badgeUnread)
        {
            badgeUnread.classList.add("hidden")
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
        .on<UserEntity>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user' }, () =>
        {
            reloadUsers().catch()
        })
        .on<UserEntity>('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user' }, () =>
        {
            reloadUsers().catch()
        })
        .on<MessageEntity>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message' }, async (payload) =>
        {
            if(selectedChat)
            {
                const message = payload.new
                if(selectedChat.userId === message.user_id)
                {
                    handleSendMessage(message.is_self, message.message, message.sent_at)

                    const chatArea = document.getElementById("chat_area")
                    if(!chatArea) return

                    chatArea.scroll({ behavior: "smooth" })
                    chatArea.scrollTo(0, chatArea.scrollHeight)

                    if(!message.is_self && message.mark_as_read_token) {
                        markAsRead(message.user_id, message.mark_as_read_token).catch()
                    }
                }
            }

            reloadUsers().catch()
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
                    <div className="relative top-0">
                        <input
                            className="w-full pl-8 mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-zinc-500 ring-1 ring-[#00B900] outline-none transition focus-within:ring-2 focus-within:ring-[#00B900] dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                            onKeyUp={handleTypingUserName}
                            placeholder="ค้นหาผู้ใช้"
                        />
                        <SearchIcon className="absolute top-1/2 left-2 -translate-y-1/2" />
                    </div>
                </div>

                <ListUsers
                    users={(isLoadingUsers && !isReloadingUser ? undefined : filterdUsers)}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                />
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