import { ArrowRightIcon, LeafIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { heroSectionData } from "../assets/assets"

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl flex items-center">
      {/* background image */}
      <img
        src={heroSectionData.hero_image}
        alt="Fresh organic groceries"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* gradient overlay (stronger on mobile so text stays readable) */}
      <div className="absolute inset-0 bg-linear-to-r from-app-green via-app-green/80 to-app-green/40 md:via-app-green/65 md:to-transparent" />

      {/* content */}
      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="max-w-xl xl:pl-10">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-orange-300 bg-orange-300/20 px-3 py-1 rounded-full mb-4">
            <LeafIcon className="size-3" /> Farm-Fresh &amp; Organic
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 sm:mb-5">
            Nourish your home with{" "}
            <span className="text-orange-400">Earth&apos;s finest</span>
          </h1>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md">
            {heroSectionData.description}
          </p>

          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Shop Now <ArrowRightIcon className="size-4" />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-1 text-white/90 hover:text-white px-2 py-3 transition-colors"
            >
              Browse Categories <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero