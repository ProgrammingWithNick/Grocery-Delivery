import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LeafIcon,
  SearchXIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react"
import type { Product } from "../types"
import { categoriesData, dummyProducts } from "../assets/assets"
import ProductCard from "../components/ProductCard"

const PAGE_SIZE = 8

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
]

// Your Product type may not declare an organic flag, so read it safely
const isOrganicProduct = (p: Product) =>
  Boolean(
    (p as unknown as { organic?: boolean; isOrganic?: boolean }).organic ??
      (p as unknown as { isOrganic?: boolean }).isOrganic
  )

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchParam, setSearchParam] = useSearchParams()
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // read filters from the URL
  const category = searchParam.get("category") || ""
  const organic = searchParam.get("organic") || ""
  const sort = searchParam.get("sort") || ""
  const search = searchParam.get("search") || ""
  const minPrice = searchParam.get("minPrice") || ""
  const maxPrice = searchParam.get("maxPrice") || ""
  const page = Math.max(1, Number(searchParam.get("page")) || 1)

  // price inputs keep their own text until "Apply" is pressed
  const [minInput, setMinInput] = useState(minPrice)
  const [maxInput, setMaxInput] = useState(maxPrice)
  useEffect(() => {
    setMinInput(minPrice)
    setMaxInput(maxPrice)
  }, [minPrice, maxPrice])

  const activeCategory = categoriesData.find((c) => c.slug === category)
  const hasFilters = Boolean(
    category || organic || sort || search || minPrice || maxPrice
  )

  // Change one or more filters. Any filter change goes back to page 1.
  const updateFilters = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParam)
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    if (!("page" in changes)) params.delete("page")
    setSearchParam(params)
  }

  const clearFilters = () => setSearchParam({})

  // "fetch" products (swap the body for a real API call later)
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const timer = setTimeout(() => {
      let result = (dummyProducts as unknown as Product[]).filter((p) => {
        const productCategory = String(p.category ?? "")
        const matchCategory =
          !category ||
          productCategory === category ||
          productCategory === activeCategory?.name
        const matchSearch =
          !search || p.name.toLowerCase().includes(search.toLowerCase())
        const matchOrganic = !organic || isOrganicProduct(p)
        const matchMin = !minPrice || p.price >= Number(minPrice)
        const matchMax = !maxPrice || p.price <= Number(maxPrice)
        return matchCategory && matchSearch && matchOrganic && matchMin && matchMax
      })

      if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price)
      if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price)
      if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating)
      if (sort === "discount") result = [...result].sort((a, b) => b.discount - a.discount)

      const pages = Math.max(1, Math.ceil(result.length / PAGE_SIZE))
      const start = (Math.min(page, pages) - 1) * PAGE_SIZE

      if (cancelled) return
      setTotalCount(result.length)
      setTotalPages(pages)
      setProducts(result.slice(start, start + PAGE_SIZE))
      setLoading(false)
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [category, organic, sort, search, page, minPrice, maxPrice, activeCategory?.name])

  // if the URL page is too high (e.g. after filtering), jump to the last page
  useEffect(() => {
    if (!loading && page > totalPages) {
      const params = new URLSearchParams(searchParam)
      params.set("page", String(totalPages))
      setSearchParam(params, { replace: true })
    }
  }, [loading, page, totalPages, searchParam, setSearchParam])

  // lock page scroll while the mobile filter drawer is open
  useEffect(() => {
    if (!mobileFiltersOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileFiltersOpen])

  const applyPrice = () => updateFilters({ minPrice: minInput, maxPrice: maxInput })

  // filter controls (used in desktop sidebar AND mobile drawer)
  const filterControls = (
    <div className="space-y-7">
      {/* category */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => updateFilters({ category: "" })}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !category
                ? "bg-app-green/10 text-app-green font-medium"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            All Products
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => updateFilters({ category: cat.slug })}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                category === cat.slug
                  ? "bg-app-green/10 text-app-green font-medium"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* organic */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Type</h3>
        <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={organic === "true"}
            onChange={(e) => updateFilters({ organic: e.target.checked ? "true" : "" })}
            className="size-4 accent-app-green"
          />
          <LeafIcon className="size-4 text-app-green" />
          Organic only
        </label>
      </div>

      {/* price */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="w-full px-3 py-2 text-sm border border-app-border/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="w-full px-3 py-2 text-sm border border-app-border/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
          />
        </div>
        <button
          type="button"
          onClick={applyPrice}
          className="mt-3 w-full py-2 text-sm font-medium rounded-lg bg-app-green text-white hover:bg-app-green-dark transition-colors"
        >
          Apply
        </button>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            clearFilters()
            setMobileFiltersOpen(false)
          }}
          className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* heading */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          {activeCategory ? activeCategory.name : search ? `Results for "${search}"` : "All Products"}
        </h1>
        <p className="text-sm text-app-text-light mt-1">
          {loading ? "Loading..." : `${totalCount} ${totalCount === 1 ? "product" : "products"} found`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white border border-app-border/60 rounded-2xl p-5">
            {filterControls}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* toolbar */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-app-border/80 rounded-full bg-white hover:bg-zinc-50 transition-colors"
            >
              <SlidersHorizontalIcon className="size-4" /> Filters
              {hasFilters && <span className="size-2 rounded-full bg-app-orange" />}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort" className="hidden sm:block text-sm text-zinc-500">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="px-3 py-2 text-sm bg-white border border-app-border/80 rounded-full focus:outline-none focus:ring-2 focus:ring-app-green"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && (
                <Chip label={`Search: ${search}`} onRemove={() => updateFilters({ search: "" })} />
              )}
              {activeCategory && (
                <Chip label={activeCategory.name} onRemove={() => updateFilters({ category: "" })} />
              )}
              {organic && <Chip label="Organic" onRemove={() => updateFilters({ organic: "" })} />}
              {(minPrice || maxPrice) && (
                <Chip
                  label={`Price: ${minPrice || 0} – ${maxPrice || "any"}`}
                  onRemove={() => updateFilters({ minPrice: "", maxPrice: "" })}
                />
              )}
            </div>
          )}

          {/* products */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-app-border/60 bg-white overflow-hidden animate-pulse">
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
            <div className="flex flex-col items-center justify-center text-center gap-3 py-16 sm:py-24 bg-white border border-app-border/60 rounded-2xl">
              <div className="size-20 rounded-full bg-orange-50 flex items-center justify-center">
                <SearchXIcon className="size-9 text-app-orange" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="text-sm text-app-text-light max-w-xs">
                Try changing or clearing your filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 px-6 py-2.5 rounded-full bg-app-green text-white text-sm font-medium hover:bg-app-green-dark active:scale-95 transition-all"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* pagination */}
          {!loading && totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  updateFilters({ page: String(page - 1) })
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                aria-label="Previous page"
                className="p-2 rounded-full border border-app-border/80 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    updateFilters({ page: String(n) })
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  aria-current={n === page ? "page" : undefined}
                  className={`size-9 text-sm rounded-full transition-colors ${
                    n === page
                      ? "bg-app-green text-white font-semibold"
                      : "border border-app-border/80 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  updateFilters({ page: String(page + 1) })
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                aria-label="Next page"
                className="p-2 rounded-full border border-app-border/80 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <div
        onClick={() => setMobileFiltersOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          mobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        aria-label="Filters"
        className={`lg:hidden fixed left-0 top-0 z-50 h-dvh w-full max-w-xs bg-white shadow-2xl flex flex-col transition-[transform,visibility] duration-300 ease-out ${
          mobileFiltersOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border/60">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{filterControls}</div>
        <div className="p-5 border-t border-app-border/60">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full py-3 rounded-xl bg-app-green text-white font-medium hover:bg-app-green-dark transition-colors"
          >
            Show {totalCount} {totalCount === 1 ? "result" : "results"}
          </button>
        </div>
      </aside>
    </div>
  )
}

// small removable tag for active filters
const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 text-xs font-medium rounded-full bg-app-green/10 text-app-green">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label}`}
      className="p-0.5 rounded-full hover:bg-app-green/20 transition-colors"
    >
      <XIcon className="size-3" />
    </button>
  </span>
)

export default Products