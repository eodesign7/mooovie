"use client";

import { LogIn, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import Image from "next/image";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTransition, useState, useRef } from "react";
import { search } from "@/actions/search";
import type { SearchResult } from "@/actions/search";
import SearchResults from "./search/SearchResults";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useDebouncedCallback } from "use-debounce";

const navItems = [
  {
    label: "Movies",
    href: "/movies",
  },
  {
    label: "Series",
    href: "/series",
  },
  {
    label: "TV Shows",
    href: "/tv-shows",
  },
  {
    label: "Actors",
    href: "/actors",
  },
  {
    label: "Watchlist",
    href: "/watchlist",
  },
];

export default function Header() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => setShowResults(false);
  useOnClickOutside(
    searchRef as React.RefObject<HTMLElement>,
    handleClickOutside,
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowResults(false);
    });
  };

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (value.length >= 3) {
      const searchResults = await search(value);
      setResults(searchResults);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/mooovie-cow-logo.png"
              alt="Mooovie Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="dark:text-white text-xl font-bold">Mooovie</span>
        </Link>

        <div ref={searchRef} className="relative w-full max-w-md mx-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                name="search"
                value={query}
                onChange={handleChange}
                placeholder="Search Movies, TV Series or Actors"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
              />
            </div>
          </form>
          {showResults && (
            <SearchResults
              results={results}
              onSelect={() => setShowResults(false)}
            />
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </div>
    </header>
  );
}
