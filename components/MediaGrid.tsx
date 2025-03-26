"use client";

import { MovieCard } from "@/components/movies/MovieCard";
import { PersonCard } from "@/components/PersonCard";

interface MediaGridProps {
  items: (Movie | TVShow | Person)[];
  mediaType: "movies" | "series" | "tv-shows" | "actors";
}

export function MediaGrid({ items, mediaType }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => {
        if (mediaType === "actors") {
          return <PersonCard key={item.id} person={item as Person} />;
        }
        return <MovieCard key={item.id} movie={item as Movie | TVShow} />;
      })}
    </div>
  );
}
