"use client";

import { LogIn, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import Image from "next/image";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

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

        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Movies, TV Series or Actors"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
          />
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm hover:text-white/80 transition"
            >
              {item.label}
            </Link>
          ))}
          <Unauthenticated>
            <SignInButton mode="modal">
              <LogIn className="text-white/80 hover:text-white transition" />
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
