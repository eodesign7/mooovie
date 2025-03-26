"use server";

export default async function getFilteredMovies(
  page = 1,
  {
    year,
    genres,
    rating,
  }: { year?: string; genres?: number[]; rating?: number },
) {
  let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&include_adult=false`;

  if (year) {
    url += `&primary_release_year=${year}`;
  }
  if (genres?.length) {
    url += `&with_genres=${genres.join(",")}`;
  }
  if (rating) {
    url += `&vote_average.gte=${rating}`;
  }

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
    return data as TMDBResponse<Movie>;
  } catch (error) {
    console.error("Error fetching filtered movies:", error);
    return null;
  }
}
