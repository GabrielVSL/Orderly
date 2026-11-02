import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderTracking } from '../context/OrderTrackingContext';
import { XMarkIcon, ChevronRightIcon, BellAlertIcon } from '@heroicons/react/24/solid';

export function OrderTopNotification() {
  const { notification, dismissNotification } = useOrderTracking();
  const navigate = useNavigate();

  if (!notification) return null;

  const handleOpenTracking = () => {
    navigate(`/orders/${notification.orderNumber}`);
    dismissNotification();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -70, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0E132A] text-white border-b-2 border-[#FEDB00] shadow-2xl px-4 py-3"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Live Status Tag & Info */}
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-full bg-[#FEDB00] text-[#0E132A] flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
              <BellAlertIcon className="w-4 h-4 text-[#0E132A]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FEDB00] font-black">
                  STATUS ATUALIZADO • COMANDA #{notification.orderNumber}
                </span>
                <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[#2F66FF] text-white rounded-xs">
                  {notification.stamp}
                </span>
              </div>
              <p className="font-serif text-sm text-white font-bold truncate">
                {notification.title}: <span className="font-sans font-normal text-xs text-white/80">{notification.desc}</span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleOpenTracking}
              className="px-3.5 py-1.5 bg-[#2F66FF] hover:bg-[#2554d9] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <span>Acompanhar no Mapa</span>
              <ChevronRightIcon className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismissNotification}
              className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Fechar notificação"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderTopNotification;
