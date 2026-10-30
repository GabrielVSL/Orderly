import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import HomePage from './pages/HomePage';
import SuccessPage from './pages/SuccessPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartModal from './components/CartModal';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

function App() {
  const location = useLocation();

  return (
    <div className="App bg-brand-cream min-h-screen flex flex-col justify-between">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1B18',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '16px',
            border: '2px solid #FFC72C',
          },
        }}
      />
      
      <div>
        <Navbar />
        <CartModal />

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} /> 
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/orders" element={<OrderTrackingPage />} />
              <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
