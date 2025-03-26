import { notFound } from "next/navigation";
import { use } from "react";
import MediaPageClient from "./MediaPageClient";

const validTypes = ["movies", "series", "tv-shows", "actors"] as const;
type MediaType = (typeof validTypes)[number];

export default function MediaPage({
  params,
}: {
  params: Promise<{ mediaType: string }>;
}) {
  const resolvedParams = use(params);

  // Validácia typu média
  if (!validTypes.includes(resolvedParams.mediaType as MediaType)) {
    notFound();
  }

  return <MediaPageClient mediaType={resolvedParams.mediaType as MediaType} />;
}
