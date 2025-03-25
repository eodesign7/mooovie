export default async function getMovieTrailer(movieId: number) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
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

    // Hľadáme oficiálny trailer
    const trailer = data.results.find(
      (video: {
        type: string;
        site: string;
        official: boolean;
      }) =>
        video.type === "Trailer" &&
        video.site === "YouTube" &&
        video.official === true,
    );

    if (!trailer) return null;

    return {
      id: trailer.id,
      key: trailer.key, // YouTube video ID
      name: trailer.name,
      site: trailer.site, // väčšinou "YouTube"
      type: trailer.type,
      official: trailer.official,
      published_at: trailer.published_at,
    };
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }
}
