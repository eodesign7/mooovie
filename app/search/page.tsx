"use client";

import { search } from "@/actions/search";
import type { SearchResult } from "@/actions/search";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get("q");

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        const searchResults = await search(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    fetchResults();
  }, [query]);

  // Rozdelíme výsledky podľa typu
  const movies = results.filter((item) => item.media_type === "movie");
  const series = results.filter((item) => item.media_type === "tv");
  const people = results.filter((item) => item.media_type === "person");

  const ResultCard = ({ item }: { item: SearchResult }) => (
    <Link href={`/${item.media_type}/${item.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/10">
        <Image
          src={
            item.media_type === "person"
              ? item.profile_path
                ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                : "/placeholder-person.png"
              : item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                  : "/placeholder.png"
          }
          alt={item.title || "Media"}
          fill
          className={cn(
            "object-cover transition-transform group-hover:scale-105",
            !item.poster_path && item.backdrop_path && "object-center",
            !item.poster_path &&
              !item.backdrop_path &&
              item.media_type !== "person" &&
              "invert",
          )}
        />
        {item.vote_average && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            {item.vote_average.toFixed(1)}
          </div>
        )}
        {item.isUpcoming && (
          <Badge className="absolute top-3 left-3 bg-primary z-20">
            Upcoming
          </Badge>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-xl font-bold leading-tight truncate group-hover:text-white">
          {item.title}
        </h3>
        {item.release_date && (
          <span className="text-sm text-muted-foreground">
            {new Date(item.release_date).getFullYear()}
          </span>
        )}
        {item.known_for_department && (
          <span className="text-xs text-muted-foreground block">
            {item.known_for_department}
          </span>
        )}
      </div>
    </Link>
  );

  const ResultSection = ({
    title,
    items,
  }: {
    title: string;
    items: SearchResult[];
  }) => {
    if (items.length === 0) return null;

    return (
      <section className="mt-12 first:mt-0">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => (
            <ResultCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Search />
            <h1 className="text-xl font-normal">{query}</h1>
          </div>

          <p className="text-muted-foreground">
            {results.length} results found
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        ) : (
          <>
            <ResultSection title="Movies" items={movies} />
            <ResultSection title="TV Series" items={series} />
            <ResultSection title="People" items={people} />
          </>
        )}
      </div>
    </main>
  );
}
