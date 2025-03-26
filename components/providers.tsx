"use client";

import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./movies/ConvexClientProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

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
          <Toaster theme="dark" position="bottom-right" richColors />
        </NextThemesProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
