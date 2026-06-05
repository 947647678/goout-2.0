"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getDirectionByKey } from "@/data/categories";
import type { Destination } from "@/types";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { Tag } from "@/components/ui/Tag";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

export function RouteCard({ destination }: { destination: Destination }) {
  const direction = getDirectionByKey(destination.direction);

  return (
    <motion.div whileHover={{ y: -4 }} transition={spring}>
      <Link
        href={`/destination/${destination.id}`}
        className="group block overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
      >
        <div className="relative overflow-hidden">
          <div className="transition-transform duration-300 group-hover:scale-[1.03]">
            <ImageWithPlaceholder
              src={destination.coverImage}
              alt={destination.name}
              aspectRatio="3/2"
            />
          </div>
          <div className="absolute left-3 top-3">
            {direction && (
              <Tag color="#7B6B5D" variant="solid">
                {direction.name}
              </Tag>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
            {destination.days}天{destination.nights}晚
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-secondary">
            {destination.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-muted">
            {destination.subtitle}
          </p>
          <p className="mt-3 font-medium text-vital">{destination.priceText}</p>
        </div>
      </Link>
    </motion.div>
  );
}
