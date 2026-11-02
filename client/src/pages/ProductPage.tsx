import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  HeartIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react"
import type { Product } from "../types"
import { dummyProducts } from "../assets/assets"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"

type Review = {
  id: string
  name: string
  rating: number
  date: string
  comment: string
}

// Sample reviews (replace with data from your API later)
const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Aarav Sharma",
    rating: 5,
    date: "2 days ago",
    comment: "Super fresh and arrived well packed! Tastes just like it came straight from the farm 🌿",
  },
  {
    id: "r2",
    name: "Priya Nair",
    rating: 4,
    date: "1 week ago",
    comment: "Really good quality and great price. Delivery was quick too. Would buy again 👍",
  },
  {
    id: "r3",
    name: "Rohan Mehta",
    rating: 5,
    date: "2 weeks ago",
    comment: "My family loved it! Fresh, clean and exactly as described. Highly recommended 😍",
  },
  {
    id: "r4",
    name: "Sneha Iyer",
    rating: 3,
    date: "3 weeks ago",
    comment: "Good overall, though a couple of pieces were smaller than I expected. Still tasty!",
  },
]

// read-only row of stars
const Stars = ({ value, size = "size-4" }: { value: number; size?: string }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon
        key={n}
        className={`${size} ${
          n <= Math.round(value)
            ? "text-app-warning fill-app-warning"
            : "text-zinc-300 fill-zinc-100"
        }`}
      />
    ))}
  </div>
)

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || "₹"

  const product = useMemo(
    () => (dummyProducts as unknown as Product[]).find((p) => p._id === id),
    [id]
  )

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS)

  // review form
  const [formName, setFormName] = useState("")
  const [formRating, setFormRating] = useState(5)
  const [formComment, setFormComment] = useState("")

  // reset the page when you open a different product
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setQuantity(1)
    setActiveImage(0)
    setWishlisted(false)
    setAdded(false)
  }, [id])

  // "Added to cart" tick goes away after 2 seconds
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(timer)
  }, [added])

  // related products: same category first, then fill with others
  const relatedProducts = useMemo(() => {
    if (!product) return []
    const others = (dummyProducts as unknown as Product[]).filter(
      (p) => p._id !== product._id
    )
    const sameCategory = others.filter((p) => p.category === product.category)
    const rest = others.filter((p) => p.category !== product.category)
    return [...sameCategory, ...rest].slice(0, 4)
  }, [product])

  // review summary numbers
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  const handleSubmitReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formComment.trim()) return

    setReviews((prev) => [
      {
        id: crypto.randomUUID(),
        name: formName.trim() || "Anonymous",
        rating: formRating,
        date: "Just now",
        comment: formComment.trim(),
      },
      ...prev,
    ])
    setFormName("")
    setFormRating(5)
    setFormComment("")
  }

  // product not found
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-3 px-4">
        <div className="text-6xl">🥲</div>
        <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
        <p className="text-sm text-app-text-light max-w-xs">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="mt-2 px-6 py-2.5 rounded-full bg-app-green text-white text-sm font-medium hover:bg-app-green-dark active:scale-95 transition-all"
        >
          Back to products
        </Link>
      </div>
    )
  }

  // optional fields your Product type might not declare
  const extra = product as unknown as {
    description?: string
    images?: string[]
    stock?: number
    organic?: boolean
    isOrganic?: boolean
  }
  const images = extra.images?.length ? extra.images : [product.image]
  const isOrganic = Boolean(extra.organic ?? extra.isOrganic)
  const stock = extra.stock
  const inStock = stock === undefined || stock > 0
  const maxQty = stock !== undefined && stock > 0 ? Math.min(stock, 20) : 20
  const hasDiscount = product.originalPrice > product.price

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
  }

  return (
    <div className="bg-app-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-app-text-light mb-5">
          <Link to="/products" className="inline-flex items-center gap-1 hover:text-app-green transition-colors">
            <ArrowLeftIcon className="size-4" /> Products
          </Link>
          <span>/</span>
          <span className="capitalize">{String(product.category ?? "")}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* product detail */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-3xl border border-app-border/60 p-4 sm:p-6 lg:p-8">
          {/* gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-orange-50/60">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold uppercase bg-app-orange text-white rounded-full">
                  {product.discount}% OFF 🔥
                </span>
              )}
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                className="absolute top-3 right-3 size-10 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <HeartIcon
                  className={`size-5 ${
                    wishlisted ? "text-red-500 fill-red-500" : "text-zinc-500"
                  }`}
                />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden bg-orange-50/60 border-2 transition-colors ${
                      i === activeImage ? "border-app-green" : "border-transparent hover:border-app-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {isOrganic && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-app-green/10 text-app-green">
                  <LeafIcon className="size-3" /> Organic 🌱
                </span>
              )}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                }`}
              >
                {inStock ? "In stock ✅" : "Out of stock"}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* rating summary */}
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 w-fit group">
              <Stars value={averageRating} />
              <span className="text-sm font-medium text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-app-text-light group-hover:text-app-green transition-colors">
                ({reviews.length} reviews)
              </span>
            </a>

            {/* price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                {currencySymbol}
                {product.price.toFixed(1)}
              </span>
              {product.unit && (
                <span className="text-sm text-app-text-light">/ {product.unit}</span>
              )}
              {hasDiscount && (
                <span className="text-lg text-app-text-light line-through">
                  {currencySymbol}
                  {product.originalPrice.toFixed(1)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm font-semibold text-green-600">
                  You save {currencySymbol}
                  {(product.originalPrice - product.price).toFixed(1)} 🎉
                </span>
              )}
            </div>

            <p className="mt-5 text-sm sm:text-base text-zinc-600 leading-relaxed">
              {extra.description ||
                "Hand-picked at peak freshness and packed with care, so every bite tastes like it came straight from the farm. Perfect for healthy meals, snacks and everything in between! 🥗"}
            </p>

            {/* quantity + add to cart */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-1 rounded-full border border-app-border/80 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="size-10 rounded-full flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <MinusIcon className="size-4" />
                </button>
                <span className="min-w-10 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  aria-label="Increase quantity"
                  className="size-10 rounded-full flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-medium text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  added ? "bg-green-600" : "bg-app-green hover:bg-app-green-dark"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircleIcon className="size-5" /> Added to cart!
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="size-5" /> Add to cart · {currencySymbol}
                    {(product.price * quantity).toFixed(1)}
                  </>
                )}
              </button>
            </div>

            {/* perks */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              {[
                { icon: TruckIcon, text: "Fast delivery 🚚" },
                { icon: LeafIcon, text: "Farm fresh 🌿" },
                { icon: RotateCcwIcon, text: "Easy returns 🔄" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 rounded-xl bg-orange-50/70 px-3 py-2.5 text-zinc-700"
                >
                  <Icon className="size-4 text-app-green shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* product details */}
        <section className="mt-8 sm:mt-10 bg-white rounded-3xl border border-app-border/60 p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Product details 📋
          </h2>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {[
              { label: "Category", value: String(product.category ?? "—") },
              { label: "Unit", value: product.unit || "—" },
              { label: "Type", value: isOrganic ? "Organic" : "Regular" },
              {
                label: "Availability",
                value: stock !== undefined ? (stock > 0 ? `${stock} in stock` : "Out of stock") : "In stock",
              },
              { label: "Storage", value: "Keep in a cool, dry place or refrigerate" },
              { label: "Freshness", value: "Packed fresh on the day of delivery" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-dashed border-app-border"
              >
                <dt className="text-app-text-light">{label}</dt>
                <dd className="font-medium text-gray-900 text-right capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* customer reviews */}
        <section
          id="reviews"
          className="mt-8 sm:mt-10 bg-white rounded-3xl border border-app-border/60 p-5 sm:p-8 scroll-mt-24"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Customer reviews 💬
          </h2>
          <p className="text-sm text-app-text-light mt-1">
            See what our happy shoppers are saying!
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* summary + form */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <Stars value={averageRating} size="size-5" />
                  <p className="text-sm text-app-text-light mt-1">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>

              {/* rating bars */}
              <div className="space-y-2">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="w-8 text-zinc-600">{star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-app-warning transition-all duration-500"
                        style={{
                          width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-5 text-right text-app-text-light">{count}</span>
                  </div>
                ))}
              </div>

              {/* write a review */}
              <form onSubmit={handleSubmitReview} className="rounded-2xl bg-orange-50/70 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Write a review ✍️</h3>

                <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={n === formRating}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onClick={() => setFormRating(n)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <StarIcon
                        className={`size-6 ${
                          n <= formRating
                            ? "text-app-warning fill-app-warning"
                            : "text-zinc-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-app-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-green"
                />
                <textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-app-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-green resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-medium rounded-xl bg-app-green text-white hover:bg-app-green-dark active:scale-[0.98] transition-all"
                >
                  Submit review
                </button>
              </form>
            </div>

            {/* review list */}
            <ul className="lg:col-span-2 space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-app-border/60 p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 shrink-0 rounded-full bg-app-green/10 text-app-green font-semibold flex items-center justify-center">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {review.name}
                        </p>
                        <p className="text-xs text-app-text-light">
                          {review.date} · Verified buyer ✔️
                        </p>
                      </div>
                    </div>
                    <Stars value={review.rating} />
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 sm:mt-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  You may also like 🛍️
                </h2>
                <p className="text-sm text-app-text-light mt-1">
                  More fresh picks we think you&apos;ll love
                </p>
              </div>
              <Link
                to="/products"
                className="hidden sm:block text-sm font-medium text-app-orange hover:text-app-orange-dark transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductPage