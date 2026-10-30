import { heroSectionData } from "../assets/assets"

const Features = () => {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16 border border-app-border/80 rounded-2xl sm:rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {heroSectionData.hero_features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-orange-50/60 border border-transparent hover:border-app-green/20 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* icon bubble */}
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-full bg-app-green/10 text-app-green group-hover:bg-app-green group-hover:text-white transition-colors duration-300">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={feature.title}
                      className="size-6 sm:size-8 object-contain"
                    />
                  ) : (
                    <Icon
                      aria-label={feature.title}
                      className="size-6 sm:size-8"
                    />
                  )}
                </div>

                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features