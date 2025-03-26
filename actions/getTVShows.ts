"use server";

export default async function getTVShows(page = 1) {
  const url = `https://api.themoviedb.org/3/discover/tv?language=en-US&page=${page}&sort_by=popularity.desc`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as TMDBResponse<TVShow>;
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return null;
  }
}
