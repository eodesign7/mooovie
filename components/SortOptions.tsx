"use client";

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

export function SortOptions({
  mediaType,
  onSortChange,
  currentSort,
}: SortOptionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity">Popularity</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          {mediaType !== "actors" && (
            <>
              <SelectItem value="release_date">Release Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </>
          )}
          {mediaType === "actors" && <SelectItem value="name">Name</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  );
}
