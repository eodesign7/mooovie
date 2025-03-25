"use client";

import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./movies/ConvexClientProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          {children}
        </NextThemesProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
