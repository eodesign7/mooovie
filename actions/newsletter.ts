"use server";

import client from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    throw new Error("Please provide a valid email address");
  }

  try {
    await client.mutation(api.newsletter.addNewSubscriber, { email });
    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    throw new Error("Failed to subscribe to newsletter");
  }
}
