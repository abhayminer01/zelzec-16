import React from 'react'
import NavBar from '../components/NavBar'
import * as Icons from "lucide-react"
import LoginComponent from '../components/LoginComponent'
import { useModal } from '../contexts/ModalContext'
import RegisterComponent from '../components/RegisterComponent';
import { Toaster, toast } from 'sonner'
import { useSell } from '../contexts/SellContext';
import SelectCategory from '../components/sell/SelectCategory';
import AddDetails from '../components/sell/AddDetails';
import UploadImage from '../components/sell/UploadImage';
import SelectLocation from '../components/sell/SelectLocation';
import SetPrice from '../components/sell/SetPrice';
import FinalStep from '../components/sell/FinalStep';
import { getPrimaryCategories } from '../services/category-api';
import { useState } from 'react';
import { useEffect } from 'react';
import MobileBottomNav from '../components/MobileBottomNav';
import { getHomePageData, getListedProducts } from '../services/product-api'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { visitorCount } from '../services/auth'
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import ProductScrollSection from '../components/ProductScrollSection';
import HomeProductCard from '../components/HomeProductCard';

export default function HomePage() {
  const [category, setCategory] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoginOpen, isRegisterOpen, openLogin, closeLogin } = useModal();
  const { step, nextStep, clearStep } = useSell();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate()

  useEffect(() => {
    fetchHomeData();
    fetchPrimaryCategories();
    incrementVisitor();
  }, []);

  const incrementVisitor = async () => {
    try {
      const res = await visitorCount();
    } catch (error) {
      // Silent error
    }
  }

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await getHomePageData();
      if (res.success) {
        setFeaturedProducts(res.data.featured);
        setSections(res.data.sections);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchPrimaryCategories = async () => {
    try {
      const res = await getPrimaryCategories();
      if (res.success) {
        setCategory(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePostAdButton = async () => {
    if (!isAuthenticated) {
      openLogin();
    } else {
      if (step === 0) {
        try {
          const res = await getListedProducts();
          if (res.success && res.data.length >= 8) {
            Swal.fire({
              icon: 'warning',
              title: 'Limit Reached',
              text: "You have reached the maximum limit of 8 products.",
              confirmButtonColor: '#7C5CB9'
            });
          } else {
            nextStep();
          }
        } catch (error) {
          console.error(error);
          toast.error("Could not verify limits. Please try again.");
        }
      } else {
        clearStep();
      }
    }
  }



  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`)
  }

  return (
    <div className='pb-20 md:pb-0 bg-gray-50/50'>
      <Toaster position='top-right' />
      <NavBar />
      <MobileBottomNav />
      {isLoginOpen && <LoginComponent />}
      {isRegisterOpen && <RegisterComponent />}
      {step === 1 && <SelectCategory />}
      {step === 2 && <AddDetails />}
      {step === 3 && <UploadImage />}
      {step === 4 && <SelectLocation />}
      {step === 5 && <SetPrice />}
      {step === 6 && <FinalStep />}

      {/* Hero Banner */}
      <div>
        <img src="images/image.png" className='w-full md:h-100 h-30 object-cover' />
      </div>

      <div className='max-w-7xl mx-auto px-4 md:px-12 lg:px-24 mt-8 md:mt-12'>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className='text-lg md:text-xl font-bold text-gray-900 mb-6'>Browse Categories</h2>
          <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {category.map((item, index) => {
              let Icon = Icons[item.icon];
              return (
                <div
                  onClick={() => handleCategoryClick(item._id)}
                  key={index}
                  className='bg-white border text-center p-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-gray-100 group'
                >
                  <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    {Icon && <Icon className="size-6 text-primary" />}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{item.title}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Featured Listings (Grid) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Featured Listings</h1>
              <p className="text-sm text-gray-500 mt-1">Latest items from around you</p>
            </div>
          </div>

          {featuredProducts.length === 0 && !loading ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Icons.Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((p) => (
                <HomeProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Dynamic Category Sections */}
        {sections.map((section) => (
          <ProductScrollSection
            key={section.category._id}
            title={`Latest in ${section.category.title}`}
            products={section.products}
            categoryId={section.category._id}
            viewAllLink={`/category/${section.category._id}`}
          />
        ))}

      </div>



      <div className='flex flex-col bg-primary w-screen h-70 gap-4 justify-center items-center'>
        <h1 className='text-white text-3xl'>Ready to Sell?</h1>
        <p className='text-gray-400'>Post your ad and reach thousand of buyers</p>
        <button onClick={handlePostAdButton} className='border bg-white rounded-lg px-6 py-3 shadow-xl'>Post Your Ad Now</button>
      </div>

      <Footer />

    </div>
  )
}