"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getDirectionByKey } from "@/data/categories";
import type { Destination } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { useAgent } from "@/context/AgentContext";

export function DestinationDetail({
  destination,
}: {
  destination: Destination;
}) {
  const direction = getDirectionByKey(destination.direction);
  const { openAgent } = useAgent();
  const [notesOpen, setNotesOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <article className="pb-24 lg:pb-12">
      <section className="relative h-[50vh] min-h-[320px] lg:h-[60vh]">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-12">
          <div className="page-container">
            {direction && (
              <Tag color="#7B6B5D" variant="solid">
                {direction.name}
              </Tag>
            )}
            <h1 className="mt-3 text-3xl font-semibold lg:text-4xl">
              {destination.name}
            </h1>
            <p className="mt-2 flex flex-wrap gap-4 text-sm text-white/85">
              <span>
                {destination.days}天{destination.nights}晚
              </span>
              <span>{destination.priceText}</span>
              <span>📍 {destination.location}</span>
            </p>
          </div>
        </div>
      </section>

      <FadeIn className="section-padding py-10">
        <div className="page-container">
          <div className="border-l-4 border-vital bg-white p-6 rounded-r-xl shadow-card">
            <p className="text-secondary leading-relaxed">
              {destination.stateResponse}
            </p>
            {destination.statePush && (
              <p className="mt-3 font-medium text-secondary">
                {destination.statePush}
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-10 bg-white" delay={0.1}>
        <div className="page-container">
          <h2 className="text-2xl font-semibold text-secondary mb-8">
            行程安排
          </h2>
          <div className="space-y-8">
            {destination.itinerary.map((day) => (
              <div
                key={day.day}
                className="rounded-xl border border-divider p-6 hover:shadow-card transition-shadow"
              >
                <h3 className="text-lg font-semibold text-secondary">
                  {day.title}
                </h3>
                <p className="mt-3 text-text-muted leading-relaxed">
                  {day.description}
                </p>
                {day.accommodation && (
                  <p className="mt-3 text-sm text-breath font-medium">
                    🏨 {day.accommodation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="section-padding py-10" delay={0.15}>
        <div className="page-container grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              费用说明
            </h2>
            <p className="text-2xl font-semibold text-vital mb-4">
              {destination.priceText}
            </p>
            <p className="text-sm font-medium text-secondary">费用包含</p>
            <ul className="mt-1 text-sm text-text-muted list-disc pl-5">
              {destination.includeList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="text-sm font-medium text-secondary mt-4">不含</p>
            <ul className="mt-1 text-sm text-text-muted list-disc pl-5">
              {destination.excludeList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 items-start">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image
                src={destination.guide.avatar}
                alt={destination.guide.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-secondary">
                同行者 · {destination.guide.name}
              </h2>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {destination.guide.bio}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <section className="section-padding">
        <div className="page-container">
          <button
            type="button"
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-divider bg-white px-4 py-3"
          >
            <span className="font-medium text-secondary">行前须知</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${notesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {notesOpen && (
            <p className="mt-3 text-sm text-text-muted">{destination.notes}</p>
          )}
        </div>
      </section>

      <div className="fixed bottom-14 left-0 right-0 border-t border-divider bg-white/95 p-4 backdrop-blur-sm lg:static lg:border-0 lg:mt-8">
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
              不确定往哪走？和小走聊聊——比填表有用。
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
