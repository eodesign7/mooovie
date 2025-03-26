"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie | TVShow;
}

export function MovieCard({ movie }: MovieCardProps) {
  const isMovie = "title" in movie;
  const title = isMovie ? movie.title : movie.name;
  const releaseDate = isMovie ? movie.release_date : movie.first_air_date;
  const rating = movie.vote_average?.toFixed(1);
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const isUpcoming =
    releaseDate && new Date(releaseDate) > new Date() ? true : false;

  return (
    <Link
      href={`/${isMovie ? "movies" : "tv-shows"}/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:scale-105"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {isUpcoming && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-black/50 backdrop-blur-sm"
          >
            Upcoming
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{title}</h3>

        <div className="mt-auto flex items-center justify-between">
          {releaseYear && (
            <span className="text-sm text-muted-foreground">{releaseYear}</span>
          )}
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
