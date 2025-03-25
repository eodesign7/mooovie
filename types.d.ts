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
  poster_path: string;
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
