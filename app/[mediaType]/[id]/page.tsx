import { notFound } from "next/navigation";
import { MediaDetails } from "@/components/MediaDetails";
import { getMediaDetails } from "@/app/actions/getMediaDetails";
import { Metadata } from "next";

type MediaType = "movies" | "series" | "tv-shows" | "actors";

type Params = {
  mediaType: MediaType;
  id: string;
};

type Props = {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const media = await getMediaDetails(
    resolvedParams.mediaType,
    resolvedParams.id,
  );

  if (!media) {
    return {
      title: "Not Found",
      description: "The requested content could not be found.",
    };
  }

  const title = "title" in media ? media.title : media.name;
  const description = media.overview || media.biography || "";

  return {
    title: `${title} | Mooovie`,
    description,
  };
}

export default async function MediaPage({ params }: Props) {
  const resolvedParams = await params;
  const media = await getMediaDetails(
    resolvedParams.mediaType,
    resolvedParams.id,
  );

  if (!media) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <MediaDetails media={media} />
    </main>
  );
}
