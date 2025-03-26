"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <Link
      href={`/actors/${person.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:scale-105"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {person.profile_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
            alt={person.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{person.name}</h3>

        <div className="mt-auto flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            {person.known_for_department}
          </Badge>

          {person.known_for && person.known_for.length > 0 && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              Known for:{" "}
              {person.known_for
                .map((work) => work.title || work.name)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
