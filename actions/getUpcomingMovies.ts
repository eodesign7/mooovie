"use server";

import getMovieTrailer from "./getMovieTrailer";

export default async function getUpcomingMovies() {
  const url = "https://api.themoviedb.org/3/movie/upcoming?language=en-US";
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

    // Pre každý film získame aj trailer
    const moviesWithTrailers = await Promise.all(
      data.results.map(async (movie: Movie) => {
        const trailer = await getMovieTrailer(movie.id);
        return {
          ...movie,
          trailer,
        };
      }),
    );

    return moviesWithTrailers;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return null;
  }
}
