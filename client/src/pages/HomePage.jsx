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
import { getAllProducts, getListedProducts } from '../services/product-api'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { visitorCount } from '../services/auth'
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export default function HomePage() {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { isLoginOpen, isRegisterOpen, openLogin, closeLogin } = useModal();
  const { step, nextStep, clearStep } = useSell();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate()

  useEffect(() => {
    const initialLimit = window.innerWidth < 768 ? 8 : 50;
    setLimit(initialLimit);
    fetchProducts(1, initialLimit);
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

  const fetchProducts = async (currentPage = 1, currentLimit = 50) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getAllProducts({ page: currentPage, limit: currentLimit });
      if (res.success) {
        if (currentPage === 1) {
          setProducts(res.data);
        } else {
          setProducts(prev => [...prev, ...res.data]);
        }
        // Assuming API returns less than limit if no more data, or we can check length
        if (res.data.length < currentLimit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      //   console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, 20); // Load 20 more on each click
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

  // ... existing code ...

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

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  }

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`)
  }

  return (
    <div className='pb-20 md:pb-0'>
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
      <div>
        <img src="images/image.png" className='w-full md:h-100 h-30 object-cover' />
      </div>
      <div className='max-w-7xl mx-auto px-4 md:px-12 lg:px-24 mt-6 md:mt-10'>
        <h1 className='text-[18px] md:text-[20px] font-semibold text-left'>Browse Categories</h1>
        <div className='grid grid-cols-3 md:flex md:justify-center gap-3 md:gap-6 mt-5'>
          {category.map((item, index) => {
            let Icon = Icons[item.icon];
            return (
              <div onClick={() => handleCategoryClick(item._id)} key={index} className='border px-4 py-4 md:px-8 md:py-4 w-full md:w-[250px] flex flex-col justify-center align-middle items-center border-border rounded-lg hover:text-primary transition hover:border-primary' >
                {Icon && <Icon className="size-7 md:size-7 text-primary mb-1" />}
                <span className="text-xs md:text-sm font-medium text-center">{item.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="px-4 md:px-10 mt-10 md:mt-14 mb-20">
        <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 px-6 md:px-8 py-8 md:py-10">
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Featured Listings</h1>
            <p className="text-sm text-gray-500 mt-1">Discover amazing products</p>
          </div>

          {products.length === 0 && !loading ? (
            <div className="text-center py-16">
              <Icons.Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              {/* Responsive Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => {
                  const Icon = Icons[p.category?.icon] || Icons.Package;

                  return (
                    <div
                      onClick={() => handleCardClick(p._id)}
                      key={p._id}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                        <img
                          src={p.images?.[0]?.url ? `${import.meta.env.VITE_BACKEND_URL}${p.images[0].url}` : `${import.meta.env.VITE_BACKEND_URL}/uploads/${p.images?.[0]?.filename}`}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {p.title}
                        </h2>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                          {p.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {Icon && <Icon className="w-4 h-4 text-primary" />}
                            <span>{p.category?.title}</span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <p className="text-2xl font-bold text-primary">
                              ₹{p.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Icons.MapPin className="w-4 h-4" />
                              <span className="text-xs">{p.location.place || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleShowMore}
                    disabled={loading}
                    className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      'Show More Products'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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