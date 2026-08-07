import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import App from "./app";

const notoSanThai = Noto_Sans_Thai({
    variable: "--font-noto-sans-thai",
    subsets: ["thai"],
    display: "swap",
})

export const metadata: Metadata = {
    title: "LINE OA Live chat",
    description: "ระบบ live chat บนหน้าเว็บสู่ Line Official Account",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${notoSanThai.variable}  h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <App>{children}</App>
            </body>
        </html>
    );
}
