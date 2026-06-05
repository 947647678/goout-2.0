"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getCategoryByKey } from "@/data/categories";
import type { Experience } from "@/types";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { Tag } from "@/components/ui/Tag";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

export function ExperienceCard({ experience }: { experience: Experience }) {
  const category = getCategoryByKey(experience.category);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={spring}
      className="h-full"
    >
      <Link
        href={`/explore/${experience.id}`}
        className="group block h-full overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
      >
        <div className="relative overflow-hidden">
          <motion.div
            className="[&>div]:transition-transform [&>div]:duration-300 group-hover:[&>div]:scale-[1.03]"
            transition={spring}
          >
            <ImageWithPlaceholder
              src={experience.coverImage}
              alt={experience.name}
              aspectRatio="3/2"
            />
          </motion.div>
          <div className="absolute left-3 top-3">
            {category && (
              <Tag color={category.color} variant="solid">
                {category.name}
              </Tag>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
            {experience.duration}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-secondary">
            {experience.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-muted">
            {experience.subtitle}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-text-muted">📍 {experience.city}</span>
            <span className="font-medium text-vital">{experience.priceText}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
