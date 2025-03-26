import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import getUpcomingMovies from "@/actions/getUpcomingMovies";
import TrailerCard from "./TrailerCard";
import { ChevronRight } from "lucide-react";

export default async function PopularMovies() {
  const movies = await getUpcomingMovies();

  if (!movies) {
    return <div>No movies found</div>;
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Upcoming Trailers</h2>
          <Link
            href="#"
            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <ScrollArea className="w-full rounded-md">
          <div className="flex space-x-4 pb-4">
            {movies.map((movie: Movie) => (
              <div key={movie.id} className="w-[200px] flex-none">
                <TrailerCard movie={movie} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-white/10" />
        </ScrollArea>
      </div>
    </section>
  );
}
