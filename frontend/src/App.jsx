import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import HomePage from './pages/HomePage';
import SuccessPage from './pages/SuccessPage.jsx';
import Navbar from './components/layout/Navbar';
import CartModal from './components/CartModal';
import CheckoutPage from './pages/CheckoutPage';


function App() {
  const location = useLocation();

  return (
    <div className="App bg-brand-light min-h-screen">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'linear-gradient(to right, #A78BFA, #F472B6)',
            color: '#fff',
          },
        }}
      />
      
      <Navbar />
      
      <CartModal />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;