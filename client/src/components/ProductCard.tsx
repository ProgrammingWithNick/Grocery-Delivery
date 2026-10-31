import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { PlusIcon, StarIcon } from "lucide-react"
import type { Product } from "../types"
import { useCart } from "../context/CartContext"

const ProductCard = ({ product }: { product: Product }) => {
  const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || "₹"
  // Dummy cart function - replace with your real cart context
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation() // don't open the product page
    addToCart(product)
  }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-app-border/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-orange-50/60">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />

        {/* discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold uppercase bg-app-orange text-white rounded-full">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* product info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
          {product.name}
        </h3>

        {/* rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <StarIcon className="size-4 text-app-warning fill-app-warning" />
            <span className="text-sm font-medium text-gray-900">
              {product.rating}
            </span>
            <span className="text-xs text-app-text-light">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* price + add to cart */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 min-w-0">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {currencySymbol}
              {product.price.toFixed(1)}
            </span>
            {product.unit && (
              <span className="text-xs text-app-text-light">/ {product.unit}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-app-text-light line-through">
                {currencySymbol}
                {product.originalPrice.toFixed(1)}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart}
            className="shrink-0 p-2 rounded-full bg-app-orange text-white hover:bg-app-green-dark active:scale-95 transition-all"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard