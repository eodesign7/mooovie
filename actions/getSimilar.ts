"use server";

export async function getSimilar(mediaType: "movie" | "tv", id: string) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}/similar?language=en-US&page=1`;

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
    return data.results as (Movie | TVShow)[];
  } catch (error) {
    console.error(`Error fetching similar ${mediaType}:`, error);
    return [];
  }
}
