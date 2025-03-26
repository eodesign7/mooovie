import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addNewSubscriber = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("newsletter", {
      email: args.email,
    });
  },
});
