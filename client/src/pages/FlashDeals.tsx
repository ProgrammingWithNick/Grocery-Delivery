import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRightIcon,
  BadgePercentIcon,
  LeafIcon,
  TruckIcon,
  ZapIcon,
} from "lucide-react"
import type { Product } from "../types"
import { dummyProducts } from "../assets/assets"
import ProductCard from "../components/ProductCard"

// seconds left until midnight (deals "reset" every day)
const secondsUntilMidnight = () => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
}

const pad = (n: number) => String(n).padStart(2, "0")

const perks = [
  { icon: TruckIcon, title: "Free delivery 🚚", text: "On flash-deal orders above the minimum." },
  { icon: LeafIcon, title: "Farm fresh 🌿", text: "Picked this morning, packed with care." },
  { icon: BadgePercentIcon, title: "Real savings 💸", text: "Prices drop only while the timer runs." },
]

const FlashDeals = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [secondsLeft, setSecondsLeft] = useState(secondsUntilMidnight)

  // load deals (swap for a real API call later)
  useEffect(() => {
    const timer = setTimeout(() => {
      const deals = (dummyProducts as unknown as Product[])
        .filter((p) => (p as unknown as { stock?: number }).stock === undefined || (p as unknown as { stock: number }).stock > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 12)

      setProducts(deals)
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // countdown
  useEffect(() => {
    const interval = setInterval(() => setSecondsLeft(secondsUntilMidnight()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const timeBoxes = [
    { label: "Hours", value: pad(hours) },
    { label: "Mins", value: pad(minutes) },
    { label: "Secs", value: pad(seconds) },
  ]

  return (
    <div className="min-h-screen bg-app-cream">
      {/* banner */}
      <section className="relative overflow-hidden bg-linear-to-br from-app-orange to-app-orange-dark text-white">
        {/* decorative glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-black/10 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-xs sm:text-sm font-semibold backdrop-blur">
            <ZapIcon className="size-4 fill-white" /> Limited time only ⏰
          </span>

          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Flash Deals 🔥
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Fresh picks, fabulous prices! 🥕🍎 Grab your favourite groceries
            before the clock runs out — once they&apos;re gone, they&apos;re gone.
          </p>

          {/* countdown */}
          <div className="mt-8" role="timer" aria-label="Time left for flash deals">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-white/80 mb-3">
              Deals end in
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {timeBoxes.map((box, i) => (
                <div key={box.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-16 sm:w-20 rounded-2xl bg-white/15 backdrop-blur py-3 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold tabular-nums">
                      {box.value}
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-wide text-white/80">
                      {box.label}
                    </div>
                  </div>
                  {i < timeBoxes.length - 1 && (
                    <span className="text-2xl font-bold text-white/70">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-md border border-app-border/60"
            >
              <div className="size-11 shrink-0 rounded-full bg-app-orange/10 text-app-orange flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-app-text-light">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Today&apos;s Hot Deals 🛒
            </h2>
            <p className="text-sm text-app-text-light mt-1">
              Handpicked favourites with the biggest discounts first ✨
            </p>
          </div>
          <Link
            to="/products"
            className="group hidden sm:flex shrink-0 items-center gap-1 text-sm font-medium text-app-orange hover:text-app-orange-dark transition-colors"
          >
            All products
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-app-border/60 bg-white overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-zinc-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-zinc-100" />
                  <div className="h-3 w-1/2 rounded bg-zinc-100" />
                  <div className="h-5 w-1/3 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-16 sm:py-24 bg-white border border-app-border/60 rounded-2xl">
            <div className="text-5xl">😴</div>
            <h3 className="text-lg font-semibold text-gray-900">
              No flash deals right now
            </h3>
            <p className="text-sm text-app-text-light max-w-xs">
              Fresh deals land every day. Check back soon, or browse our full
              range in the meantime! 🥬
            </p>
            <Link
              to="/products"
              className="mt-2 px-6 py-2.5 rounded-full bg-app-green text-white text-sm font-medium hover:bg-app-green-dark active:scale-95 transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* bottom call to action */}
        {!loading && products.length > 0 && (
          <div className="mt-12 sm:mt-16 rounded-3xl bg-app-green text-white text-center px-6 py-10 sm:py-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
              Want even more fresh finds? 🌱
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-md mx-auto">
              Explore hundreds of organic and everyday essentials, delivered
              fresh to your doorstep.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-app-green font-semibold hover:bg-orange-50 active:scale-95 transition-all"
            >
              Shop all products <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default FlashDeals