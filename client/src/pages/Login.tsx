import { useState } from "react"
import type { FormEvent } from "react"
import { heroSectionData } from "../assets/assets"

const Login = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
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
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-app-green focus:border-app-green"

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
          <h2 className="text-4xl font-semibold  mb-4">welcome back to FreshKart 🌿</h2>
          <p className="text-xl text-white/60 font-serif max-w-sm mx-auto">fersh groceries and organic products delivered to your door</p>
        </div>
      </div>

      {/* right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">
            {isLoggedInState ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-center mb-6">
            {isLoggedInState ? "Sign in to your account" : "Sign up to get started"}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLoggedInState && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-green hover:bg-app-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-green ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? isLoggedInState
                  ? "Signing in..."
                  : "Signing up..."
                : isLoggedInState
                ? "Sign in"
                : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            {isLoggedInState ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLoggedInState(!isLoggedInState)}
              className="text-app-green font-semibold hover:underline"
            >
              {isLoggedInState ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login