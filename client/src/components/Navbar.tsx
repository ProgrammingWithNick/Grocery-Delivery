import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BikeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  XIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type User = {
  name: string
  email: string
  isAdmin: boolean
}

type MenuItem = {
  to: string
  label: string
  icon: LucideIcon
}

const Navbar = () => {
  // Dummy data - replace with your real auth / cart state
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    isAdmin: true,
  } as User | null
  const cartCount = 5

  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Items shown inside the user dropdown
  const userMenuItems: MenuItem[] = [
    { to: "/orders", label: "My Orders", icon: PackageIcon },
    { to: "/addresses", label: "Addresses", icon: MapPinIcon },
    { to: "/products", label: "Products", icon: ShoppingBagIcon },
    { to: "/deals", label: "Deals", icon: TagIcon },
    ...(user?.isAdmin
      ? [{ to: "/admin/products", label: "Admin Dashboard", icon: LayoutDashboardIcon }]
      : []),
  ]

  // Close user dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    navigate(`/products?search=${encodeURIComponent(q)}`)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    // Replace with your real logout logic
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    navigate("/login")
  }

  const searchForm = (extraClass = "") => (
    <form onSubmit={handleSearch} className={`text-xs sm:text-sm ${extraClass}`}>
      <div className="relative w-full">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full py-2 pl-9 pr-4 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-2 focus:ring-app-orange/30 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  )

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[20px] font-bold shrink-0"
        >
          <BikeIcon size={24} /> FreshKart
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 lg:gap-10">
          {/* nav links (tablet and up) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-zinc-900 transition-colors">
              Products
            </Link>
            <Link to="/deals" className="text-app-orange hover:opacity-80 transition-opacity">
              Deals
            </Link>
          </div>

          {/* search (tablet and up) */}
          {searchForm("hidden md:flex flex-1 max-w-sm")}

          {/* right actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* cart */}
            <button
              type="button"
              aria-label="Open cart"
              className="relative p-2 rounded-xl hover:bg-zinc-100 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-app-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* user profile */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-label="Open user menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center justify-center size-9 rounded-full bg-app-green text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-app-border py-2 text-sm">
                    <div className="px-4 py-2 border-b border-app-border">
                      <p className="font-semibold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    {userMenuItems.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50"
                      >
                        <Icon className="size-4" /> {label}
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOutIcon className="size-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-app-green text-white text-xs sm:text-sm font-medium hover:bg-app-green-dark transition-colors"
              >
                Login
              </Link>
            )}

            {/* mobile menu button */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-xl hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-app-border bg-white px-4 py-4 space-y-4">
          {searchForm("flex")}

          <div className="flex flex-col gap-3 text-sm text-zinc-700">
            

            {user ? (
              // logged in: My Orders, Addresses, Products, Deals, (Admin)
              userMenuItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 ${
                    to === "/deals" ? "text-app-orange" : ""
                  }`}
                >
                  <Icon className="size-4" /> {label}
                </Link>
              ))
            ) : (
              // logged out: Products, Deals
              <>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </Link>
                <Link
                  to="/deals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-app-orange"
                >
                  Deals
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar