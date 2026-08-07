import { UserFriends } from "@/app/api/v1/user/route"
import { LoadingIcon } from "../icons"
import { ReactNode } from "react"
import clsx from "clsx"
import Image from "next/image"

const ListUsers: ListUsersComponent = ({
    users,
    selectedChat,
    onSelectChat,
}) =>
{
    return (
        <div className="flex-1 overflow-y-auto">
            {
                users === undefined ? (
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
                            const isActive = (!!selectedChat && (user.userId === selectedChat.userId));
                            return (
                                <button
                                    key={user.userId}
                                    type="button"
                                    onClick={() => onSelectChat(user)}
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
                                            {
                                                user.lastUnreadAt && (
                                                    <span className="shrink-0 text-xs text-zinc-400">
                                                        {formatListTime(user.lastUnreadAt)}
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            {
                                                user.lastMessage && (
                                                    <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                                                        {user.markAsReadToken ? user.name : "คุณ"}: {user.lastMessage}
                                                    </span>
                                                )
                                            }
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
    )
}

export default ListUsers

const formatListTime = (iso: string): string =>
{
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
        return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
}

export interface ListUsersProps
{
    users: UserFriends[] | null | undefined
    selectedChat: UserFriends | null
    onSelectChat: (user: UserFriends) => void
}
export type ListUsersComponent = (props: ListUsersProps) => ReactNode