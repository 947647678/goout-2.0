"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_SLOGANS } from "@/lib/constants";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "日常充电站" },
  { href: "/destination", label: "深度目的地" },
  { href: "/profile", label: "我的" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [sloganHover, setSloganHover] = useState(false);

  const defaultSlogan = useMemo(
    () => NAV_SLOGANS[Math.floor(Math.random() * NAV_SLOGANS.length)],
    []
  );
  const hoverSlogan = useMemo(() => {
    const others = NAV_SLOGANS.filter((s) => s !== defaultSlogan);
    return others[Math.floor(Math.random() * others.length)] ?? "你值得松一下";
  }, [defaultSlogan]);

  useEffect(() => {
    const onScroll = () => setScrolled(!isHome || window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 hidden h-16 transition-all duration-300 lg:block",
        solid ? "bg-white/95 shadow-card backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="page-container flex h-full items-center justify-between px-8">
        <Link
          href="/"
          className="flex items-baseline gap-3"
          onMouseEnter={() => setSloganHover(true)}
          onMouseLeave={() => setSloganHover(false)}
        >
          <span
            className={cn(
              "text-xl font-semibold tracking-wide transition-colors",
              solid ? "text-base" : "text-white"
            )}
          >
            出去走走
          </span>
          <span
            className={cn(
              "text-xs font-light transition-opacity duration-300",
              solid ? "text-text-muted" : "text-white/70",
              sloganHover ? "opacity-100" : "opacity-80"
            )}
          >
            {sloganHover ? hoverSlogan : defaultSlogan}
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[15px] transition-colors hover:text-vital",
                  active
                    ? "text-vital font-medium"
                    : solid
                      ? "text-secondary"
                      : "text-white/90"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
