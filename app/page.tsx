'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatEmptyIcon, SearchIcon, SendIcon } from "./components/icons";
import Avatar from "./components/avatar";
import { supabaseClient } from "@/lib/suprabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Home()
{
    const supabase = supabaseClient()
    useEffect(() =>
    {
        const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, (payload) => {
            console.log("payload", payload)
        })
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    },
    [supabase])

    const {} = useQuery({
        queryKey: ["listUsers"],
        queryFn: async () =>
        {
            const data = await fetch("/api/v1/user", { method: "GET" })
            return data
        }
    })

    const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
    const [inputText, setInputText] = useState("");
    const threadEndRef = useRef<HTMLDivElement>(null);

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedId) ?? null,
        [conversations, selectedId],
    );

    useEffect(() => {
        threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedConversation?.messages]);

    function handleSelect(id: string) {
        setSelectedId(id);
        setInputText("");
    }

    function handleSend() {
        const trimmed = inputText.trim();
        if (!trimmed) {
            return;
        }
        setInputText("");
    }

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {/* <div className="w-full h-screen fixed top-0 left-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <LoadingIcon />
            </div> */}
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
                    {conversations.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-zinc-400">
                            No conversations found
                        </p>
                    ) : (
                        conversations.map((conversation) => {
                            const isActive = conversation.id === selectedId;
                            return (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    onClick={() => handleSelect(conversation.id)}
                                    className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors dark:border-zinc-800 ${
                                        isActive
                                            ? ("bg-[#00B900]/10 dark:bg-[#00B900]/15")
                                            : ("hover:bg-gray-100 dark:hover:bg-zinc-800")
                                    }`}
                                >
                                    <Avatar
                                        displayName={conversation.displayName}
                                        seed={conversation.userId}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="truncate font-medium">
                                                {conversation.displayName}
                                            </span>
                                            <span className="shrink-0 text-xs text-zinc-400">
                                                {formatListTime(conversation.lastMessageAt)}
                                            </span>
                                        </div>
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                                                {conversation.lastMessage}
                                            </span>
                                            {conversation.unreadCount > 0 ? (
                                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#00B900] px-1.5 text-xs font-semibold text-white">
                                                    {conversation.unreadCount}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>

            <main className="flex flex-1 flex-col bg-white dark:bg-zinc-800">
                {
                    selectedConversation === null ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-400">
                            <ChatEmptyIcon />
                            <p className="text-sm">Select a conversation to start chatting</p>
                        </div>
                    ) : (
                        <>
                            <header className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
                                <Avatar
                                    displayName={selectedConversation.displayName}
                                    seed={selectedConversation.userId}
                                />
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {selectedConversation.displayName}
                                    </p>
                                    <p className="truncate font-mono text-xs text-zinc-400">
                                        {selectedConversation.userId}
                                    </p>
                                </div>
                            </header>

                            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-6 py-6 dark:bg-zinc-900">
                                {selectedConversation.messages.map((message) => {
                                    const isAssistant = message.role === "assistant";
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isAssistant ? ("justify-end") : ("justify-start")}`}
                                        >
                                            <div className="flex max-w-[75%] flex-col gap-1">
                                                <div
                                                    className={`rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                                                        isAssistant
                                                            ? ("bg-[#00B900] text-white")
                                                            : ("bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100")
                                                    }`}
                                                >
                                                    {message.text}
                                                </div>
                                                <span
                                                    className={`text-xs text-zinc-400 ${
                                                        isAssistant ? ("text-right") : ("text-left")
                                                    }`}
                                                >
                                                    {formatBubbleTime(message.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={threadEndRef} />
                            </div>

                            <div className="border-t border-gray-200 px-6 py-4 dark:border-zinc-700">
                                <div className="flex items-end gap-3">
                                    <textarea
                                        value={inputText}
                                        onChange={(event) => setInputText(event.target.value)}
                                        onKeyDown={handleInputKeyDown}
                                        rows={1}
                                        placeholder="Type a reply..."
                                        className="max-h-32 flex-1 resize-none rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900 outline-none ring-1 ring-transparent focus:ring-[#00B900] dark:bg-zinc-700 dark:text-zinc-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={inputText.trim().length === 0}
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00B900] text-white transition-colors hover:bg-[#00a200] disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Send message"
                                    >
                                        <SendIcon />
                                    </button>
                                </div>
                            </div>
                        </>
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

function formatBubbleTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
    createdAt: string;
};

type Conversation = {
    id: string;
    userId: string;
    displayName: string;
    pictureUrl: string | null;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    messages: Message[];
};

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "c1",
        userId: "Uf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
        displayName: "Somchai Jaidee",
        pictureUrl: null,
        lastMessage: "ได้ครับ เดี๋ยวผมโอนเลยนะครับ",
        lastMessageAt: "2026-08-06T09:41:00+07:00",
        unreadCount: 2,
        messages: [
            {
                id: "c1-m1",
                role: "user",
                text: "สวัสดีครับ อยากสอบถามเรื่องแพ็กเกจรายเดือนหน่อยครับ",
                createdAt: "2026-08-06T09:32:00+07:00",
            },
            {
                id: "c1-m2",
                role: "assistant",
                text: "สวัสดีครับคุณสมชาย แพ็กเกจรายเดือนเริ่มต้นที่ 299 บาท ใช้ได้ไม่จำกัดครับ",
                createdAt: "2026-08-06T09:34:00+07:00",
            },
            {
                id: "c1-m3",
                role: "user",
                text: "มีโปรสำหรับลูกค้าใหม่ไหมครับ",
                createdAt: "2026-08-06T09:37:00+07:00",
            },
            {
                id: "c1-m4",
                role: "assistant",
                text: "มีครับ ลูกค้าใหม่รับส่วนลด 20% เดือนแรก เหลือ 239 บาทครับ",
                createdAt: "2026-08-06T09:39:00+07:00",
            },
            {
                id: "c1-m5",
                role: "user",
                text: "ได้ครับ เดี๋ยวผมโอนเลยนะครับ",
                createdAt: "2026-08-06T09:41:00+07:00",
            },
        ],
    },
    {
        id: "c2",
        userId: "U2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
        displayName: "Nattapon K.",
        pictureUrl: null,
        lastMessage: "ขอบคุณมากครับ เข้าใจแล้ว",
        lastMessageAt: "2026-08-06T08:15:00+07:00",
        unreadCount: 0,
        messages: [
            {
                id: "c2-m1",
                role: "user",
                text: " order เมื่อวานยังไม่ได้ของเลยครับ เช็คให้หน่อยได้ไหม",
                createdAt: "2026-08-06T08:02:00+07:00",
            },
            {
                id: "c2-m2",
                role: "assistant",
                text: "รบกวนขอเลขคำสั่งซื้อหน่อยได้ไหมครับ จะได้ตรวจสอบให้",
                createdAt: "2026-08-06T08:05:00+07:00",
            },
            {
                id: "c2-m3",
                role: "user",
                text: "เลข #TH-88421 ครับ",
                createdAt: "2026-08-06T08:08:00+07:00",
            },
            {
                id: "c2-m4",
                role: "assistant",
                text: "ตรวจสอบแล้วครับ พัสดุอยู่ระหว่างจัดส่ง คาดว่าถึงวันนี้ช่วงบ่ายครับ",
                createdAt: "2026-08-06T08:12:00+07:00",
            },
            {
                id: "c2-m5",
                role: "user",
                text: "ขอบคุณมากครับ เข้าใจแล้ว",
                createdAt: "2026-08-06T08:15:00+07:00",
            },
        ],
    },
    {
        id: "c3",
        userId: "U3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
        displayName: "Ploychompoo S.",
        pictureUrl: null,
        lastMessage: "โอเคค่ะ ไว้จะแวะไปสาขาสยามนะคะ",
        lastMessageAt: "2026-08-05T19:50:00+07:00",
        unreadCount: 1,
        messages: [
            {
                id: "c3-m1",
                role: "user",
                text: "สาขาสยามเปิดถึงกี่โมงคะ",
                createdAt: "2026-08-05T19:40:00+07:00",
            },
            {
                id: "c3-m2",
                role: "assistant",
                text: "สาขาสยามเปิดทุกวัน 10:00 - 22:00 น. ครับ",
                createdAt: "2026-08-05T19:43:00+07:00",
            },
            {
                id: "c3-m3",
                role: "user",
                text: "มีที่จอดรถไหมคะ",
                createdAt: "2026-08-05T19:46:00+07:00",
            },
            {
                id: "c3-m4",
                role: "assistant",
                text: "มีครับ จอดได้ที่อาคารจอดรถชั้น B2 ลูกค้าร้านรับส่วนลดค่าจอด 3 ชั่วโมงแรกครับ",
                createdAt: "2026-08-05T19:48:00+07:00",
            },
            {
                id: "c3-m5",
                role: "user",
                text: "โอเคค่ะ ไว้จะแวะไปสาขาสยามนะคะ",
                createdAt: "2026-08-05T19:50:00+07:00",
            },
        ],
    },
    {
        id: "c4",
        userId: "U4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
        displayName: "Anucha Meesuk",
        pictureUrl: null,
        lastMessage: "ระบบแจ้งเตือนใช้งานได้ปกติแล้วครับ ขอบคุณทีมงาน",
        lastMessageAt: "2026-08-05T14:22:00+07:00",
        unreadCount: 0,
        messages: [
            {
                id: "c4-m1",
                role: "user",
                text: "ล็อกอินเข้าระบบไม่ได้เลยครับ ขึ้น error ตลอด",
                createdAt: "2026-08-05T14:05:00+07:00",
            },
            {
                id: "c4-m2",
                role: "assistant",
                text: "ขออภัยในความไม่สะดวกครับ รบกวนลองล้าง cache แล้วเข้าใหม่อีกครั้งได้ไหมครับ",
                createdAt: "2026-08-05T14:10:00+07:00",
            },
            {
                id: "c4-m3",
                role: "user",
                text: "ลองแล้วยังไม่ได้เหมือนเดิมครับ",
                createdAt: "2026-08-05T14:14:00+07:00",
            },
            {
                id: "c4-m4",
                role: "assistant",
                text: "ทีมงานรีเซ็ตเซสชันให้แล้วครับ รบกวนลองอีกครั้งได้เลยครับ",
                createdAt: "2026-08-05T14:19:00+07:00",
            },
            {
                id: "c4-m5",
                role: "user",
                text: "ระบบแจ้งเตือนใช้งานได้ปกติแล้วครับ ขอบคุณทีมงาน",
                createdAt: "2026-08-05T14:22:00+07:00",
            },
        ],
    },
];