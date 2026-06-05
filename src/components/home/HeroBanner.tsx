"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_QUOTES } from "@/lib/constants";

export function HeroBanner() {
  const quote = useMemo(
    () => HERO_QUOTES[Math.floor(Math.random() * HERO_QUOTES.length)],
    []
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
        alt="森林逆光中的背影"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/65" />
      <div className="relative z-10 px-6 text-center text-white">
        <h1 className="text-4xl font-semibold tracking-wide md:text-5xl lg:text-[2.75rem]">
          出去走走
        </h1>
        <p className="mt-4 text-lg text-white/90 md:text-xl font-light">
          鲜活不止于年轻
        </p>
        <motion.p
          key={quote}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 max-w-md mx-auto text-sm text-white/80 md:text-base italic"
        >
          「{quote}」
        </motion.p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-7 w-7" />
        </motion.div>
      </div>
    </section>
  );
}
