import { Metadata } from "next";

type MediaType = "movies" | "series" | "tv-shows" | "actors";

interface PageProps {
  params: {
    mediaType: MediaType;
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMediaMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { mediaType } = params;
  const title = `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1).replace("-", " ")} | Mooovie`;

  return {
    title,
    description: `Browse ${mediaType} on Mooovie`,
  };
}
