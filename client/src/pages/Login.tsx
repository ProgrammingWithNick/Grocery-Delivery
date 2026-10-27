import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import {
  BikeIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react"
import { heroSectionData } from "../assets/assets"

const Login = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // true = Login mode, false = Sign Up mode
  const [isLoggedInState, setIsLoggedInState] = useState(true)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Replace with your real API call
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/"
    }, 1000)
  }

  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-app-green focus:border-app-green"

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"

  return (
    <div className="min-h-screen flex">
      {/* left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <img
          src={heroSectionData.hero_image}
          alt="login banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
        />
        <div className="relative text-white text-center px-12">
          <h2 className="text-4xl font-semibold mb-4">
            {isLoggedInState ? "Welcome back to FreshKart 🌿" : "Join FreshKart 🌿"}
          </h2>
          <p className="text-xl text-white/60 font-serif max-w-sm mx-auto">
            Fresh groceries and organic products delivered to your door
          </p>
        </div>
      </div>

      {/* right side */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* form header message */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
            >
              <BikeIcon className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">FreshKart</span>
            </Link>

            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {isLoggedInState ? "Sign in to your account" : "Create a new account"}
            </h1>

            <p className="text-sm text-app-text-light">
              {isLoggedInState ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
                onClick={() => setIsLoggedInState(!isLoggedInState)}
              >
                {isLoggedInState ? "Create one here" : "Sign in here"}
              </button>
            </p>
          </div>

          {/* form fields */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* name only in Sign Up mode */}
            {!isLoggedInState && (
              <div>
                <label htmlFor="name" className="text-sm flex flex-col gap-1">
                  Name
                  <div className="relative">
                    <UserIcon className={iconClass} />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className={inputClass}
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>
                </label>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm flex flex-col gap-1">
                Email Address
                <div className="relative">
                  <MailIcon className={iconClass} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>
              </label>
            </div>

            <div>
              <label htmlFor="password" className="text-sm flex flex-col gap-1">
                Password
                <div className="relative">
                  <LockIcon className={iconClass} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-app-green hover:bg-app-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-green transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading && <Loader2Icon className="size-4 animate-spin" />}
              {loading
                ? isLoggedInState
                  ? "Signing in..."
                  : "Creating account..."
                : isLoggedInState
                ? "Sign in"
                : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login