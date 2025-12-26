// src/components/NavBar.jsx
import React, { useEffect, useState } from 'react';
import { MessageSquareText, Search, UserCircleIcon } from "lucide-react";
import { checkAuth } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useSell } from '../contexts/SellContext';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext'; // ✅ Import context

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { openLogin, openRegister } = useModal();
  const { nextStep } = useSell();
  const { toggleSidebar, chatState, loadChats } = useChat();

  useEffect(() => {
    fetchSessionData();
  }, []);

  const fetchSessionData = async () => {
    try {
      const res = await checkAuth();
      if (res?.success) {
        login();
        loadChats(); // ✅ Load chats instantly for unread count
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='w-screen h-16 bg-white  md:h-20 flex justify-center items-center gap-10 px-4 md:px-10 border-b border-border'>
        <div className='md:hidden w-full flex justify-center'>
          <img src="/images/logo.png" alt="Logo" className="h-8" />
        </div>

        <img src="/images/logo.png" alt="Logo" className="h-10 hidden md:block" />

        <div className='relative w-[750px] hidden md:block'>
          <input
            type="text"
            placeholder='Search'
            className='w-full bg-white h-10 rounded-lg pl-4 pr-10 border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all'
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
        </div>

        <div className='items-center gap-5 hidden md:flex'>
          {isAuthenticated ? (
            <>
              <button className='primarybutton' onClick={() => nextStep()}>Sell</button>
              <UserCircleIcon onClick={() => navigate('/profile')} className='text-primary size-8 cursor-pointer' />
              <div className="relative">
                <MessageSquareText
                  className="text-primary size-8 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSidebar();
                  }}
                />
                {(() => {
                  const { chats, currentUserId } = chatState || {};
                  if (!chats || !currentUserId) return null;

                  const totalUnread = chats.reduce((acc, chat) => {
                    const count = (chat.unreadCount && chat.unreadCount[currentUserId]) || 0;
                    return acc + count;
                  }, 0);

                  if (totalUnread === 0) return null;

                  return (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <>
              <button className='secondarybutton' onClick={openLogin}>Sign-In</button>
              <button className='primarybutton' onClick={openRegister}>Register</button>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex h-8 justify-center bg-[#F6F1FF]">
        <div className="flex gap-10 p-1">
          <a href="">Buy & Sell</a>
          <a href="">Vehicles</a>
          <a href="">Real Estate</a>
          <a href="">Jobs</a>
          <a href="">Services</a>
          <a href="">Mobile & Electronics</a>
          <a href="">Education</a>
          <a href="">Pets</a>
          <a href="">Matrimony</a>

        </div>
      </div>
    </>
  );
}