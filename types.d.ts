type MovieTrailer = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string;
  // Základné informácie
  overview?: string;
  release_date?: string;
  runtime?: number;
  status?: string;
  tagline?: string;

  // Hodnotenia a popularita
  vote_average?: number;
  vote_count?: number;
  popularity?: number;

  // Žánre a kategórie
  genres?: Array<{
    id: number;
    name: string;
  }>;
  adult?: boolean;
  original_language?: string;
  original_title?: string;

  // Produkčné detaily
  budget?: number;
  revenue?: number;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path?: string;
    origin_country: string;
  }>;
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;

  // Dodatočné médiá
  video?: boolean;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
    }>;
  };

  // Externé ID
  imdb_id?: string;

  // Kolekcia
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path?: string;
    backdrop_path?: string;
  };

  trailer?: MovieTrailer;
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
  }>;
};

type TMDBResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};
