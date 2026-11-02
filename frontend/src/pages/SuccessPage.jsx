import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti'; 
import { 
  ClockIcon, 
  QrCodeIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  TicketIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';
import { useOrderTracking } from '../context/OrderTrackingContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Barcode = ({ className = 'h-5' }) => (
  <div
    aria-hidden="true"
    className={`w-full opacity-65 ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(to right, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 11px, transparent 11px, transparent 13px, currentColor 13px, currentColor 14px, transparent 14px, transparent 17px)',
    }}
  />
);

export function SuccessPage() { 
  const location = useLocation();
  const navigate = useNavigate();
  const { trackOrder } = useOrderTracking();

  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);
  const [copied, setCopied] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Se a página for recarregada (F5), recupera o pedido ativo real do localStorage
  useEffect(() => {
    if (order) {
      trackOrder(order.orderNumber);
      return;
    }

    const savedOrderNumber = localStorage.getItem('patties_active_order');
    if (!savedOrderNumber) {
      navigate('/orders', { replace: true });
      return;
    }

    api.get(`/orders/${savedOrderNumber}`)
      .then((res) => {
        setOrder(res.data);
        trackOrder(res.data.orderNumber);
      })
      .catch(() => {
        navigate('/orders', { replace: true });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [order, navigate, trackOrder]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-[#E4DFD5] text-[#141413] flex items-center justify-center p-4">
        <div className="bg-[#F3EFE6] border border-[#141413]/25 p-8 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#D71920] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold">Localizando comanda...</p>
        </div>
      </div>
    );
  }

  const orderNumber = order.orderNumber;
  const amountStr = Number(order.totalAmount || 0).toFixed(2);
  const amountLen = String(amountStr.length).padStart(2, '0');
  const pixCode = `00020126580014br.gov.bcb.pix0136${orderNumber}-patties-burger52040000530398654${amountLen}${amountStr}5802BR5914PATTIES BURGER6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX Copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] flex items-center justify-center py-12 px-4 selection:bg-[#D71920] selection:text-white">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={250}
        gravity={0.2}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-[#F3EFE6] border border-[#141413]/25 shadow-xl p-6 sm:p-10 text-center space-y-6"
      >
        <Barcode className="h-6 text-[#141413]/40 max-w-xs mx-auto" />

        {/* Vintage Stamp Header */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1">
            ★ PATTIES DIRECT • COMANDA EMITIDA ★
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight">
            Pedido Confirmado!
          </h1>
          <p className="font-mono text-xs text-[#141413]/70 mt-2 leading-relaxed">
            A chapa já está quente a 250°C e sua comanda foi enviada diretamente para a cozinha do Patties.
          </p>
        </div>

        {/* Ticket Box */}
        <div className="bg-[#FAF7F2] border border-[#141413]/20 p-5 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#141413]/60 block">
            Código da Comanda
          </span>
          <p className="font-mono text-3xl sm:text-4xl font-bold text-[#D71920] tracking-tight">
            #{orderNumber}
          </p>

          <div className="pt-3 border-t border-[#141413]/10 font-mono text-xs flex justify-between items-center text-[#141413]/80">
            <span>Total: <strong className="text-[#141413] font-bold">{formatCurrency(order.totalAmount)}</strong></span>
            <span>Método: <strong className="uppercase text-[#141413] font-bold">{order.paymentMethod}</strong></span>
          </div>
        </div>

        {/* PIX Quick Pay Card */}
        {order.paymentMethod === 'pix' && (
          <div className="bg-[#FAF7F2] border border-[#141413]/20 p-5 text-left space-y-2.5">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="w-4 h-4 text-[#D71920]" />
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#141413]">
                Pagamento via PIX Copia e Cola
              </h4>
            </div>
            
            <p className="font-mono text-[11px] text-[#141413]/70">
              Copie o código PIX abaixo e cole no app do seu banco para confirmação imediata:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pixCode}
                className="w-full bg-[#F3EFE6] border border-[#141413]/25 text-[#141413] text-[10px] p-2.5 font-mono truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyPix}
                className="px-4 py-2 bg-[#FEDB00] hover:bg-[#f5d000] text-[#141413] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <DocumentDuplicateIcon className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            to={`/orders/${orderNumber}`}
            className="w-full py-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <ClockIcon className="w-4 h-4 text-[#FEDB00]" />
            <span>Acompanhar Comanda ao Vivo no Mapa ➔</span>
          </Link>
          
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/orders"
              className="py-3 bg-[#141413] hover:bg-black text-[#FEDB00] font-mono font-bold text-[11px] uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-1.5 border border-[#FEDB00]/30"
            >
              <TicketIcon className="w-3.5 h-3.5" />
              <span>Minhas Comandas</span>
            </Link>

            <Link
              to="/order"
              className="py-3 bg-white hover:bg-[#FAF7F2] text-[#141413] font-mono font-bold text-[11px] uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-1.5 border border-[#141413]/20"
            >
              <span>Pedir Novamente</span>
              <ArrowRightIcon className="w-3 h-3 text-[#141413]/60" />
            </Link>
          </div>
        </div>

        <Barcode className="h-4 text-[#141413]/30 max-w-xs mx-auto" />
      </motion.div>
    </div>
  );
}

export default SuccessPage;
