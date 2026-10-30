import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti'; 
import { 
  CheckCircleIcon, 
  HomeIcon, 
  ClockIcon, 
  QrCodeIcon, 
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import { Button } from '../components/common/Button';
import { PageLayout } from '../components/layout/PageLayout';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export const SuccessPage = () => { 
  const location = useLocation();
  const order = location.state?.order || null;
  const orderNumber = order?.orderNumber || 'PAT-' + Math.floor(1000 + Math.random() * 9000);

  const [copied, setCopied] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const fakePixCode = `00020126580014br.gov.bcb.pix0136${orderNumber}-patties-burger520400005303986540${order ? Number(order.totalAmount).toFixed(2) : '45.00'}5802BR5914PATTIES BURGER6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(fakePixCode);
    setCopied(true);
    toast.success('Código PIX Copia e Cola copiado com sucesso!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PageLayout center={true}>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.25}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="text-center max-w-lg w-full"
      >
        {/* Animated Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 220,
            damping: 12,
          }}
          className="mb-4"
        >
          <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500 drop-shadow-md" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-black mb-2 text-brand-dark"
        >
          Pedido Confirmado!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base text-gray-600 mb-6"
        >
          Obrigado pelo seu pedido no <strong>Patties Burger Direct</strong>! A chapa já está quente e estamos preparando tudo com carinho.
        </motion.p>

        {/* Order Number Card */}
        <GlassCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl mb-6 text-center" 
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Código do Pedido
          </span>
          <p className="text-3xl font-black text-brand-red tracking-tight mb-2">
            #{orderNumber}
          </p>

          {order && (
            <div className="pt-3 border-t border-yellow-100 text-xs text-gray-600 flex justify-between items-center">
              <span>Total Pago: <strong>{formatCurrency(order.totalAmount)}</strong></span>
              <span>Método: <strong className="uppercase">{order.paymentMethod}</strong></span>
            </div>
          )}
        </GlassCard>

        {/* PIX Quick Pay Card (if method is pix) */}
        {(!order || order.paymentMethod === 'pix') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-5 rounded-2xl border-2 border-yellow-300 shadow-sm mb-6 text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <QrCodeIcon className="w-5 h-5 text-brand-red" />
              <h4 className="font-black text-sm text-brand-dark">
                Pagamento via PIX Copia e Cola
              </h4>
            </div>
            
            <p className="text-xs text-gray-500 mb-3">
              Abra o app do seu banco, escolha <strong>PIX Copia e Cola</strong> e cole o código abaixo para aprovação instantânea:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={fakePixCode}
                className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-xs p-2.5 rounded-xl font-mono truncate"
              />
              <button
                onClick={handleCopyPix}
                className="px-4 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? <CheckIcon className="w-4 h-4 text-green-700" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Button as="Link" to={`/orders/${orderNumber}`} variant="primary">
            <ClockIcon className="mr-2 h-5 w-5 text-brand-yellow" />
            Acompanhar Status do Pedido ao Vivo
          </Button>
          
          <Button as="Link" to="/" variant="secondary">
            <HomeIcon className="mr-2 h-5 w-5" />
            Voltar ao Cardápio
          </Button>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default SuccessPage;
