// src/components/MobileChatWidget.jsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { getHistory, sendMessage } from '../services/chat-api';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const MobileChatWidget = () => {
  const { chatState, updateMessages, updateText, closeChat } = useChat();
  const { activeChatId, messages, text, currentUserId, activeChat } = chatState;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      try {
        const data = await getHistory(activeChatId);
        updateMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (err) {
        console.error("Failed to load messages", err);
        toast.error("Failed to load chat history");
        updateMessages([]);
      }
    };

    loadMessages();
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Only show when a chat is active
  if (!activeChatId) return null;

  const handleSend = async () => {
    if (!text?.trim()) return;

    try {
      const newMessage = await sendMessage(activeChatId, text.trim());
      updateMessages(prev => [...prev, newMessage]);
      updateText("");
    } catch (err) {
      console.error("Send failed", err);
      toast.error("Message failed to send");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sellerName = activeChat?.product?.user?.full_name?.trim() || 'Seller';

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {/* Header */}
      <div className="bg-[#8069AE] text-white p-4 flex items-center">
        <button
          onClick={() => {
            // Close active chat → go back to sidebar
            // We don't close the entire sidebar, just clear active chat
            // But your context may use `closeChat` to do that — adjust if needed
            closeChat(); 
          }}
          className="mr-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">
            {(sellerName?.charAt(0) || 'S').toUpperCase()}
          </div>
          <span className="font-medium">{sellerName}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[calc(100vh-140px)] overflow-y-auto p-4 bg-purple-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            if (!msg || typeof msg.text !== 'string' || !msg.sender) return null;
            const isOwn = String(msg.sender) === String(currentUserId);
            return (
              <div
                key={msg._id || msg.createdAt}
                className={`mb-3 max-w-[80%] p-3 rounded-lg break-words ${
                  isOwn ? 'ml-auto bg-[#8069AE] text-white' : 'mr-auto bg-white text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-gray-200 flex">
        <input
          type="text"
          value={text || ''}
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3  border border-gray-300 rounded-l text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text?.trim()}
          className="bg-[#8069AE] text-white px-6 rounded-r hover:bg-purple-700 "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
        </button>
      </div>
    </div>
  );
};

export default MobileChatWidget;