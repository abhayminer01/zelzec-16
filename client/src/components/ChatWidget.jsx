// src/components/ChatWidget.jsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { getHistory, sendMessage } from '../services/chat-api';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react'; // ✅ Add back icon

const ChatWidget = () => {
    const { chatState, updateMessages, updateText, closeChat, toggleMinimize, appendMessage } = useChat();
    const { activeChatId, messages, text, currentUserId, isMinimized, chats } = chatState;
    const messagesEndRef = useRef(null);
    const scrollRef = useRef(null); // Ref for scroll container

    const scrollToBottom = (behavior = "auto") => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            scrollRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: behavior
            });
        }
    };

    // Find active chat details
    const activeChat = chats.find(c => c._id === activeChatId);
    const otherUser = activeChat?.buyer?._id === currentUserId ? activeChat?.seller : activeChat?.buyer;
    const sellerName = otherUser?.full_name || "User";
    const sellerAvatar = otherUser?.avatar;

    useEffect(() => {
        if (!activeChatId) {
            updateMessages([]);
            updateText("");
            return;
        }

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
        if (!isMinimized) {
            // Wait for transition/render
            setTimeout(() => {
                scrollToBottom("auto");
            }, 100);
        }
    }, [isMinimized, activeChatId, messages.length]); // Scroll on new messages count change too?

    // Separate effect for new messages to be smooth?
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom("smooth");
        }
    }, [messages]);

    if (!activeChatId) return null;

    const handleSend = async () => {
        if (!text?.trim()) return;

        try {
            const newMessage = await sendMessage(activeChatId, text.trim());

            // Fix: Use appendMessage which handles state update correctly
            if (newMessage) {
                appendMessage(newMessage);
                updateText("");
            }
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

    return (
        <>
            {/* Desktop Version (md and up) */}
            <div className={`fixed bottom-5 right-5 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[99] transition-all duration-300 hidden md:block ${isMinimized ? 'h-10' : 'h-96'}`}>
                <div className="bg-[#8069AE] text-white p-2 py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {sellerAvatar ? (
                            <img src={sellerAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs">{sellerName.charAt(0)}</div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-medium truncate max-w-[150px] text-sm leading-tight">{sellerName}</span>
                            {activeChat?.product && (
                                <span className="text-[10px] text-purple-100 truncate max-w-[180px]">
                                    {activeChat.product.title} • {activeChat.product.category?.title}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={toggleMinimize}
                            className="text-white hover:bg-purple-700 p-1 rounded"
                            title={isMinimized ? "Restore" : "Minimize"}
                        >
                            {isMinimized ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={closeChat}
                            className="text-white hover:bg-purple-700 p-1 rounded"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        <div
                            ref={scrollRef}
                            className="p-3 h-64 overflow-y-auto bg-purple-50"
                        >
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No messages yet.</p>
                            ) : (
                                messages.map((msg) => {
                                    if (!msg || (!msg.text && typeof msg.text !== 'string') || !msg.sender) return null;

                                    // Handle populated sender object or ID string
                                    const senderId = msg.sender._id ? msg.sender._id : msg.sender;
                                    const isOwn = String(senderId) === String(currentUserId);

                                    return (
                                        <div
                                            key={msg._id || msg.createdAt}
                                            className={`mb-2 max-w-[80%] p-2 rounded-lg break-words ${isOwn ? 'ml-auto bg-[#8069AE] text-white' : 'mr-auto bg-[#EFEAF9] text-gray-800'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />

                            {/* Typing Indicator */}
                            {chatState.isTyping && (
                                <div className="ml-2 mb-2 text-xs text-gray-400 italic">
                                    {sellerName} is typing...
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-200 flex items-end">
                            <textarea
                                value={text || ''}
                                onChange={(e) => {
                                    updateText(e.target.value);
                                    // Auto-resize
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                        // Reset height
                                        e.target.style.height = 'auto';
                                    }
                                }}
                                placeholder="Type a message..."
                                rows={1}
                                className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none overflow-hidden max-h-[100px] text-sm"
                                style={{
                                    minHeight: '38px' // Match typical input height
                                }}
                            />
                            <button
                                onClick={() => {
                                    handleSend();
                                    // We can't easily reset height here without ref, but text clear will shrink it on next render if value binding works well? 
                                    // Actually height persists in style. We might need a ref if we want perfect reset, but normally text="" shrinks it? 
                                    // No, style.height overrides. 
                                    // Let's rely on the value update triggering a re-render or just standard behavior.
                                    // Better: We can just manually reset in onChange if empty, but button click is outside.
                                    // Let's use a key or ref approach if needed. For now simple.
                                    // Actually, let's use a ref for the textarea to reset height on send.
                                }}
                                disabled={!text?.trim()}
                                className="bg-[#8069AE] text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 ml-2 mb-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2L11 13" />
                                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Full-Screen Version (hidden on md and up) */}
            <div className="fixed inset-0 z-[100] bg-white md:hidden">
                {/* Header */}
                <div className="bg-[#8069AE] text-white p-4 flex items-center">
                    <button
                        onClick={closeChat} // ✅ Back button closes chat
                        className="mr-3"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        {sellerAvatar ? (
                            <img src={sellerAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">{sellerName.charAt(0)}</div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-medium truncate">{sellerName}</span>
                            {activeChat?.product && (
                                <span className="text-xs text-purple-100 truncate">
                                    {activeChat.product.title} • {activeChat.product.category?.title}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[calc(100vh-140px)] overflow-y-auto p-4 bg-purple-50">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No messages yet.</p>
                    ) : (
                        messages.map((msg) => {
                            if (!msg || (!msg.text && typeof msg.text !== 'string') || !msg.sender) return null;

                            const senderId = msg.sender._id ? msg.sender._id : msg.sender;
                            const isOwn = String(senderId) === String(currentUserId);

                            return (
                                <div
                                    key={msg._id || msg.createdAt}
                                    className={`mb-3 max-w-[80%] p-3 rounded-lg break-words ${isOwn ? 'ml-auto bg-[#8069AE] text-white' : 'mr-auto bg-[#EFEAF9] text-gray-800'
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
                <div className="p-3 border-t border-gray-200 flex items-end">
                    <textarea
                        value={text || ''}
                        onChange={(e) => {
                            updateText(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                                e.target.style.height = 'auto';
                            }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none text-sm resize-none overflow-hidden max-h-[120px]"
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text?.trim()}
                        className="bg-[#8069AE] text-white p-3 rounded-full hover:bg-purple-700 disabled:opacity-50 ml-2 mb-[2px]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" />
                            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;