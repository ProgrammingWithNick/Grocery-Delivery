import { appPromoBannerData, assets } from "../assets/assets"

const AppPromoBanner = () => {
  return (
    <section className="relative overflow-hidden bg-green-950 max-w-7xl mx-4 sm:mx-6 lg:mx-8 xl:mx-auto rounded-2xl sm:rounded-3xl mb-8 sm:mb-10">
      {/* soft decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-green-700/30 blur-3xl"
      />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-12">
        {/* left side content */}
        <div className="text-center md:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-3">
            {appPromoBannerData.title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 mb-6 max-w-md mx-auto md:mx-0">
            {appPromoBannerData.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              type="button"
              className="bg-white text-green-950 font-medium py-2.5 px-5 rounded-lg hover:bg-green-100 active:scale-95 transition-all"
            >
              App Store
            </button>
            <button
              type="button"
              className="bg-green-800 text-white font-medium py-2.5 px-5 rounded-lg border border-white/10 hover:bg-green-700 active:scale-95 transition-all"
            >
              Google Play
            </button>
          </div>
        </div>

        {/* right side content */}
        <div className="flex items-center justify-center shrink-0">
          <img
            src={assets.delivery_truck}
            alt="Delivery truck"
            loading="lazy"
            className="w-56 sm:w-72 lg:w-96 xl:w-[28rem] h-auto object-contain xl:pr-6"
          />
        </div>
      </div>
    </section>
  )
}

export default AppPromoBanner