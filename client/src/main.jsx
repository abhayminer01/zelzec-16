// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { SellProvider } from './contexts/SellContext';
import { ChatProvider } from './contexts/ChatContext';
import { SocketProvider } from './contexts/SocketContext';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';

import ChatSidebar from './components/ChatSidebar';
import ChatWidget from './components/ChatWidget';
import CataloguePage from './pages/CataloguePage';
import MobileChatSidebar from './components/MobileChatSidebar';
import MobileChatWidget from './components/MobileChatWidget';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
      <AuthProvider>
        <SellProvider>
          <SocketProvider>
            <ChatProvider>
              <Router>
                <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/product/:id' element={<ProductPage />} />
                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path='/catalogue' element={<CataloguePage />} />
                  <Route path='/category/:id' element={<CataloguePage />} />
                </Routes>
                <div className="hidden md:block">
                  <ChatWidget />
                  <ChatSidebar />
                </div>

                <div className="block md:hidden">
                  <MobileChatSidebar />
                  <MobileChatWidget />
                </div>
              </Router>
            </ChatProvider>
          </SocketProvider>
        </SellProvider>
      </AuthProvider>
    </ModalProvider>
  </StrictMode>
);