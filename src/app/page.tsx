import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FadeIn } from "@/components/ui/FadeIn";
import { ExperienceCard } from "@/components/explore/ExperienceCard";
import {
  experiences,
  featuredExperienceIds,
} from "@/data/experiences";
import { directions } from "@/data/categories";
import { destinations } from "@/data/destinations";

const team = [
  {
    role: "理性派 • 商业落地",
    desc: "把天马行空变成落地可执行",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop",
  },
  {
    role: "感性派 • 灵魂注入",
    desc: "你感受到的温度，都是她给的",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop",
  },
  {
    role: "AI派 • 执行Owner",
    desc: "随时待命，但你说了算",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop",
  },
];

export default function HomePage() {
  const featured = featuredExperienceIds
    .map((id) => experiences.find((e) => e.id === id))
    .filter(Boolean) as typeof experiences;

  return (
    <>
      <HeroBanner />

      <FadeIn className="section-padding py-20 lg:py-28 bg-bg-light">
        <div className="page-container max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-secondary">我们在做什么</h2>
          <p className="mt-6 text-text-muted leading-relaxed">
            不是告诉你去哪，而是先弄清楚你为什么想跑。城市里充电，短途里解压，长途里重生——按你的状态匹配体验，不按目的地卖货。你只需要说一句「最近有点累」，剩下的交给我们。
          </p>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-20 lg:py-28 bg-white">
        <div className="page-container">
          <h2 className="text-3xl font-semibold text-secondary text-center mb-12">
            我们是谁
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.role}
                className="flex flex-col items-center text-center rounded-xl bg-bg-light p-8"
              >
                <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full">
                  <Image src={m.avatar} alt="" fill className="object-cover" />
                </div>
                <h3 className="mt-6 font-medium text-secondary">{m.role}</h3>
                <p className="mt-3 text-sm text-text-muted italic">
                  「{m.desc}」
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-20 lg:py-28 bg-bg-light">
        <div className="page-container">
          <h2 className="text-3xl font-semibold text-secondary text-center mb-12">
            最近值得松一下的
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/explore"
              className="font-medium text-base hover:text-vital transition-colors"
            >
              更多焕活体验 →
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-20 lg:py-28 bg-bg-dark text-white">
        <div className="page-container">
          <h2 className="text-3xl font-semibold text-center mb-12">走远一点</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {directions.map((d) => {
              const dest = destinations.find((x) => x.direction === d.key);
              return (
                <Link
                  key={d.key}
                  href={`/destination?direction=${d.key}`}
                  className="group relative aspect-[16/9] overflow-hidden rounded-xl"
                >
                  {dest && (
                    <Image
                      src={dest.coverImage}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-xl font-semibold">{d.name}</h3>
                    <p className="mt-1 text-sm text-white/75">{d.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/destination"
              className="text-vital font-medium hover:underline"
            >
              探索深度目的地 →
            </Link>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
