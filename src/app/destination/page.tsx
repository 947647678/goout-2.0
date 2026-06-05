"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { directions } from "@/data/categories";
import { destinations } from "@/data/destinations";
import { RouteCard } from "@/components/destination/RouteCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { useAgent } from "@/context/AgentContext";
import { cn } from "@/lib/utils";

function DestinationContent() {
  const searchParams = useSearchParams();
  const directionParam = searchParams.get("direction");
  const { openAgent } = useAgent();

  const filtered = useMemo(() => {
    if (!directionParam) return destinations;
    return destinations.filter((d) => d.direction === directionParam);
  }, [directionParam]);

  const activeDirection = directions.find((d) => d.key === directionParam);

  return (
    <div className="pt-16 lg:pt-20">
      <div className="section-padding py-8 bg-bg-light border-b border-divider">
        <div className="page-container">
          <h1 className="text-3xl font-semibold text-secondary">深度目的地</h1>
          <p className="mt-2 text-text-muted">走远一点，把节奏找回来</p>
        </div>
      </div>

      <FadeIn className="section-padding page-container py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {directions.map((d) => {
            const dest = destinations.find((x) => x.direction === d.key);
            const active = directionParam === d.key;
            return (
              <Link
                key={d.key}
                href={`/destination?direction=${d.key}`}
                className={cn(
                  "group relative aspect-[16/9] overflow-hidden rounded-xl ring-2 transition-all",
                  active ? "ring-vital" : "ring-transparent hover:ring-vital/40"
                )}
              >
                {dest && (
                  <Image
                    src={dest.coverImage}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{d.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn className="section-padding page-container pb-20">
        {activeDirection && (
          <h2 className="text-xl font-semibold text-secondary mb-6">
            {activeDirection.name}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((d) => (
            <RouteCard key={d.id} destination={d} />
          ))}
        </div>
        <p className="mt-12 text-center text-text-muted">
          不确定往哪走？{" "}
          <button
            type="button"
            onClick={openAgent}
            className="text-vital font-medium hover:underline"
          >
            和小走聊聊
          </button>
        </p>
      </FadeIn>
    </div>
  );
}

export default function DestinationPage() {
  return (
    <Suspense fallback={<div className="pt-20 p-8 text-center">加载中...</div>}>
      <DestinationContent />
    </Suspense>
  );
}
