"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMovieGenres, getTVGenres, type Genre } from "@/actions/getGenres";
import { RotateCcw } from "lucide-react";

interface FilterBarProps {
  mediaType: "movies" | "series" | "tv-shows" | "actors";
  onFilterChange: (filters: {
    year?: string;
    genres?: number[];
    rating?: number;
  }) => void;
  currentFilters: { year?: string; genres?: number[]; rating?: number };
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
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    currentFilters.genres || [],
  );
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    currentFilters.rating,
  );
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const genreList =
        mediaType === "movies" ? await getMovieGenres() : await getTVGenres();
      setGenres(genreList);
    }

    if (mediaType !== "actors") {
      fetchGenres();
    }
  }, [mediaType]);

  const handleReset = () => {
    setYearRange({ min: "", max: "" });
    setSelectedGenres([]);
    setSelectedRating(undefined);
    onFilterChange({});
  };

  const handleGenreChange = (value: string) => {
    const genreId = parseInt(value);
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((g) => g !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(newGenres);
    onFilterChange({
      ...currentFilters,
      genres: newGenres.length > 0 ? newGenres : undefined,
    });
  };

  const handleRatingChange = (value: string) => {
    const rating = parseInt(value);
    setSelectedRating(rating);
    onFilterChange({
      ...currentFilters,
      rating,
    });
  };

  const handleYearChange = (type: "min" | "max", value: string) => {
    const newYearRange = { ...yearRange, [type]: value };
    setYearRange(newYearRange);
    onFilterChange({
      ...currentFilters,
      year:
        newYearRange.min || newYearRange.max
          ? newYearRange.min || newYearRange.max
          : undefined,
    });
  };

  if (mediaType === "actors") return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Year from"
          className="w-24"
          value={yearRange.min}
          onChange={(e) => handleYearChange("min", e.target.value)}
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          placeholder="Year to"
          className="w-24"
          value={yearRange.max}
          onChange={(e) => handleYearChange("max", e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[120px]">
            Genres ({selectedGenres.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-2 grid gap-1">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={
                  selectedGenres.includes(genre.id) ? "secondary" : "ghost"
                }
                className="w-full justify-start font-normal"
                onClick={() => handleGenreChange(genre.id.toString())}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Select
        value={selectedRating?.toString()}
        onValueChange={handleRatingChange}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          {[9, 8, 7, 6, 5].map((rating) => (
            <SelectItem key={rating} value={rating.toString()}>
              {rating}+ Stars
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className="ml-2"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
