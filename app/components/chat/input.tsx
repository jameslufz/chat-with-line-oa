import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import z from "zod"
import { SendIcon } from "../icons"
import { ReactNode, useEffect } from "react"
import { UserFriends } from "@/app/api/v1/user/route"
import { sendMessage } from "@/lib/messaging-api/client"
import { useMutation } from "@tanstack/react-query"
import { SendMessageRequest } from "@/app/api/v1/message/send/route"

const InputForm: InputFormComponent = ({ user }) =>
{
    const schema = z.object({
        text: z.string().min(1, { error: "กรุณาพิมพ์ข้อความก่อนส่ง" })
    })

    type TSchema = z.infer<typeof schema>
    const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm<TSchema>({
        resolver: zodResolver(schema)
    })

    const { mutateAsync: mutateSendMessage, isPending: isSendingMessage } = useMutation<unknown, Error, SendMessageRequest>({
        mutationKey: ["sendMessage"],
        mutationFn: async ({ uid, text }) => sendMessage(uid, text)
    })

    /**
     * 
     * 
     * Request send message.
     */
    const handleSend: SubmitHandler<TSchema> = async ({ text }) =>
    {
        if(!user) {
            console.log(`Can't send cause not found user.`)
            return
        }

        const trimmed = text.trim()
        if (!trimmed) {
            return
        }

        await mutateSendMessage({
            uid: user.userId,
            text,
        })

        setValue("text", "")
    }

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) =>
    {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            handleSend({
                text: getValues("text"),
            })
        }
    }

    useEffect(() =>
    {
        setValue("text", "")
    },
    [user, setValue])

    return (
        <div className="border-t border-gray-200 px-6 py-4 dark:border-zinc-700">
            <form className="flex items-end gap-3" onSubmit={handleSubmit(handleSend)}>
                <textarea
                    {...register("text")}
                    onKeyDown={handleInputKeyDown}
                    placeholder="พิมข้อความของท่าน..."
                    className="max-h-32 flex-1 resize-none rounded-xl bg-gray-100 px-4 py-3 text-sm text-zinc-900 outline-none ring-1 ring-transparent focus:ring-[#00B900] dark:bg-zinc-700 dark:text-zinc-100 disabled:opacity-40"
                    rows={1}
                    disabled={isSendingMessage}
                />
                <button
                    type="submit"
                    // eslint-disable-next-line react-hooks/incompatible-library
                    disabled={(!watch("text") || (!!watch("text") && watch("text").trim().length === 0) || isSendingMessage)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00B900] text-white transition-colors hover:bg-[#00a200] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </form>
            {errors && errors.text && errors.text.message && <p className="text-red-500 leading-loose">{errors.text.message}</p>}
        </div>
    )
}

export default InputForm

export interface InputFormProps
{
    user: UserFriends | null
}
export type InputFormComponent = (props: InputFormProps) => ReactNode