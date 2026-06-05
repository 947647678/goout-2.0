import type { Metadata } from "next";
import { AgentProvider } from "@/context/AgentContext";
import { Navbar } from "@/components/layout/Navbar";
import { BottomTab } from "@/components/layout/BottomTab";
import { AgentFloat } from "@/components/agent/AgentFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: "出去走走 — 鲜活不止于年轻 | 焕活体验平台",
  description:
    "不问你去哪，先问你最近怎么了。城市焕活体验、短途在地文化、长途深度目的地，按你的状态匹配，帮你活过来。",
  keywords:
    "焕活体验,减压充电,城市活动,深度旅行,中年焕新,出去走走,鲜活不止于年轻",
  openGraph: {
    title: "出去走走 — 鲜活不止于年轻",
    description: "扛了这么久，你值得松一下",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AgentProvider>
          <Navbar />
          <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
          <BottomTab />
          <AgentFloat />
        </AgentProvider>
      </body>
    </html>
  );
}
