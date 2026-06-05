"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getCategoryByKey } from "@/data/categories";
import type { Experience } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { useAgent } from "@/context/AgentContext";

export function ExperienceDetail({ experience }: { experience: Experience }) {
  const category = getCategoryByKey(experience.category);
  const { openAgent } = useAgent();
  const [notesOpen, setNotesOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <article className="pb-24 lg:pb-12">
      <section className="relative h-[50vh] min-h-[320px] lg:h-[60vh]">
        <Image
          src={experience.coverImage}
          alt={experience.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-12">
          <div className="page-container">
            {category && (
              <Tag color={category.color} variant="solid">
                {category.name}
              </Tag>
            )}
            <h1 className="mt-3 text-3xl font-semibold lg:text-4xl">
              {experience.name}
            </h1>
            <p className="mt-2 flex flex-wrap gap-4 text-sm text-white/85">
              <span>{experience.duration}</span>
              <span>{experience.priceText}</span>
              <span>📍 {experience.location}</span>
            </p>
          </div>
        </div>
      </section>

      <FadeIn className="section-padding py-10">
        <div className="page-container">
          <div className="border-l-4 border-vital bg-white p-6 rounded-r-xl shadow-card">
            <p className="text-secondary leading-relaxed text-[15px]">
              {experience.stateResponse}
            </p>
            {experience.statePush && (
              <p className="mt-3 text-secondary font-medium">
                {experience.statePush}
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-8 bg-white" delay={0.1}>
        <div className="page-container">
          <h2 className="text-2xl font-semibold text-secondary mb-8">
            体验节奏
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { key: "松", text: experience.rhythm.relax },
              { key: "深", text: experience.rhythm.deep },
              { key: "融", text: experience.rhythm.merge },
            ].map((r) => (
              <div
                key={r.key}
                className="rounded-xl bg-bg-light p-6 text-center"
              >
                <span className="text-2xl">🫧</span>
                <p className="mt-2">
                  <span className="text-xl font-light text-vital">{r.key}</span>
                  <span className="text-text-muted text-sm mx-2">→</span>
                </p>
                <p className="mt-4 text-sm text-text-main">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-10" delay={0.15}>
        <div className="page-container">
          <h2 className="text-2xl font-semibold text-secondary mb-8">
            体验内容
          </h2>
          <div className="space-y-0 border-l-2 border-divider ml-3">
            {experience.schedule.map((item, i) => (
              <div key={i} className="relative pl-8 pb-8">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-vital" />
                <p className="text-sm text-vital font-medium">{item.time}</p>
                <p className="font-medium text-secondary">{item.title}</p>
                <p className="text-sm text-text-muted mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-10 bg-white" delay={0.2}>
        <div className="page-container flex gap-6 items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image
              src={experience.guide.avatar}
              alt={experience.guide.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary">
              同行者 · {experience.guide.name}
            </h2>
            <p className="mt-2 text-text-muted leading-relaxed">
              {experience.guide.bio}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-10" delay={0.25}>
        <div className="page-container grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              实用信息
            </h2>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>📍 {experience.location}</li>
              <li>⏱ {experience.duration}</li>
              <li>👥 最多 {experience.maxPeople} 人</li>
              {experience.suitableFor && (
                <li className="text-text-main">{experience.suitableFor}</li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              费用说明
            </h2>
            <p className="text-2xl font-semibold text-vital mb-4">
              {experience.priceText}
            </p>
            <p className="text-sm font-medium text-secondary">费用包含</p>
            <ul className="mt-1 text-sm text-text-muted list-disc pl-5">
              {experience.includeList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="text-sm font-medium text-secondary mt-4">不含</p>
            <ul className="mt-1 text-sm text-text-muted list-disc pl-5">
              {experience.excludeList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-muted">
              {experience.refundPolicy}
            </p>
          </div>
        </div>
      </FadeIn>

      <section className="section-padding">
        <div className="page-container">
          <button
            type="button"
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-divider bg-white px-4 py-3 text-left"
          >
            <span className="font-medium text-secondary">行前须知</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${notesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {notesOpen && (
            <p className="mt-3 text-sm text-text-muted px-2">
              {experience.notes}
            </p>
          )}
        </div>
      </section>

      <div className="fixed bottom-14 left-0 right-0 border-t border-divider bg-white/95 p-4 backdrop-blur-sm lg:static lg:border-0 lg:bg-transparent lg:mt-8">
        <div className="page-container">
          <Button className="w-full lg:w-auto" size="lg" onClick={() => setBookingOpen(true)}>
            我想试试
          </Button>
        </div>
      </div>

      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 lg:rounded-2xl">
            <h3 className="text-lg font-semibold text-secondary">咨询报名</h3>
            <p className="mt-2 text-sm text-text-muted">
              MVP 阶段和小走聊聊就行——说清楚你的状态，比填表有用。
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setBookingOpen(false)}>
                先不了
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setBookingOpen(false);
                  openAgent();
                }}
              >
                找小走
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
