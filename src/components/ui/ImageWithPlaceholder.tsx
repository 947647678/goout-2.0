"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  aspectRatio?: "3/2" | "16/9" | "1/1";
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

const ratioClass = {
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
};

export function ImageWithPlaceholder({
  src,
  alt,
  aspectRatio = "3/2",
  className,
  priority,
}: ImageWithPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-divider",
        ratioClass[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
      />
    </div>
  );
}
