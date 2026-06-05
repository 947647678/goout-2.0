import { notFound } from "next/navigation";
import { destinations, getDestinationById } from "@/data/destinations";
import { DestinationDetail } from "@/components/detail/DestinationDetail";

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = getDestinationById(id);
  if (!destination) notFound();
  return <DestinationDetail destination={destination} />;
}
