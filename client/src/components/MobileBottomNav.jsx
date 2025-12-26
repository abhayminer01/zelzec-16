// src/components/MobileBottomNav.jsx
import React from 'react';
import { Home, Search, Plus, MessageCircle, Menu } from 'lucide-react';
import { useSell } from '../contexts/SellContext';
import { useChat } from '../contexts/ChatContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileBottomNav() {
  const { nextStep } = useSell();
  const { toggleSidebar, closeChat } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  // Close chat and navigate with small delay to ensure UI updates
  const navigateAndCloseChat = (path) => {
    closeChat();
    setTimeout(() => {
      navigate(path);
    }, 100); // Small delay to let UI close
  };

  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/product')) return 'message';
    if (location.pathname === '/search') return 'search';
    if (location.pathname === '/profile') return 'menu';
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className='fixed bottom-0 left-0 w-full h-16 bg-white border-t border-border flex justify-around items-center md:hidden z-50'>
      {/* Home */}
      <button 
        onClick={() => navigateAndCloseChat('/')}
        className='flex flex-col items-center justify-center flex-1'
      >
        <Home 
          className={`size-6 ${activeTab === 'home' ? 'text-primary' : 'text-gray-600'}`} 
        />
      </button>
      
      {/* Search */}
      <button 
        onClick={() => navigateAndCloseChat('/search')}
        className='flex flex-col items-center justify-center flex-1'
      >
        <Search 
          className={`size-6 ${activeTab === 'search' ? 'text-primary' : 'text-gray-600'}`} 
        />
      </button>
      
      {/* Sell / Post Ad */}
      <button 
        onClick={() => {
          closeChat();
          setTimeout(() => nextStep(), 100);
        }}
        className='flex flex-col items-center justify-center flex-1'
      >
        <div className='bg-black rounded-lg p-2'>
          <Plus className='text-white size-6' />
        </div>
      </button>
      
      {/* Messages */}
      <button 
        onClick={toggleSidebar}
        className='flex flex-col items-center justify-center flex-1'
      >
        <MessageCircle 
          className={`size-6 ${activeTab === 'message' ? 'text-primary' : 'text-gray-600'}`} 
        />
      </button>
      
      {/* Menu / Profile */}
      <button 
        onClick={() => navigateAndCloseChat('/profile')}
        className='flex flex-col items-center justify-center flex-1'
      >
        <Menu 
          className={`size-6 ${activeTab === 'menu' ? 'text-primary' : 'text-gray-600'}`} 
        />
      </button>
    </div>
  );
}