"use client";

import { SearchResult } from "@/actions/search";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: () => void;
}

export default function SearchResults({
  results,
  onSelect,
}: SearchResultsProps) {
  const router = useRouter();

  if (results.length === 0) return null;

  const handleSelect = (mediaType: string, id: number) => {
    router.push(`/${mediaType}/${id}`);
    onSelect();
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/10 shadow-2xl overflow-hidden z-50">
      <div className="max-h-[70vh] overflow-y-auto">
        {results.slice(0, 8).map((item) => (
          <button
            key={`${item.media_type}-${item.id}`}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left"
            onClick={() => handleSelect(item.media_type, item.id)}
          >
            <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={
                  item.media_type === "person"
                    ? item.profile_path
                      ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                      : "/placeholder-person.png"
                    : item.poster_path
                      ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                      : "/placeholder.png"
                }
                alt={item.title || "Media"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="border-white/20 text-xs capitalize"
                >
                  {item.media_type}
                </Badge>
                {item.release_date && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.release_date).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
        {results.length > 8 && (
          <div className="px-4 py-3 text-sm text-center text-muted-foreground border-t border-white/5">
            Scroll down to see all {results.length} results
          </div>
        )}
      </div>
    </div>
  );
}
