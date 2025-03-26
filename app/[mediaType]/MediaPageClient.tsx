"use client";

import { useEffect, useState } from "react";
import { MediaGrid } from "@/components/MediaGrid";
import { FilterBar } from "@/components/FilterBar";
import { SortOptions } from "@/components/SortOptions";
import getMovies from "@/actions/getMovies";
import getTVShows from "@/actions/getTVShows";
import getPeople from "@/actions/getPeople";
import getFilteredMovies from "@/actions/getFilteredMovies";
import getFilteredTVShows from "@/actions/getFilteredTVShows";

type FilterState = {
  year?: string;
  genres?: string[];
  rating?: number;
};

type SortOption = "popularity" | "rating" | "release_date" | "title" | "name";

interface MediaPageClientProps {
  mediaType: "movies" | "series" | "tv-shows" | "actors";
}

export default function MediaPageClient({ mediaType }: MediaPageClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<(Movie | TVShow | Person)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<SortOption>("popularity");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let response;

        switch (mediaType) {
          case "movies":
            if (Object.keys(filters).length > 0) {
              response = await getFilteredMovies(currentPage, filters);
            } else {
              response = await getMovies(currentPage);
            }
            break;
          case "series":
          case "tv-shows":
            if (Object.keys(filters).length > 0) {
              response = await getFilteredTVShows(currentPage, filters);
            } else {
              response = await getTVShows(currentPage);
            }
            break;
          case "actors":
            response = await getPeople(currentPage);
            break;
        }

        if (response) {
          setItems(response.results);
          setTotalPages(response.total_pages);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [mediaType, currentPage, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold capitalize">
            {mediaType.replace("-", " ")}
          </h1>
        </div>

        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <FilterBar
              mediaType={mediaType}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <SortOptions
                mediaType={mediaType}
                onSortChange={handleSortChange}
                currentSort={sortBy}
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <MediaGrid items={items} mediaType={mediaType} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
