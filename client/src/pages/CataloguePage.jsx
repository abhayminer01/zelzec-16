// src/pages/CataloguePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getAllProducts } from '../services/product-api';
import { getAllCategories } from '../services/category-api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import CatalogueSidebar from '../components/CatalogueSidebar';
import CatalogueProductCard from '../components/CatalogueProductCard';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToFirst = () => onPageChange(1);
  const goToPrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const goToNext = () => currentPage < totalPages && onPageChange(currentPage + 1);
  const goToLast = () => onPageChange(totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 py-8 select-none justify-center">
      {/* Previous Button */}
      <button
        onClick={goToPrev}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1.5 px-2">
        {pages.map((num) => {
          // Simple logic to show limited pages if too many, for now showing all as per original code but styled better
          // Ideally implement ellipsis logic for > 10 pages
          if (totalPages > 7 && Math.abs(currentPage - num) > 2 && num !== 1 && num !== totalPages) {
            if (Math.abs(currentPage - num) === 3) return <span key={num} className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>;
            return null;
          }

          return (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-all
                    ${currentPage === num
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600"}`}
            >
              {num}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const CataloguePage = () => {
  const params = useParams();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Filters State
  const [filters, setFilters] = useState({
    category: params.id || '',
    search: '',
    priceMin: '',
    priceMax: '',
    location: '',
    sort: 'latest',
  });

  // Dynamic Filters State
  const [dynamicFilters, setDynamicFilters] = useState({});

  // Derived state: Get current category object to know form_data
  const selectedCategory = categories.find(c => c._id === filters.category);

  // Debunce Search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      if (res?.success) {
        setCategories(res.data);
      }
    };
    fetchCategories();
  }, []);

  // Update filters if URL param changes
  useEffect(() => {
    if (params.id) {
      setFilters(prev => ({ ...prev, category: params.id }));
      // Do NOT reset page here strictly, as it might conflict with other updates, distinct effect for page reset is better or handle in handler
      setDynamicFilters({});
    } else {
      // Only clear category if explicitly navigating to /catalogue without ID, handling this might be tricky if not careful
      // checking if currently has category but params has none -> clear it
      // But for now, let's trust the logic that if user clicks "All Categories" we navigate and this updates
      if (filters.category && !params.id) {
        setFilters(prev => ({ ...prev, category: '' }));
        setDynamicFilters({});
      }
    }
  }, [params.id]);


  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
        search: debouncedSearch,
      };

      // Add dynamic filters with prefix
      Object.keys(dynamicFilters).forEach(key => {
        if (dynamicFilters[key]) {
          queryParams[`filter_${key}`] = dynamicFilters[key];
        }
      });

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const res = await getAllProducts(queryParams);
      if (res?.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      } else {
        setProducts([]);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on dependencies (including dynamicFilters)
  useEffect(() => {
    // Reset page on filter change? Logic is handled in handlers usually, but here strict dependency
    fetchProducts();
  }, [pagination.currentPage, filters, debouncedSearch, dynamicFilters]);


  // Handlers
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBar />
      <MobileBottomNav />

      <div className="flex-1 max-w-[1280px] mx-auto px-4 py-8 w-full">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate('/catalogue')}>Catalogue</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{selectedCategory ? selectedCategory.title : 'All Categories'}</span>
        </div>

        {/* Page Title & Sort Head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {selectedCategory ? `${selectedCategory.title} for Sale` : 'Used Items for Sale'}
              <span className="text-gray-500 font-normal ml-2 text-lg">• {pagination.totalItems} Ads</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Find the best deals on {selectedCategory ? selectedCategory.title : 'items'} in your area.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, currentPage: 1 }))}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
              >
                <option value="latest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="price_low">Sort: Price Low to High</option>
                <option value="price_high">Sort: Price High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar - Filters */}
          <CatalogueSidebar
            filters={filters}
            setFilters={(newFilters) => {
              setFilters(newFilters);
              setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset page on filter change
            }}
            dynamicFilters={dynamicFilters}
            setDynamicFilters={(newDynFilters) => {
              setDynamicFilters(newDynFilters);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
            categories={categories}
            selectedCategory={selectedCategory}
            navigate={navigate}
          />

          {/* Main Content - Product List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 w-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 text-sm">Loading best deals for you...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {products.map((product) => (
                    <CatalogueProductCard
                      key={product._id}
                      product={product}
                      navigate={navigate}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 border-t border-gray-100">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-dashed border-gray-300 rounded-lg text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No matches found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                  We couldn't find any results allowing your criteria. Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setFilters({ category: '', search: '', priceMin: '', priceMax: '', location: '', sort: 'latest' });
                    setDynamicFilters({});
                    navigate('/catalogue');
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CataloguePage;