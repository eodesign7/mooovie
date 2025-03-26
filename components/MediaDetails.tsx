"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  Calendar,
  Play,
  Maximize2,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import YouTube from "react-youtube";
import { getSimilar } from "@/actions/getSimilar";
import { getImages, type MediaImage } from "@/actions/getImages";
import { MovieCard } from "./movies/MovieCard";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MediaDetailsProps {
  media: Movie | TVShow | Person;
}

export function MediaDetails({ media }: MediaDetailsProps) {
  const { user } = useUser();
  const router = useRouter();
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const watchlists = useQuery(api.watchlist.getUserWatchlists, {
    userId: user?.id || "",
  });

  const [similarContent, setSimilarContent] = useState<(Movie | TVShow)[]>([]);
  const [images, setImages] = useState<{
    backdrops: MediaImage[];
    posters: MediaImage[];
  }>({
    backdrops: [],
    posters: [],
  });

  const isMovie = "title" in media;
  const isTVShow = "first_air_date" in media;
  const isPerson = "known_for_department" in media;

  const title = isMovie ? media.title : (media as TVShow | Person).name;
  const backdropPath = isMovie || isTVShow ? media.backdrop_path : null;
  const posterPath = isPerson
    ? media.profile_path
    : (media as Movie | TVShow).poster_path;
  const overview =
    isMovie || isTVShow ? media.overview : isPerson ? media.biography : "";

  const releaseDate = isMovie
    ? media.release_date
    : isTVShow
      ? media.first_air_date
      : null;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const rating = isMovie || isTVShow ? media.vote_average : null;
  const runtime = isMovie ? media.runtime : null;
  const genres =
    (isMovie || isTVShow) && "genres" in media ? media.genres : null;

  // For movies and TV shows
  const videos = "videos" in media ? media.videos?.results : null;
  const trailer = videos?.find((video) => video.type === "Trailer");

  // For movies and TV shows
  const credits = "credits" in media ? media.credits : null;
  const director = credits?.crew?.find((person) => person.job === "Director");
  const cast = credits?.cast?.slice(0, 12);

  // For actors
  const knownFor = isPerson ? media.known_for : null;

  useEffect(() => {
    async function fetchData() {
      if (!isMovie && !isTVShow) return;

      const mediaType = isMovie ? "movie" : "tv";
      const [similar, mediaImages] = await Promise.all([
        getSimilar(mediaType, media.id.toString()),
        getImages(mediaType, media.id.toString()),
      ]);

      setSimilarContent(similar);
      setImages(mediaImages);
    }

    fetchData();
  }, [media.id, isMovie, isTVShow]);

  const handleAddToWatchlist = async (watchlistId: Id<"watchlists">) => {
    try {
      await addToWatchlist({
        watchlistId,
        mediaId: media.id.toString(),
        mediaType: isMovie ? "movie" : isTVShow ? "tv" : "person",
        title: title,
        posterPath: posterPath || undefined,
      });

      toast.success("Added to Watchlist", {
        description: `${title} has been added to your watchlist.`,
      });
    } catch {
      toast.error("Error", {
        description: "Failed to add to watchlist. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Backdrop Image */}
      <div className="relative h-screen">
        {backdropPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="container mx-auto h-full px-4">
            <div className="flex h-full items-end pb-24">
              <div className="flex gap-8">
                {/* Poster/Profile Image */}
                <div className="relative aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-lg">
                  {posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Title and Year */}
                  <h1 className="text-4xl font-bold text-white">
                    {title}
                    {releaseYear && (
                      <span className="ml-2 text-white/70">
                        ({releaseYear})
                      </span>
                    )}
                  </h1>

                  {/* Tagline for movies */}
                  {isMovie && media.tagline && (
                    <p className="mt-2 text-xl italic text-white/70">
                      {media.tagline}
                    </p>
                  )}

                  {/* Rating and Runtime */}
                  <div className="mt-4 flex items-center gap-4">
                    {rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-medium">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-5 w-5" />
                        <span>{runtime} min</span>
                      </div>
                    )}
                    {releaseDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-5 w-5" />
                        <span>
                          {new Date(releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {genres && genres.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Overview/Biography */}
                  {overview && (
                    <div className="mt-8">
                      <p className="text-lg leading-relaxed text-white/90">
                        {overview}
                      </p>
                    </div>
                  )}

                  {/* Director */}
                  {director && (
                    <div className="mt-4">
                      <span className="text-white/70">Director: </span>
                      <span className="font-medium">{director.name}</span>
                    </div>
                  )}

                  {/* Watch Trailer Button */}
                  <div className="mt-8 flex gap-4">
                    {trailer && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Watch Trailer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[900px] p-0 bg-black border-white/10">
                          <DialogTitle className="sr-only">
                            {title} Trailer
                          </DialogTitle>
                          <div className="aspect-video relative">
                            <YouTube
                              videoId={trailer.key}
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
                    )}

                    {/* Add to Watchlist Button */}
                    {user &&
                      (isMovie || isTVShow) &&
                      (watchlists && watchlists.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-5 w-5" />
                              Add to Watchlist
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {watchlists.map((list) => (
                              <DropdownMenuItem
                                key={list._id}
                                onClick={() => handleAddToWatchlist(list._id)}
                              >
                                {list.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => router.push("/watchlist")}
                        >
                          <Plus className="h-5 w-5" />
                          Create Watchlist
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Images Section */}
        {images.backdrops.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Images</h2>
            <ScrollArea className="w-full rounded-md">
              <div className="flex space-x-4 pb-8">
                {images.backdrops.map((image, index) => (
                  <Dialog key={image.file_path}>
                    <DialogTrigger asChild>
                      <div className="relative aspect-video w-[400px] flex-none cursor-pointer overflow-hidden rounded-lg">
                        <Image
                          src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                          alt={`${title} image ${index + 1}`}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 rounded-full bg-black/50 p-2">
                          <Maximize2 className="h-4 w-4" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="min-w-[80vw]  p-0 flex items-center justify-center">
                      <DialogTitle className="sr-only">
                        {title} - Image {index + 1}
                      </DialogTitle>
                      <div className="relative aspect-video w-full h-full">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                          alt={`${title} image ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1920px) 95vw"
                          quality={100}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/10" />
            </ScrollArea>
          </div>
        )}

        {/* Cast Section */}
        {cast && cast.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Cast</h2>
            <ScrollArea className="w-full rounded-md">
              <div className="flex space-x-4 pb-4">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-3 rounded-full bg-white/5 p-1 pr-4 flex-none"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      {actor.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium whitespace-nowrap">
                        {actor.name}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {actor.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/10" />
            </ScrollArea>
          </div>
        )}

        {/* Similar Section */}
        {(isMovie || isTVShow) && similarContent.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">
              Similar {isMovie ? "Movies" : "Shows"}
            </h2>
            <ScrollArea className="w-full rounded-md">
              <div className="flex space-x-4 pb-8">
                {similarContent.map((item) => (
                  <div key={item.id} className="w-[200px] flex-none">
                    <MovieCard movie={item} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/10" />
            </ScrollArea>
          </div>
        )}

        {/* Known For (Actors) */}
        {knownFor && knownFor.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Known For</h2>
            <ScrollArea className="w-full rounded-md">
              <div className="flex space-x-4 pb-4">
                {knownFor.map((work) => (
                  <div
                    key={work.id}
                    className="w-[200px] flex-none overflow-hidden rounded-lg border bg-card"
                  >
                    {work.poster_path && (
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
                          alt={work?.title || work?.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-medium">{work.title || work.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {work.media_type === "movie" ? "Movie" : "TV Show"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="bg-white/10 pt-10"
              />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
