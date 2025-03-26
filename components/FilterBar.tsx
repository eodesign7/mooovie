"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  mediaType: "movies" | "series" | "tv-shows" | "actors";
  onFilterChange: (filters: {
    year?: string;
    genres?: string[];
    rating?: number;
  }) => void;
  currentFilters: { year?: string; genres?: string[]; rating?: number };
}

export function FilterBar({
  mediaType,
  onFilterChange,
  currentFilters,
}: FilterBarProps) {
  const [yearRange, setYearRange] = useState({
    min: currentFilters.year || "",
    max: currentFilters.year || "",
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    currentFilters.genres || [],
  );
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    currentFilters.rating,
  );

  const genreOptions = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  useEffect(() => {
    const newFilters = {
      year:
        yearRange.min || yearRange.max
          ? yearRange.min || yearRange.max
          : undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      rating: selectedRating,
    };
    onFilterChange(newFilters);
  }, [yearRange, selectedGenres, selectedRating, onFilterChange]);

  const handleReset = () => {
    setYearRange({ min: "", max: "" });
    setSelectedGenres([]);
    setSelectedRating(undefined);
  };

  const handleGenreChange = (genre: string, checked: boolean) => {
    setSelectedGenres((prev) =>
      checked ? [...prev, genre] : prev.filter((g) => g !== genre),
    );
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    setSelectedRating(checked ? rating : undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {mediaType !== "actors" && (
          <AccordionItem value="year">
            <AccordionTrigger>Year</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="From"
                  value={yearRange.min}
                  onChange={(e) =>
                    setYearRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={yearRange.max}
                  onChange={(e) =>
                    setYearRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {mediaType !== "actors" && (
          <AccordionItem value="genres">
            <AccordionTrigger>Genres</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {genreOptions.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={(checked) =>
                        handleGenreChange(genre, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={genre}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[9, 8, 7, 6, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === rating}
                    onCheckedChange={(checked) =>
                      handleRatingChange(rating, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {rating}+ Stars
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
