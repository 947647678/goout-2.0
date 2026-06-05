"use client";

import { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/explore/ExperienceCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { useAgent } from "@/context/AgentContext";
import { cn } from "@/lib/utils";

const cities = ["全部", "上海", "杭州", "湖州"];
const timeFilters = ["不限", "本周", "本月"];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "recharge";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [city, setCity] = useState("全部");
  const [time, setTime] = useState("不限");
  const [filterOpen, setFilterOpen] = useState(false);
  const { openAgent } = useAgent();

  const filtered = useMemo(() => {
    let list = experiences.filter((e) => e.category === activeCategory);
    if (city !== "全部") {
      list = list.filter((e) => e.city === city);
    }
    return list;
  }, [activeCategory, city]);

  const activeCatConfig = categories.find((c) => c.key === activeCategory);

  return (
    <div className="pt-16 lg:pt-20">
      <div className="section-padding py-8 bg-bg-light border-b border-divider">
        <div className="page-container">
          <h1 className="text-3xl font-semibold text-secondary">日常充电站</h1>
          <p className="mt-2 text-text-muted">
            不问你去哪，先问你最近怎么了
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white border-b border-divider lg:top-16">
        <div className="page-container section-padding overflow-x-auto">
          <div className="flex gap-4 min-w-max py-3">
            {categories.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    "shrink-0 pb-2 text-sm transition-colors border-b-2",
                    active
                      ? "border-vital text-vital font-medium"
                      : "border-transparent text-text-muted hover:text-secondary"
                  )}
                >
                  <motion.span
                    key={active ? "on" : "off"}
                    animate={active ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="inline-block"
                  >
                    {cat.icon} {cat.name}
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeCatConfig && (
        <p className="section-padding page-container py-4 text-sm text-text-muted italic">
          {activeCatConfig.tagline}
        </p>
      )}

      <div className="section-padding page-container pb-4">
        <button
          type="button"
          className="lg:hidden text-sm text-base border border-divider rounded-full px-4 py-2"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          筛选 {filterOpen ? "▲" : "▼"}
        </button>
        <div
          className={cn(
            "mt-3 flex flex-wrap gap-4",
            filterOpen ? "flex" : "hidden lg:flex"
          )}
        >
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-divider px-3 py-2 text-sm"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                城市：{c}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {timeFilters.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  time === t
                    ? "bg-vital text-white"
                    : "bg-bg-light text-text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FadeIn className="section-padding page-container pb-20">
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl bg-white shadow-card">
            <p className="text-text-muted">
              这块还在打磨中 ✨ 和小走聊聊你想要什么，说不定下次就有了
            </p>
            <button
              type="button"
              onClick={openAgent}
              className="mt-4 text-vital font-medium hover:underline"
            >
              找小走聊聊 →
            </button>
          </div>
        )}
      </FadeIn>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="pt-20 p-8 text-center">加载中...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
