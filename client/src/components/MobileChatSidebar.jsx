// src/components/MobileChatSidebar.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import MobileBottomNav from './MobileBottomNav';

const MobileChatSidebar = () => {
  const { chatState, closeChat, setActiveChat } = useChat();
  const { isSidebarOpen, chats, currentUserId } = chatState;

  const [search, setSearch] = useState('');

  // Only show if sidebar is open AND no active chat
  if (!isSidebarOpen || chatState.activeChatId) return null;

  const filteredChats = chats.filter(chat => {
    const seller = chat.product?.user;
    const sellerName = seller?.full_name?.trim() || 'Seller';
    return sellerName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/50"
      onClick={closeChat}
    >
      <div 
        className="absolute inset-0 bg-[#F3F0FA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 pt-14 pb-3 border-b border-[#E6E0F5] bg-[#F3F0FA]">
          <h2 className="text-xl font-semibold text-[#7C5CB9]">Chats</h2>
          <div className="mt-3 relative">
            <input 
              type="text" 
              placeholder="Search Message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white h-12 rounded-lg pl-4 pr-10 border border-[#E6E0F5] focus:outline-none focus:ring-1 focus:ring-[#C8B6E2]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89BC8]" size={20} />
          </div>
        </div>
        
        {/* Chat List */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto p-4 space-y-3">
          {filteredChats.length === 0 ? (
            <p className="text-center text-[#A89BC8] text-sm py-4 mt-10">No chats found</p>
          ) : (
            filteredChats.map(chat => {
              const seller = chat.product?.user;
              const sellerName = seller?.full_name?.trim() || 'Seller';
              const preview = chat.latestMessage || 'No messages yet';
              const time = new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={chat._id} 
                  className="flex items-center p-4 rounded-lg hover:bg-[#EFEAF9] cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveChat(chat);
                  }}
                >
                  <img 
                    src={seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=8069AE&color=fff`} 
                    alt={sellerName} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#7C5CB9] truncate">{sellerName}</h3>
                        <p className="text-sm text-[#A89BC8] truncate">{preview}</p>
                      </div>
                      <span className="text-xs text-[#A89BC8] ml-2 whitespace-nowrap">{time}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <MobileBottomNav/>
    </div>
  );
};

export default MobileChatSidebar;