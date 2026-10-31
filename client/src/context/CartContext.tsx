import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import type { ReactNode } from "react"
import type { CartItem, Product } from "../types"

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
}

const STORAGE_KEY = "freshkart_cart"

export const CartContext = createContext<CartContextType | undefined>(undefined)

// Load saved cart (safe if storage is blocked or data is corrupted)
const loadCart = (): CartItem[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        const parsed = saved ? JSON.parse(saved) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(loadCart)
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Keep cart after page refresh
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch {
            // storage not available, ignore
        }
    }, [items])

    const addToCart = useCallback((product: Product, quantity = 1) => {
        if (quantity <= 0) return

        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product._id === product._id
            )

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prevItems, { product, quantity }]
        })
        setIsCartOpen(true) // open the cart drawer after adding
    }, [])

    const removeFromCart = useCallback((productId: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.product._id !== productId)
        )
    }, [])

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems((prevItems) =>
            quantity <= 0
                ? // quantity 0 (or less) removes the item instead of leaving it in the cart
                prevItems.filter((item) => item.product._id !== productId)
                : prevItems.map((item) =>
                    item.product._id === productId ? { ...item, quantity } : item
                )
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
        setIsCartOpen(false)
    }, [])

    const cartCount = useMemo(
        () => items.reduce((count, item) => count + item.quantity, 0),
        [items]
    )

    const cartTotal = useMemo(
        () =>
            items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
            ),
        [items]
    )

    const value = useMemo(
        () => ({
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen,
        }),
        [
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
        ]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}