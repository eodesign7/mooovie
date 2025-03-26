import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  newsletter: defineTable({
    email: v.string(),
  }),
  watchlists: defineTable({
    name: v.string(),
    userId: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        title: v.string(),
        posterPath: v.optional(v.string()),
        addedAt: v.string(),
      }),
    ),
    createdAt: v.string(),
  }),
});
