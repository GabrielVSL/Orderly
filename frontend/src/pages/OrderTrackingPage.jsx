import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardDocumentCheckIcon, 
  FireIcon, 
  ArchiveBoxIcon, 
  TruckIcon, 
  CheckBadgeIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';
import { PageLayout } from '../components/layout/PageLayout';
import { GlassCard } from '../components/common/GlassCard';
import { CardHeader } from '../components/common/CardHeader';
import { formatCurrency } from '../utils/formatCurrency';
import api from '../services/api';
import toast from 'react-hot-toast';

const STAGES = [
  { id: 'received', title: 'Pedido Recebido', description: 'Confirmado no caixa do Patties', icon: ClipboardDocumentCheckIcon },
  { id: 'preparing', title: 'Na Chapa Quente', description: 'Smash burgers prensados com crostinha', icon: FireIcon },
  { id: 'packing', title: 'Embalando Combo', description: 'Batata skinny quentinha e refrigerante', icon: ArchiveBoxIcon },
  { id: 'delivering', title: 'Saiu para Entrega', description: 'O motoboy está a caminho da sua casa', icon: TruckIcon },
  { id: 'delivered', title: 'Entregue!', description: 'Bom apetite e aproveite seu Patties!', icon: CheckBadgeIcon },
];

export const OrderTrackingPage = () => {
  const { orderNumber } = useParams();
  
  const [order, setOrder] = useState(null);
  const [sessionOrders, setSessionOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (orderNumber) {
          const res = await api.get(`/orders/${orderNumber}`);
          setOrder(res.data);
        } else {
          const res = await api.get('/orders');
          setSessionOrders(res.data);
          if (res.data.length > 0) {
            setOrder(res.data[0]);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Pedido não encontrado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber]);

  // Demo simulator: advance to next stage
  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIndex = STAGES.findIndex(s => s.id === order.status);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      setIsUpdatingStatus(true);
      try {
        const res = await api.patch(`/orders/${order.orderNumber}/status`, {
          status: nextStage.id
        });
        setOrder(res.data);
        toast.success(`Etapa avançada para: ${nextStage.title}!`);
      } catch (err) {
        toast.error('Erro ao atualizar status.');
      } finally {
        setIsUpdatingStatus(false);
      }
    } else {
      // Loop back to received for re-testing
      setIsUpdatingStatus(true);
      try {
        const res = await api.patch(`/orders/${order.orderNumber}/status`, {
          status: 'received'
        });
        setOrder(res.data);
        toast.success('Status reiniciado para demonstração!');
      } catch {
        toast.error('Erro ao reiniciar status.');
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  const currentStageIndex = order ? STAGES.findIndex(s => s.id === order.status) : 0;

  return (
    <PageLayout center={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation link */}
        <div className="flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-brand-red transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Voltar ao Cardápio
          </Link>
          
          {sessionOrders.length > 1 && (
            <span className="text-xs font-bold text-gray-500">
              Você tem {sessionOrders.length} pedidos nesta sessão
            </span>
          )}
        </div>

        {isLoading ? (
          <GlassCard className="p-12 text-center text-gray-500 font-bold">
            Carregando informações do pedido...
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-8 text-center space-y-4">
            <span className="text-5xl block">🔍</span>
            <h3 className="text-xl font-black text-brand-dark">{error}</h3>
            <p className="text-sm text-gray-500">
              Verifique se o código do pedido está correto ou faça um novo pedido no cardápio.
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-2.5 bg-brand-red text-white font-bold rounded-full text-sm shadow hover:bg-red-700 transition-colors"
            >
              Fazer um Pedido
            </Link>
          </GlassCard>
        ) : order ? (
          <GlassCard className="overflow-hidden">
            <CardHeader
              icon={SparklesIcon}
              title={`Acompanhamento: #${order.orderNumber}`}
              description={`Pedido realizado em ${new Date(order.createdAt).toLocaleDateString('pt-BR')} às ${new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            />

            <div className="p-6 sm:p-8 space-y-8">

              {/* DEMO TOOLBAR FOR RECRUITERS */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-black uppercase text-brand-red tracking-wider block">
                    ⚡ Demonstração para Recrutadores & Tech Leads
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    Simule o fluxo de vida do pedido no backend avançando as etapas em tempo real:
                  </p>
                </div>

                <button
                  onClick={handleAdvanceStatus}
                  disabled={isUpdatingStatus}
                  className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:bg-gray-300 whitespace-nowrap cursor-pointer"
                >
                  {isUpdatingStatus ? 'Atualizando...' : currentStageIndex === STAGES.length - 1 ? '🔄 Reiniciar Etapas' : 'Avançar Próxima Etapa ➔'}
                </button>
              </div>

              {/* FOOD TRACKER STEPPER */}
              <div>
                <h3 className="font-black text-lg text-brand-dark mb-6">
                  Status da Entrega
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1.5 bg-gray-200 -translate-y-1/2 z-0" />
                  <div 
                    className="hidden md:block absolute top-1/2 left-8 h-1.5 bg-brand-red -translate-y-1/2 transition-all duration-500 z-0"
                    style={{ 
                      width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%` 
                    }}
                  />

                  {/* Stepper items */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const Icon = stage.icon;

                      return (
                        <div 
                          key={stage.id} 
                          className={`flex md:flex-col items-center gap-3 md:text-center p-3 rounded-2xl transition-all ${
                            isCurrent ? 'bg-red-50/80 border-2 border-brand-red shadow-sm' : 'bg-white/60'
                          }`}
                        >
                          <motion.div
                            animate={{ scale: isCurrent ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                              isCurrent
                                ? 'bg-brand-red text-brand-yellow'
                                : isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </motion.div>

                          <div className="min-w-0">
                            <h4 className={`text-sm font-black ${isCurrent ? 'text-brand-red' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {stage.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ORDER DETAILS & ITEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                
                {/* Items */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm uppercase tracking-wider text-gray-500">
                    Itens do Pedido ({order.items?.length || 0})
                  </h4>
                  
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-yellow-100 text-sm">
                        <div className="flex items-center gap-3">
                          {item.productImageUrl && (
                            <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div>
                            <span className="font-bold text-brand-dark block text-xs sm:text-sm">{item.productName}</span>
                            <span className="text-xs text-gray-400">{item.quantity}x • {formatCurrency(item.unitPrice)}</span>
                          </div>
                        </div>
                        <span className="font-black text-brand-dark text-xs sm:text-sm">
                          {formatCurrency(item.quantity * Number(item.unitPrice))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Financial summary */}
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-wider text-gray-500">
                    Detalhes da Entrega
                  </h4>

                  <div className="bg-white p-4 rounded-xl border border-yellow-100 space-y-2 text-xs sm:text-sm">
                    <p className="flex items-start gap-2 text-gray-700">
                      <MapPinIcon className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </p>
                    <p className="text-gray-500 pt-1">
                      Destinatário: <strong>{order.customerName}</strong> ({order.customerPhone})
                    </p>
                    {order.notes && (
                      <p className="text-gray-500 italic pt-1">
                        Obs: "{order.notes}"
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-yellow-100 space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxa de Entrega</span>
                      <span className="font-bold">{Number(order.deliveryFee) === 0 ? 'Grátis' : formatCurrency(order.deliveryFee)}</span>
                    </div>
                    {Number(order.discountAmount) > 0 && (
                      <div className="flex justify-between text-green-700 font-bold">
                        <span>Desconto ({order.couponCode})</span>
                        <span>-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-base font-black text-brand-dark">
                      <span>Total</span>
                      <span className="text-xl text-brand-red">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </GlassCard>
        ) : null}

      </div>
    </PageLayout>
  );
};

export default OrderTrackingPage;
