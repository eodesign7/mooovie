"use server";
import client from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";

export async function subscribe(email: string) {
  await client.mutation(api.newsletter.addNewSubscriber, { email });
}

