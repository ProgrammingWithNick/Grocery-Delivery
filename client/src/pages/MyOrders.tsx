import { useEffect, useState } from 'react'
import type { Order } from '../types'
import { useSearchParams} from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { dummyDashboardOrdersData } from '../assets/assets'
import { Package, PackageIcon } from 'lucide-react'

const MyOrders = () => {
  const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || "₹"

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchParam, setSearchParam] = useSearchParams()

  const tabs =["all","placed","out-for-delivery","delivered"]

  const {clearCart} = useCart()

  const fetchOrders = async () => {
   setOrders(dummyDashboardOrdersData as any)
   setLoading(false)
  }

  useEffect(() => {
    if (searchParam.get('clearCart')) {
      clearCart()
      setSearchParam({})
      setTimeout(()=>{
        fetchOrders()
      }, 2000)
    } else {
      fetchOrders()
    }
  }, [activeTab])

  return (
    <div className='min-h-screen bg-app-cream mb-20'>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-app-green mb-6">My Orders</h1>
        {/* tabs */}
        <div className="">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-app-green text-white' : 'bg-app-light text-app-green'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All Orders' : tab.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        {/* order list */}
      {loading ? (
        <div className="mt-4">Loading orders...</div>
      ) : orders.length ===0 ?(
        <div className="text-center">
          <PackageIcon className="mx-auto mb-2 text-app-green size-16"  />
          <h2 className="text-lg font-semibold text-app-green">No orders found</h2>
          <p className="text-sm text-app-text"></p>
        </div>
      )
        }
      </div>


    </div>
  )
}

export default MyOrders