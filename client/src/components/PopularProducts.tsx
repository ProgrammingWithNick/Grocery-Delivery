import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import type { Product } from "../types"
import { dummyProducts } from "../assets/assets"
import ProductCard from "./ProductCard"

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Replace with your real API call later
    setProducts(dummyProducts.slice(0, 10) as unknown as Product[])
  }, [])

  return (
    <section className="pb-10 sm:pb-14 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Popular Products
            </h2>
            <p className="text-sm text-app-text-light mt-1">
              Top-rated products this season
            </p>
          </div>

          <Link
            to="/products"
            className="group shrink-0 text-sm font-medium text-app-orange hover:text-app-orange-dark transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* products grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularProducts