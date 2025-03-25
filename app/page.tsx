import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";
import MovieOfTheDay from "@/components/movies/MovieOfTheDay";
import PopularMovies from "@/components/movies/PopularMovies";
import Upcoming from "@/components/movies/Upcoming";

export default async function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {/* Hero Section - Movie of the Day */}
        <MovieOfTheDay />

        {/* Most Popular Movies */}
        <PopularMovies />

        {/* Trailers */}
        <Upcoming />
      </main>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white/60 text-sm">
              ©2025 Mooovie. Developer with 💖 by{" "}
              <Link
                href="https://eodev.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition"
              >
                eoDev
              </Link>
              . | All rights Reserved.
            </div>

            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-white/60 hover:text-white transition"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
