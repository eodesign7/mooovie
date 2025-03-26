"use client";

import { useEffect, useState, useMemo } from "react";
import { MediaGrid } from "@/components/MediaGrid";
import { FilterBar } from "@/components/FilterBar";
import { SortOptions } from "@/components/SortOptions";
import getMovies from "@/actions/getMovies";
import getTVShows from "@/actions/getTVShows";
import getPeople from "@/actions/getPeople";
import getFilteredMovies from "@/actions/getFilteredMovies";
import getFilteredTVShows from "@/actions/getFilteredTVShows";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type FilterState = {
  year?: string;
  genres?: number[];
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
  }, [mediaType, currentPage, filters]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortBy === "popularity") {
        const aPopularity =
          "popularity" in a ? (a as Movie).popularity || 0 : 0;
        const bPopularity =
          "popularity" in b ? (b as Movie).popularity || 0 : 0;
        return bPopularity - aPopularity;
      }
      if (sortBy === "rating") {
        const aRating =
          "vote_average" in a ? (a as Movie | TVShow).vote_average || 0 : 0;
        const bRating =
          "vote_average" in b ? (b as Movie | TVShow).vote_average || 0 : 0;
        return bRating - aRating;
      }
      if (sortBy === "release_date") {
        const aDate =
          "release_date" in a
            ? (a as Movie).release_date || ""
            : "first_air_date" in a
              ? (a as TVShow).first_air_date || ""
              : "";
        const bDate =
          "release_date" in b
            ? (b as Movie).release_date || ""
            : "first_air_date" in b
              ? (b as TVShow).first_air_date || ""
              : "";
        return aDate && bDate
          ? new Date(bDate).getTime() - new Date(aDate).getTime()
          : 0;
      }
      if (sortBy === "title") {
        const aTitle =
          "title" in a
            ? (a as Movie).title
            : "name" in a
              ? (a as TVShow | Person).name
              : "";
        const bTitle =
          "title" in b
            ? (b as Movie).title
            : "name" in b
              ? (b as TVShow | Person).name
              : "";
        return aTitle.localeCompare(bTitle);
      }
      if (sortBy === "name") {
        const aName = "name" in a ? (a as Person).name : "";
        const bName = "name" in b ? (b as Person).name : "";
        return aName.localeCompare(bName);
      }
      return 0;
    });
  }, [items, sortBy]);

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

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <FilterBar
              mediaType={mediaType}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
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
            <MediaGrid items={sortedItems} mediaType={mediaType} />
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent className="flex justify-center gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* First Page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Show ellipsis if current page is > 3 */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Pages before current */}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Current Page */}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>
                )}

                {/* Pages after current */}
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Show ellipsis if there are more pages */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Last Page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
