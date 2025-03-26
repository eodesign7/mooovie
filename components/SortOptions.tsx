"use client";

import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOptionsProps {
  mediaType: "movies" | "series" | "tv-shows" | "actors";
  onSortChange: (
    sort: "popularity" | "rating" | "release_date" | "title" | "name",
  ) => void;
  currentSort: "popularity" | "rating" | "release_date" | "title" | "name";
}

const sortLabels = {
  popularity: "Popularity",
  rating: "Rating",
  release_date: "Release Date",
  title: "Title",
  name: "Name",
} as const;

function SortOptionsComponent({
  mediaType,
  onSortChange,
  currentSort,
}: SortOptionsProps) {
  const sortOptions = {
    popularity: sortLabels.popularity,
    rating: sortLabels.rating,
    ...(mediaType !== "actors" && {
      release_date: sortLabels.release_date,
      title: sortLabels.title,
    }),
    ...(mediaType === "actors" && {
      name: sortLabels.name,
    }),
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(sortOptions).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const SortOptions = memo(SortOptionsComponent);
