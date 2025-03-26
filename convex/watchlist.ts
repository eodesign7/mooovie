import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Schéma pre watchlist
export const createWatchlist = mutation({
  args: {
    name: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const watchlistId = await ctx.db.insert("watchlists", {
      name: args.name,
      userId: args.userId,
      items: [],
      createdAt: new Date().toISOString(),
    });
    return watchlistId;
  },
});

// Pridanie média do watchlistu
export const addToWatchlist = mutation({
  args: {
    watchlistId: v.id("watchlists"),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist) throw new Error("Watchlist not found");

    const items = watchlist.items || [];
    const newItem = {
      id: args.mediaId,
      type: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      addedAt: new Date().toISOString(),
    };

    await ctx.db.patch(args.watchlistId, {
      items: [...items, newItem],
    });
  },
});

// Získanie watchlistov užívateľa
export const getUserWatchlists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("watchlists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Získanie obsahu watchlistu
export const getWatchlistContent = query({
  args: { watchlistId: v.id("watchlists") },
  handler: async (ctx, args) => {
    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist) throw new Error("Watchlist not found");
    return watchlist;
  },
});
