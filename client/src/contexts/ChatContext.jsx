// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getMyChats, markAsRead } from '../services/chat-api';
import { useSocket } from './SocketContext';
import { toast } from 'sonner';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const socket = useSocket();
    const [chatState, setChatState] = useState({
        isSidebarOpen: false,
        isMinimized: false,
        chats: [],
        activeChatId: null,
        currentUserId: null,
        messages: [],
        text: '',
        isTyping: false,
        typingUser: null
    });

    // activeChatIdRef for using inside socket callbacks
    const activeChatIdRef = useRef(chatState.activeChatId);
    const currentUserIdRef = useRef(chatState.currentUserId);

    useEffect(() => {
        activeChatIdRef.current = chatState.activeChatId;
        currentUserIdRef.current = chatState.currentUserId;
    }, [chatState.activeChatId, chatState.currentUserId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (message) => {
            const currentActiveId = activeChatIdRef.current;

            // 1. Update messages if chat is open
            if (currentActiveId === message.chatId) {
                setChatState(prev => ({
                    ...prev,
                    messages: [...prev.messages, message]
                }));
                // Mark as read immediately if window is focused? 
                // For now, simpler to just append.
            }

            // 2. Update chat list (last message, move to top, unread count)
            setChatState(prev => {
                const newChats = [...prev.chats];
                const chatIndex = newChats.findIndex(c => c._id === message.chatId);

                if (chatIndex > -1) {
                    const updatedChat = {
                        ...newChats[chatIndex],
                        lastMessage: message.text,
                        lastMessageAt: message.createdAt
                    };

                    // Increment unread count if not active
                    if (currentActiveId !== message.chatId) {
                        const myId = currentUserIdRef.current;
                        if (myId) {
                            // Clone unreadCount or create new
                            const currentUnread = updatedChat.unreadCount || {};
                            // We update OUR unread count
                            const myUnreadCount = (currentUnread[myId] || 0) + 1;
                            updatedChat.unreadCount = { ...currentUnread, [myId]: myUnreadCount };
                        }
                    }

                    newChats.splice(chatIndex, 1);
                    newChats.unshift(updatedChat);
                }

                return { ...prev, chats: newChats };
            });

            if (currentActiveId !== message.chatId) {
                toast.info(`New message from ${message.sender?.full_name || 'User'}`);
            }
        });

        socket.on("typing", (chatId) => {
            if (activeChatIdRef.current === chatId) {
                setChatState(prev => ({ ...prev, isTyping: true }));
            }
        });

        socket.on("stop_typing", (chatId) => {
            if (activeChatIdRef.current === chatId) {
                setChatState(prev => ({ ...prev, isTyping: false }));
            }
        });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, [socket]);

    const loadChats = async () => {
        try {
            const data = await getMyChats();
            setChatState(prev => ({
                ...prev,
                chats: data.chats || [],
                currentUserId: data.currentUserId
            }));

            // Join socket room
            if (socket && data.currentUserId) {
                // The server automatically joins user room on connection based on session.
                // So we don't need to manually emit join unless custom logic.
            }
        } catch (err) {
            console.error("Failed to load chats", err);
        }
    };

    const openChat = async (data) => {
        setChatState(prev => ({
            ...prev,
            activeChatId: data.chatId,
            isMinimized: false,
            text: data.initialText || prev.text // Use initialText if provided, otherwise keep existing
        }));

        if (socket) {
            socket.emit("join_chat", data.chatId);
        }

        try {
            await markAsRead(data.chatId);
            setChatState(prev => {
                const newChats = prev.chats.map(c => {
                    if (c._id === data.chatId) {
                        const currentUserId = prev.currentUserId;
                        // Handle Map or Object structure of unreadCount
                        let newUnread = { ...(c.unreadCount || {}) };
                        if (currentUserId) newUnread[currentUserId] = 0;

                        return { ...c, unreadCount: newUnread };
                    }
                    return c;
                });
                return { ...prev, chats: newChats };
            });
        } catch (e) { console.error(e) }
    };

    const closeChat = () => {
        if (socket && chatState.activeChatId) {
            socket.emit("leave_chat", chatState.activeChatId);
        }
        setChatState(prev => ({
            ...prev,
            isSidebarOpen: false,
            activeChatId: null,
            messages: [],
            text: '',
            isMinimized: false // Reset minimize as well
        }));
    };

    // New function to ONLY close sidebar but keep chat widget open
    const closeSidebar = () => {
        setChatState(prev => ({
            ...prev,
            isSidebarOpen: false
        }));
    };

    const toggleSidebar = async () => {
        setChatState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
        if (!chatState.isSidebarOpen) {
            await loadChats();
        }
    };

    const appendMessage = (message) => {
        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, message]
        }));
    };


    const toggleMinimize = () => {
        setChatState(prev => ({
            ...prev,
            isMinimized: !prev.isMinimized
        }));
    };

    const setActiveChat = (chat) => {
        openChat({
            chatId: chat._id,
            user: chat.buyer === chatState.currentUserId ? chat.seller : chat.buyer, // logic might vary
            product: chat.product,
            currentUserId: chatState.currentUserId,
        });
    };

    const updateMessages = (newMessages) => {
        setChatState(prev => ({ ...prev, messages: newMessages || [] }));
    };

    const updateText = (text) => {
        setChatState(prev => ({ ...prev, text }));

        // Emit typing
        if (socket && chatState.activeChatId) {
            socket.emit("typing", chatState.activeChatId);

            // Debounce stop typing?
            // Simple implementation in component usually better but we can put helper here
        }
    };

    return (
        <ChatContext.Provider value={{
            chatState,
            openChat,
            closeChat,
            closeSidebar,
            toggleSidebar,
            toggleMinimize,
            setActiveChat,
            updateMessages,
            updateText,
            appendMessage,
            loadChats
        }}>
            {children}
        </ChatContext.Provider>
    );
};