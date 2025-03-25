"use client";

import YouTube from "react-youtube";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TrailerCardProps = {
  movie: Movie;
  className?: string;
};

export default function TrailerCard({ movie, className }: TrailerCardProps) {
  if (!movie.trailer) return null;

  return (
    <div className="w-[200px] flex-none">
      <div
        className={`relative aspect-video rounded-lg overflow-hidden ${className}`}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-medium mb-2">{movie.title}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`Play ${movie.title} trailer`}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] p-0 bg-black border-white/10">
                <DialogTitle className="sr-only">
                  {movie.title} Trailer
                </DialogTitle>
                <div className="aspect-video relative">
                  <YouTube
                    videoId={movie.trailer.key}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                      },
                    }}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
