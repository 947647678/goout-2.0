"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

const tiers = [
  {
    name: "路人",
    price: "免费",
    relation: "偶遇",
    style: "border border-divider bg-white text-secondary",
    tagStyle: { backgroundColor: "#8C8C8C22", color: "#8C8C8C" },
    rows: [
      "当下聊聊，下次见面还是陌生人",
      "无长期记忆（不是冷漠，是还不熟）",
      "即时引导",
    ],
  },
  {
    name: "常客",
    price: "¥39/月",
    relation: "相识",
    style: "bg-base text-white shadow-card-hover ring-2 ring-vital",
    tagStyle: { backgroundColor: "#E07A5F", color: "#fff" },
    highlight: true,
    rows: ["记住你，越聊越懂你", "长期记忆 + 状态库", "为你进化"],
  },
  {
    name: "私密客人",
    price: "1对1",
    relation: "托付",
    style: "bg-white shadow-card ring-2 ring-breath",
    tagStyle: { backgroundColor: "#81B29A", color: "#fff" },
    icon: true,
    rows: ["你的事它真上心", "全部 + 深度数据", "人机协作"],
  },
];

const history = [
  { date: "2026-05-20", name: "关机半天•森林深呼吸", tag: "放空•定力" },
  { date: "2026-04-12", name: "别想太多•即兴舞一场", tag: "舒展•鲜活" },
];

export default function ProfilePage() {
  return (
    <div className="pt-16 lg:pt-20 pb-20">
      <div className="section-padding py-8 bg-bg-light border-b border-divider">
        <div className="page-container">
          <h1 className="text-3xl font-semibold text-secondary">我的</h1>
          <p className="mt-2 text-text-muted">
            先留个脚步，下次来就认识你了
          </p>
        </div>
      </div>

      <FadeIn className="section-padding page-container py-8">
        <div className="rounded-xl bg-white shadow-card p-6 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              alt="用户头像"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-secondary">焕活旅人</h2>
            <Tag color="#E07A5F" variant="solid" className="mt-2">
              常客
            </Tag>
            <p className="mt-2 text-xs text-text-muted">会员至 2026-12-31</p>
          </div>
          <Button variant="outline" size="sm" title="混熟了，我才能更懂你">
            混熟了，更懂你
          </Button>
        </div>
      </FadeIn>

      <FadeIn className="section-padding page-container py-6" delay={0.1}>
        <h2 className="text-xl font-semibold text-secondary mb-6">会员权益</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-xl p-6 ${t.style}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{t.name}</h3>
                {t.icon && (
                  <Sparkles className="h-4 w-4 text-breath" aria-hidden />
                )}
              </div>
              <p
                className={`mt-1 text-xs uppercase tracking-wide opacity-75 ${
                  t.highlight ? "text-white/80" : "text-text-muted"
                }`}
              >
                {t.relation}
              </p>
              <p
                className={`mt-3 text-2xl font-light ${
                  t.highlight ? "text-vital" : "text-vital"
                }`}
              >
                {t.price}
              </p>
              <ul
                className={`mt-4 space-y-2 text-sm ${
                  t.highlight ? "text-white/90" : "text-text-muted"
                }`}
              >
                {t.rows.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="section-padding page-container py-6" delay={0.15}>
        <h2 className="text-xl font-semibold text-secondary mb-4">焕活档案</h2>
        <div className="rounded-xl bg-white shadow-card p-6">
          <p className="text-sm text-text-muted mb-4">状态变化（模拟）</p>
          <div className="h-32 flex items-end justify-between gap-2 px-2">
            {[3, 4, 5, 6, 7, 8].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-vital/35"
                style={{ height: `${v * 10}%` }}
              />
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-secondary">体验历史</p>
          <ul className="mt-3 space-y-3">
            {history.map((h) => (
              <li
                key={h.date}
                className="flex flex-wrap justify-between gap-2 text-sm border-b border-divider pb-2"
              >
                <span>
                  {h.date} · {h.name}
                </span>
                <Tag>{h.tag}</Tag>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 text-sm text-vital hover:underline"
          >
            焕活日记（即将上线）
          </button>
        </div>
      </FadeIn>

      <FadeIn className="section-padding page-container py-6" delay={0.2}>
        <div className="rounded-xl bg-white shadow-card divide-y divide-divider">
          {["个人信息", "通知偏好", "关于我们", "退出登录"].map((item) => (
            <button
              key={item}
              type="button"
              className="w-full px-6 py-4 text-left text-secondary hover:bg-bg-light transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
