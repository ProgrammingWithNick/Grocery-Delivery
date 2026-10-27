import { useState } from "react"
import { TruckIcon, XIcon, ZapIcon } from "lucide-react"

const STORAGE_KEY = "bannerDismissed"

const Banner = () => {
  // Show the banner unless the user already closed it in this session
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "true"
    } catch {
      return true
    }
  })

  const handleClose = () => {
    setIsVisible(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // storage not available, ignore
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-app-green text-white px-3 py-2 sm:px-4 sm:py-3 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* messages */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 md:gap-4">
          {/* message 1 (always visible) */}
          <div className="flex min-w-0 items-center gap-2">
            <TruckIcon className="size-4 shrink-0 sm:size-5" />
            <p className="text-xs sm:text-sm md:text-base text-center">
              Welcome to FreshKart!{" "}
              <span className="font-semibold">Get 10% off your first order.</span>
            </p>
          </div>

          {/* divider + message 2 (tablet and up) */}
          <span className="hidden md:inline text-white/40" aria-hidden="true">
            |
          </span>
          <div className="hidden md:flex items-center gap-2">
            <ZapIcon className="size-4 shrink-0 sm:size-5" />
            <span className="text-sm md:text-base">
              Farm-fresh produce delivered daily
            </span>
          </div>
        </div>

        {/* close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close banner"
          className="shrink-0 rounded p-1 text-white hover:bg-white/10 hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <XIcon className="size-4 sm:size-5" />
        </button>
      </div>
    </div>
  )
}

export default Banner