import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { useCart } from "../context/CartContext"

// Delivery rules (change these to match your store / currency)
const FREE_DELIVERY_MIN = 20
const DELIVERY_FEE = 1.99

const CartSidebar = () => {
  const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || "₹"
  const {
    items,
    removeFromCart,
    clearCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart()
  const navigate = useNavigate()

  const closeCart = () => setIsCartOpen(false)

  // Delivery + totals
  const hasFreeDelivery = cartTotal >= FREE_DELIVERY_MIN
  const delivery = items.length === 0 || hasFreeDelivery ? 0 : DELIVERY_FEE
  const orderTotal = cartTotal + delivery
  const remainingForFree = Math.max(FREE_DELIVERY_MIN - cartTotal, 0)
  const progress = Math.min((cartTotal / FREE_DELIVERY_MIN) * 100, 100)

  // Hooks must run on every render, so this goes BEFORE any early return.
  // Close on Escape + lock page scroll while the cart is open.
  useEffect(() => {
    if (!isCartOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isCartOpen, setIsCartOpen])

  const handleCheckout = () => {
    closeCart()
    navigate("/checkout")
  }

  return (
    <>
      {/* overlay */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* sidebar (always mounted so it can slide in AND out) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
        className={`fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-white shadow-2xl flex flex-col transition-[transform,visibility] duration-300 ease-out ${
          isCartOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-app-border/60">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-app-green/10 text-app-green flex items-center justify-center">
              <ShoppingBagIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                Your Cart
              </h2>
              <p className="text-xs text-app-text-light">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="size-24 rounded-full bg-orange-50 flex items-center justify-center">
              <ShoppingBagIcon className="size-10 text-app-orange" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Your cart is empty
            </h3>
            <p className="text-sm text-app-text-light max-w-xs">
              Add some fresh products to get started.
            </p>
            <button
              type="button"
              onClick={() => {
                closeCart()
                navigate("/products")
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-app-green text-white text-sm font-medium hover:bg-app-green-dark active:scale-95 transition-all"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* free delivery progress */}
            <div className="px-4 sm:px-6 pt-4">
              <div className="rounded-xl bg-orange-50/70 p-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <TruckIcon className="size-4 shrink-0 text-app-green" />
                  {hasFreeDelivery ? (
                    <span className="font-medium text-app-green">
                      You&apos;ve unlocked free delivery 🎉
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <b className="text-gray-900">
                        {currencySymbol}
                        {remainingForFree.toFixed(2)}
                      </b>{" "}
                      more for free delivery
                    </span>
                  )}
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full rounded-full bg-app-green transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* items */}
            <ul className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 divide-y divide-app-border/60">
              {items.map(({ product, quantity }) => (
                <li key={product._id} className="flex gap-3 py-4">
                  <div className="size-20 shrink-0 rounded-xl bg-orange-50/60 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product._id)}
                        aria-label={`Remove ${product.name}`}
                        className="shrink-0 p-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    <p className="text-xs text-app-text-light">
                      {currencySymbol}
                      {product.price.toFixed(1)}
                      {product.unit ? ` / ${product.unit}` : ""}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      {/* quantity controls */}
                      <div className="flex items-center gap-1 rounded-full border border-app-border/80">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product._id, quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
                        >
                          <MinusIcon className="size-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product._id, quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
                        >
                          <PlusIcon className="size-3.5" />
                        </button>
                      </div>

                      {/* line total */}
                      <span className="text-sm font-semibold text-gray-900">
                        {currencySymbol}
                        {(product.price * quantity).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* footer */}
            <div className="border-t border-app-border/60 bg-white px-4 sm:px-6 pt-4 pb-5 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-app-text-light">
                  <span>Subtotal</span>
                  <span className="text-gray-900">
                    {currencySymbol}
                    {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-app-text-light">
                  <span>Delivery</span>
                  {delivery === 0 ? (
                    <span className="font-medium text-app-green">Free</span>
                  ) : (
                    <span className="text-gray-900">
                      {currencySymbol}
                      {delivery.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-app-border">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {currencySymbol}
                    {orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-app-green text-white font-medium hover:bg-app-green-dark active:scale-[0.98] transition-all"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full py-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartSidebar