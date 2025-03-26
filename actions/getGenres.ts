"use server";

export type Genre = {
  id: number;
  name: string;
};

export async function getMovieGenres(): Promise<Genre[]> {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movie genres");
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
}

export async function getTVGenres(): Promise<Genre[]> {
  const url = "https://api.themoviedb.org/3/genre/tv/list?language=en";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch TV genres");
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
}
