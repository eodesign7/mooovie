export default async function getPopularMovies() {
  const url = "https://api.themoviedb.org/3/movie/popular?language=en-US";
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

    const movies = data.results;

    return movies;
  } catch (error) {
    console.error("Error fetching movie of the day:", error);
    return null;
  }
}
