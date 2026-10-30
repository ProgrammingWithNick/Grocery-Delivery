import { Link } from "react-router-dom"
import { categoriesData } from "../assets/assets"

const HomeCategories = () => {
    return (
        <section className="py-10 sm:py-14 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* heading */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Browse Categories
                    </h2>
                    <p className="text-sm text-app-text-light mt-1">
                        Find the perfect items for your needs
                    </p>
                </div>

                {/* categories: horizontal scroll on mobile, wraps nicely on large screens */}
                <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {categoriesData.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className="group snap-start shrink-0 w-28 sm:w-36 lg:w-40 flex flex-col items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-app-border/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="size-16 sm:size-20 rounded-full overflow-hidden bg-orange-100 ring-2 ring-transparent group-hover:ring-orange-300/75 transition-all duration-300">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HomeCategories