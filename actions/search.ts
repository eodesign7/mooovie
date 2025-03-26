"use server";

export type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string;
  backdrop_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  known_for_department?: string;
  isUpcoming?: boolean;
};

type TMDBSearchItem = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string;
  backdrop_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  known_for_department?: string;
};

export async function search(query: string) {
  if (!query) return [];

  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
    query,
  )}&include_adult=false&language=en-US&page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    const today = new Date();

    // Transformujeme výsledky do jednotného formátu a pridáme isUpcoming flag
    const results: SearchResult[] = data.results
      .map((item: TMDBSearchItem) => {
        const releaseDate = item.release_date || item.first_air_date;
        const isUpcoming = releaseDate ? new Date(releaseDate) > today : false;

        return {
          id: item.id,
          title: item.title || item.name,
          media_type: item.media_type,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          profile_path: item.profile_path,
          release_date: releaseDate,
          vote_average: item.vote_average,
          overview: item.overview,
          known_for_department: item.known_for_department,
          isUpcoming,
        };
      })
      // Zoradíme podľa dátumu, najnovšie prvé
      .sort((a: SearchResult, b: SearchResult) => {
        if (!a.release_date) return 1;
        if (!b.release_date) return -1;
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      });

    return results;
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Failed to search");
  }
}
