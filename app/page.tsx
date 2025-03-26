import MovieOfTheDay from "@/components/movies/MovieOfTheDay";
import PopularMovies from "@/components/movies/PopularMovies";
import Upcoming from "@/components/movies/Upcoming";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section - Movie of the Day */}
        <MovieOfTheDay />

        {/* Most Popular Movies */}
        <PopularMovies />

        {/* Trailers */}
        <Upcoming />

        {/* Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
