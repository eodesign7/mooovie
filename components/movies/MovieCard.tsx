"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

export default function MovieCard({ movie, className }: MovieCardProps) {
  if (!movie) {
    return null; // alebo nejaký fallback komponent
  }

  // Získame rok z release_date - pridáme null check
  const year = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  // Skrátime overview na max 100 znakov - pridáme null check
  const shortOverview = movie?.overview
    ? movie.overview.length > 100
      ? movie.overview.substring(0, 100) + "..."
      : movie.overview
    : "";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={`block w-full ${className ?? ""}`}
    >
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:ring-2 group-hover:ring-white/20">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.svg"
            }
            alt={movie.title || "Movie poster"}
            fill
            className="object-cover"
            sizes="200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
              {/* Rating a rok */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                </div>
                {year && (
                  <Badge variant="outline" className="border-white/20">
                    {year}
                  </Badge>
                )}
              </div>

              {/* Krátky popis */}
              {shortOverview && (
                <p className="text-sm text-white/90 line-clamp-3">
                  {shortOverview}
                </p>
              )}

              {/* Žánre */}
              <div className="flex flex-wrap gap-1 mt-auto">
                {movie.genres &&
                  movie.genres.length > 0 &&
                  movie.genres.slice(0, 3).map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                {movie.adult && (
                  <Badge variant="destructive" className="ml-auto">
                    18+
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Rating badge v pravom hornom rohu */}
          {movie.vote_average && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        {/* Názov filmu pod posterom */}
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium truncate group-hover:text-white">
            {movie.title}
          </h3>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="text-xs text-white/50 truncate">
              {movie.original_title}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
