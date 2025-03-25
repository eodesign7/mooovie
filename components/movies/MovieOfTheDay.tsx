import { Button } from "../ui/button";
import Image from "next/image";
import { Play } from "lucide-react";
import getMovieOfDay from "@/actions/getMovieOfDay";
import { Badge } from "../ui/badge";

export default async function MovieOfTheDay() {
  const movieOfDay = await getMovieOfDay();

  return (
    <div className="relative h-screen">
      <Image
        src={
          movieOfDay?.backdrop_path || "/placeholder.svg?height=1080&width=1920"
        }
        alt={movieOfDay?.title || "Featured Movie"}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-24">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="bg-white/10 p-2">
              Movie of the Day
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold">
              {movieOfDay?.title || "Loading..."}
            </h1>
            <p className="text-muted-foreground leading-relaxed tracking-tight text-sm md:text-base">
              {movieOfDay?.overview || "Loading..."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-white text-black hover:bg-white/90">
                Learn More
              </Button>
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
