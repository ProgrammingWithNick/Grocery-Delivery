import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { SearchIcon, SearchXIcon, XIcon } from "lucide-react"
import type { Product } from "../types"
import { categoriesData, dummyProducts } from "../assets/assets"
import ProductCard from "../components/ProductCard"

const PAGE_SIZE = 8

const POPULAR_SEARCHES = ["Apple", "Milk", "Tomato", "Bread", "Eggs", "Rice"]

const SORT_OPTIONS = [
  { value: "", label: "Best match" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
]

const SearchResults = () => {
  const [params, setParams] = useSearchParams()

  // works with both /search?q=apple and /search?search=apple
  const query = (params.get("q") ?? params.get("search") ?? "").trim()
  const sort = params.get("sort") || ""

  const [input, setInput] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(Boolean(query))
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // keep the search box in sync with the URL (back / forward buttons)
  useEffect(() => {
    setInput(query)
  }, [query])

  // run the search (swap the body for a real API call later)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)

    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const timer = setTimeout(() => {
      const q = query.toLowerCase()

      let found = (dummyProducts as unknown as Product[]).filter((p) => {
        const extra = p as unknown as { description?: string }
        return (
          p.name.toLowerCase().includes(q) ||
          String(p.category ?? "").toLowerCase().includes(q) ||
          (extra.description ?? "").toLowerCase().includes(q)
        )
      })

      if (sort === "price-asc") found = [...found].sort((a, b) => a.price - b.price)
      if (sort === "price-desc") found = [...found].sort((a, b) => b.price - a.price)
      if (sort === "rating") found = [...found].sort((a, b) => b.rating - a.rating)

      if (cancelled) return
      setResults(found)
      setLoading(false)
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, sort])

  const runSearch = (term: string, keepSort = true) => {
    const next = new URLSearchParams()
    if (term.trim()) next.set("q", term.trim())
    if (keepSort && sort) next.set("sort", sort)
    setParams(next)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    runSearch(input)
  }

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set("sort", value)
    else next.delete("sort")
    setParams(next)
  }

  const visibleResults = results.slice(0, visibleCount)

  // helpful ideas shown when there is nothing to display
  const suggestions = (
    <div className="mt-6 space-y-6 w-full max-w-xl mx-auto">
      <div>
        <p className="text-xs uppercase tracking-widest text-app-text-light mb-3">
          Popular searches 🔥
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => runSearch(term, false)}
              className="px-4 py-1.5 text-sm rounded-full bg-white border border-app-border/80 text-zinc-700 hover:border-app-green hover:text-app-green transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-app-text-light mb-3">
          Or browse a category 🥕
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="px-4 py-1.5 text-sm rounded-full bg-app-green/10 text-app-green font-medium hover:bg-app-green hover:text-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-app-cream">
      {/* search header */}
      <section className="bg-white border-b border-app-border/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900">
            What are you craving? 🔍
          </h1>
          <p className="mt-2 text-sm sm:text-base text-app-text-light">
            Search fresh fruits, veggies, dairy and more — we&apos;ll find it
            in a snap! ⚡
          </p>

          <form onSubmit={handleSubmit} className="mt-6 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              autoFocus={!query}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full py-3.5 pl-12 pr-28 text-sm sm:text-base bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-2 focus:ring-app-orange/40 outline-none"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput("")
                  runSearch("")
                }}
                aria-label="Clear search"
                className="absolute right-24 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 text-sm font-medium rounded-full bg-app-green text-white hover:bg-app-green-dark active:scale-95 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!query ? (
          /* nothing searched yet */
          <div className="text-center py-8 sm:py-14">
            <div className="text-6xl">🧺</div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Start typing to discover fresh finds
            </h2>
            <p className="mt-1 text-sm text-app-text-light">
              Try one of these to get started 👇
            </p>
            {suggestions}
          </div>
        ) : (
          <>
            {/* heading + sort */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Results for{" "}
                  <span className="text-app-orange">&ldquo;{query}&rdquo;</span>
                </h2>
                <p className="text-sm text-app-text-light mt-1">
                  {loading
                    ? "Searching the shelves... 🔎"
                    : results.length === 0
                      ? "Nothing here yet"
                      : `${results.length} ${results.length === 1 ? "product" : "products"} found 🎉`}
                </p>
              </div>

              {!loading && results.length > 1 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-zinc-500">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 text-sm bg-white border border-app-border/80 rounded-full focus:outline-none focus:ring-2 focus:ring-app-green"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
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
            ) : results.length === 0 ? (
              /* no matches */
              <div className="flex flex-col items-center text-center py-12 sm:py-20 bg-white border border-app-border/60 rounded-3xl px-4">
                <div className="size-20 rounded-full bg-orange-50 flex items-center justify-center">
                  <SearchXIcon className="size-9 text-app-orange" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Oops, no matches for &ldquo;{query}&rdquo; 😕
                </h3>
                <p className="mt-1 text-sm text-app-text-light max-w-sm">
                  Check the spelling or try a simpler word. Maybe one of these
                  will hit the spot?
                </p>
                {suggestions}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {visibleResults.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* load more */}
                {visibleCount < results.length && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="px-8 py-3 rounded-full border border-app-green text-app-green font-medium hover:bg-app-green hover:text-white active:scale-95 transition-all"
                    >
                      Show more ({results.length - visibleCount} left) 👇
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default SearchResults