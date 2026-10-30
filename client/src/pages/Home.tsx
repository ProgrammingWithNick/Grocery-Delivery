import Hero from '../components/Hero'
import Features from '../components/Features'
import HomeCategories from '../components/HomeCategories'
import PopularProducts from '../components/PopularProducts'
import AppPromoBanner from '../components/AppPromoBanner'
import Newsletter from '../components/Newsletter'

const Home = () => {
    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Hero />
            <Features />
            <HomeCategories />
            <PopularProducts />
            <AppPromoBanner />
            <Newsletter />
        </div>
    )
}

export default Home