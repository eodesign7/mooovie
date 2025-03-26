"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";

export default function Watchlist() {
  const { user } = useUser();
  const [watchlistName, setWatchlistName] = useState("");

  const createWatchlist = useMutation(api.watchlist.createWatchlist);
  const watchlists = useQuery(api.watchlist.getUserWatchlists, {
    userId: user?.id || "",
  });

  const handleCreateWatchlist = async () => {
    if (!watchlistName.trim()) return;

    try {
      await createWatchlist({
        name: watchlistName,
        userId: user!.id,
      });

      toast.success("Watchlist Created", {
        description: `Your watchlist "${watchlistName}" has been created.`,
      });
      setWatchlistName("");
    } catch {
      toast.error("Error", {
        description: "Failed to create watchlist. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 h-screen py-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          Sign in to Create Watchlists
        </h1>
        <p className="text-muted-foreground mb-8">
          Keep track of your favorite movies and TV shows
        </p>
        <SignInButton mode="modal">
          <Button size="lg">Sign In</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen py-24">
      <h1 className="text-2xl font-bold mb-8">My Watchlists</h1>

      <div className="grid gap-8">
        {/* Create Watchlist Form */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Create New Watchlist</h2>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Watchlist Name"
              value={watchlistName}
              onChange={(e) => setWatchlistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateWatchlist()}
            />
            <Button onClick={handleCreateWatchlist}>Create</Button>
          </div>
        </div>

        {/* Existing Watchlists */}
        <div className="grid gap-4">
          {watchlists?.map((watchlist) => (
            <div key={watchlist._id} className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{watchlist.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {watchlist.items?.length || 0} items
                </span>
              </div>

              {watchlist.items && watchlist.items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {watchlist.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${item.type === "movie" ? "movies" : "tv-shows"}/${item.id}`}
                      className="group relative aspect-[2/3] rounded-lg overflow-hidden"
                    >
                      {item.posterPath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No items in this watchlist yet
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
