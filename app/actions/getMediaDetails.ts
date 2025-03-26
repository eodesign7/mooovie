export async function getMediaDetails(type: string, id: string) {
  const mediaType =
    type === "movies" ? "movie" : type === "actors" ? "person" : "tv";

  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?append_to_response=videos,credits`;
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
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}
