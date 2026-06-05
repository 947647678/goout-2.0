"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/explore", label: "日常充电站", icon: Compass },
  { href: "/destination", label: "深度目的地", icon: Map },
  { href: "/profile", label: "我的", icon: User },
];

export function BottomTab() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-divider bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="flex h-14 items-center justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 text-[10px] transition-colors",
                active ? "text-vital" : "text-text-muted"
              )}
            >
              <motion.span
                animate={active ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              </motion.span>
              <span className="max-w-[4.5rem] truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
