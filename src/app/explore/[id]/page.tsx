import { notFound } from "next/navigation";
import { experiences, getExperienceById } from "@/data/experiences";
import { ExperienceDetail } from "@/components/detail/ExperienceDetail";

export function generateStaticParams() {
  return experiences.map((e) => ({ id: e.id }));
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = getExperienceById(id);
  if (!experience) notFound();
  return <ExperienceDetail experience={experience} />;
}
