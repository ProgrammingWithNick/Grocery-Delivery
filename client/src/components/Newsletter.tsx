import { useState } from "react"
import type { FormEvent } from "react"
import { CheckCircleIcon, MailIcon } from "lucide-react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return

    // Replace with your real API call
    console.log("Subscribed:", email)
    setSubscribed(true)
    setEmail("")
  }

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6 border border-app-border/80 rounded-2xl sm:rounded-3xl">
      <div className="max-w-2xl mx-auto text-center">
        {/* icon */}
        <div className="size-16 bg-app-green/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
          <MailIcon className="size-8 text-app-green" strokeWidth={1.5} />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-sm sm:text-base text-app-text-light mt-2 max-w-md mx-auto">
          Get the latest updates and offers delivered to your inbox.
        </p>

        {subscribed ? (
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-app-green/10 text-app-green text-sm font-medium">
            <CheckCircleIcon className="size-5" />
            Thanks for subscribing!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-app-border/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-app-green text-white rounded-lg hover:bg-app-green-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-green transition-all"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Newsletter