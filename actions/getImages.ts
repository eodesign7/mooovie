"use server";

export type MediaImage = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
};

export async function getImages(mediaType: "movie" | "tv", id: string) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}/images`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      backdrops: (data.backdrops || []) as MediaImage[],
      posters: (data.posters || []) as MediaImage[],
    };
  } catch (error) {
    console.error(`Error fetching images for ${mediaType}:`, error);
    return { backdrops: [], posters: [] };
  }
}
