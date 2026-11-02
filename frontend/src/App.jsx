import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import HomePage from './pages/HomePage';
import OrderBuilderPage from './pages/OrderBuilderPage';
import SuccessPage from './pages/SuccessPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import OrderTopNotification from './components/OrderTopNotification';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const location = useLocation();

  // Scroll suave para links de âncora (#anatomia, #lojas, etc.) mesmo navegando de outras páginas (REV-05)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="App bg-[#E4DFD5] min-h-screen flex flex-col justify-between">
      <OrderTopNotification />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#141413',
            color: '#F5F1E8',
            fontFamily: '"JetBrains Mono", Courier, monospace',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            borderRadius: '0px',
            border: '1px solid rgba(254, 219, 0, 0.4)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            padding: '12px 18px',
          },
          success: {
            iconTheme: {
              primary: '#FEDB00',
              secondary: '#141413',
            },
          },
          error: {
            iconTheme: {
              primary: '#D71920',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <div>
        <Navbar />
        <CartModal />
        <AuthModal />

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} /> 
              <Route path="/order" element={<OrderBuilderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/orders" element={<OrderTrackingPage />} />
              <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
