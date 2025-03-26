import { ConvexClient } from "convex/browser";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default client;
