import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentCheckIcon, 
  FireIcon, 
  ArchiveBoxIcon, 
  TruckIcon, 
  CheckBadgeIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  MapPinIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { PageLayout } from '../components/layout/PageLayout';
import { GlassCard } from '../components/common/GlassCard';
import { formatCurrency } from '../utils/formatCurrency';
import api from '../services/api';
import toast from 'react-hot-toast';

const STAGES = [
  { id: 'received', title: 'Pedido Recebido', stamp: 'NO CAIXA', description: 'Confirmado no caixa do Patties', icon: ClipboardDocumentCheckIcon },
  { id: 'preparing', title: 'Na Chapa Quente', stamp: 'NA CHAPA', description: 'Smash burgers prensados com crostinha', icon: FireIcon },
  { id: 'packing', title: 'Embalando Combo', stamp: 'EMBALANDO', description: 'Batata skinny quentinha e refrigerante', icon: ArchiveBoxIcon },
  { id: 'delivering', title: 'Saiu para Entrega', stamp: 'A CAMINHO', description: 'O motoboy está a caminho da sua casa', icon: TruckIcon },
  { id: 'delivered', title: 'Entregue!', stamp: 'ENTREGUE', description: 'Bom apetite e aproveite seu Patties!', icon: CheckBadgeIcon },
];

export const OrderTrackingPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [sessionOrders, setSessionOrders] = useState([]);
  const [searchCode, setSearchCode] = useState('');
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
          // Busca pedidos desta sessão de visitante
          const res = await api.get('/orders');
          setSessionOrders(res.data);
          if (res.data && res.data.length > 0) {
            setOrder(res.data[0]);
          } else {
            setOrder(null);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Pedido não localizado com este código.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber]);

  const handleSearchOrder = (e) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    if (!clean) return;
    navigate(`/orders/${clean}`);
  };

  const handleSelectOrder = async (selectedOrderNumber) => {
    navigate(`/orders/${selectedOrderNumber}`);
  };

  const handleAdvanceStatus = async () => {
    if (!order) return;
    
    const currentIndex = STAGES.findIndex(s => s.id === order.status);
    let nextStageId = 'received';
    
    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      nextStageId = STAGES[currentIndex + 1].id;
    } else {
      nextStageId = 'received';
    }

    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/orders/${order.orderNumber}/status`, {
        status: nextStageId
      });
      setOrder(res.data.order);
      toast.success(`Comanda atualizada: ${STAGES.find(s => s.id === nextStageId)?.title}`);
    } catch {
      toast.error('Falha ao atualizar status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const currentStageIndex = order ? STAGES.findIndex(s => s.id === order.status) : 0;
  const currentStage = STAGES[currentStageIndex] || STAGES[0];

  return (
    <PageLayout center={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-black text-neutral-800 hover:text-patties-red uppercase tracking-wider bg-white px-4 py-2 rounded-xl border border-neutral-200/80 shadow-soft transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar ao Cardápio
          </Link>

          {order && (
            <span className="bg-[#F8F5EE] text-neutral-900 border border-neutral-300 font-mono font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-soft">
              TICKET #{order.orderNumber}
            </span>
          )}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <GlassCard className="p-12 text-center space-y-4">
            <span className="text-4xl animate-bounce block">🍔</span>
            <p className="font-black text-neutral-800 uppercase tracking-wider">Consultando a Chapa do Patties...</p>
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-8 text-center space-y-4">
            <span className="text-5xl block">🔍</span>
            <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">{error}</h3>
            <p className="text-sm font-medium text-neutral-500 max-w-md mx-auto">
              Verifique se o código do pedido está correto (ex: PAT-1234) ou faça um novo pedido pelo cardápio.
            </p>

            {/* Quick search input */}
            <form onSubmit={handleSearchOrder} className="max-w-md mx-auto flex gap-2 pt-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ex: PAT-8492"
                className="flex-1 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold uppercase focus:outline-none focus:border-patties-red"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-patties-red text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-badge-red cursor-pointer"
              >
                Buscar
              </button>
            </form>

            <div className="pt-2">
              <Link 
                to="/" 
                className="inline-block px-6 py-2.5 text-patties-red font-black uppercase text-xs hover:underline"
              >
                ← Voltar para o Cardápio
              </Link>
            </div>
          </GlassCard>
        ) : !order ? (
          /* Empty State for Visitors who haven't ordered yet */
          <GlassCard className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-patties-yellow/30 text-patties-red rounded-2xl flex items-center justify-center mx-auto shadow-soft">
              <ClipboardDocumentCheckIcon className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-patties-red block mb-1">
                ★ PATTIES DIRECT • RASTREAMENTO ★
              </span>
              <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-2">
                Acompanhe seu Pedido
              </h2>
              <p className="text-sm font-medium text-neutral-600 max-w-md mx-auto leading-relaxed">
                No <strong>Patties Direct</strong> você não precisa criar conta com login e senha. Se você já tem um pedido em andamento, digite o código da comanda abaixo para ver o status na chapa ao vivo:
              </p>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearchOrder} className="max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <MagnifyingGlassIcon className="h-5 w-5 text-patties-red" />
                </div>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Código da comanda (ex: PAT-1234)"
                  className="w-full pl-11 pr-3 py-3.5 bg-neutral-50 border border-neutral-200/80 focus:border-patties-red rounded-xl text-sm font-mono font-bold uppercase focus:outline-none shadow-soft"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-patties-red hover:bg-patties-red-dark text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-badge-red transition-all cursor-pointer"
              >
                Rastrear
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-100 flex flex-col items-center gap-3">
              <span className="text-xs text-neutral-400 font-bold">
                Ainda não fez seu pedido hoje?
              </span>
              <Link 
                to="/" 
                className="px-6 py-3 bg-patties-yellow hover:bg-patties-yellow-warm text-neutral-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-soft hover:shadow-elevated transition-all"
              >
                Ir para o Cardápio e Fazer Pedido
              </Link>
            </div>
          </GlassCard>
        ) : (
          /* Vintage Kitchen Ticket Container */
          <div className="relative bg-white rounded-2xl border border-neutral-200/80 shadow-elevated overflow-hidden">
            
            {/* Header Ticket Strip */}
            <div className="p-6 sm:p-8 bg-neutral-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-patties-yellow block">
                  ★ PATTIES DIRECT • COMANDA DE CHAPA ★
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-mono">
                  #{order.orderNumber}
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Emitido em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Rubber Stamp Visual */}
              <div className="px-4 py-2 border-2 border-dashed border-patties-yellow text-patties-yellow rounded-lg rotate-[-3deg] select-none font-black text-xs sm:text-sm tracking-widest uppercase">
                [ STATUS: {currentStage.stamp} ]
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">

              {/* RECRUITER DEMO TOOLBAR */}
              <div className="bg-[#F8F5EE] border border-neutral-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-black uppercase text-patties-red tracking-wider block">
                    ⚡ Demonstração para Recrutadores & Tech Leads
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-700 font-bold">
                    Avance a etapa da comanda no backend em tempo real com transação Sequelize:
                  </p>
                </div>

                <button
                  onClick={handleAdvanceStatus}
                  disabled={isUpdatingStatus}
                  className="px-5 py-2.5 bg-patties-red hover:bg-patties-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-badge-red active:scale-95 disabled:bg-neutral-300 transition-all cursor-pointer whitespace-nowrap"
                >
                  {isUpdatingStatus ? 'Atualizando...' : currentStageIndex === STAGES.length - 1 ? '🔄 Reiniciar Ciclo' : 'Avançar Próxima Etapa ➔'}
                </button>
              </div>

              {/* FOOD TRACKER STEPPER */}
              <div>
                <h3 className="font-black text-xl text-neutral-900 uppercase tracking-tight mb-6">
                  Ciclo de Preparo e Entrega
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const Icon = stage.icon;

                    return (
                      <div 
                        key={stage.id} 
                        className={`flex md:flex-col items-center gap-3 md:text-center p-3.5 rounded-xl border transition-all ${
                          isCurrent 
                            ? 'bg-red-50/50 border-patties-red shadow-soft' 
                            : isCompleted
                            ? 'bg-white border-neutral-200/80 text-neutral-800'
                            : 'bg-neutral-50/50 border-neutral-100 opacity-50'
                        }`}
                      >
                        <motion.div
                          animate={{ scale: isCurrent ? [1, 1.06, 1] : 1 }}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 2.2 }}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft ${
                            isCurrent
                              ? 'bg-patties-red text-patties-yellow shadow-badge-red'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>

                        <div className="min-w-0">
                          <h4 className={`text-xs sm:text-sm font-black uppercase tracking-tight ${isCurrent ? 'text-patties-red' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {stage.title}
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-medium leading-tight hidden sm:block mt-0.5">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ORDER DETAILS & ITEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dashed border-neutral-200">
                
                {/* Items */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-neutral-500">
                    Itens da Comanda ({order.items?.length || 0})
                  </h4>
                  
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-sm">
                        <div className="flex items-center gap-3">
                          {item.productImageUrl && (
                            <img src={item.productImageUrl} alt={item.productName} className="w-11 h-11 rounded-lg object-cover bg-white border border-neutral-200/80" />
                          )}
                          <div>
                            <span className="font-black text-neutral-900 block text-xs sm:text-sm uppercase">{item.productName}</span>
                            <span className="text-xs font-bold text-neutral-400">{item.quantity}x • {formatCurrency(item.unitPrice)}</span>
                          </div>
                        </div>
                        <span className="font-black text-patties-red text-sm">
                          {formatCurrency(item.quantity * Number(item.unitPrice))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Financial summary */}
                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-wider text-neutral-500">
                    Dados de Entrega & Recibo
                  </h4>

                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-2.5 text-xs sm:text-sm font-bold">
                    <p className="flex items-start gap-2 text-neutral-700">
                      <MapPinIcon className="w-4 h-4 text-patties-red flex-shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </p>
                    
                    <p className="text-neutral-600">
                      Cliente: <strong className="text-neutral-900">{order.customerName}</strong> ({order.customerPhone})
                    </p>

                    {order.notes && (
                      <p className="text-xs text-neutral-600 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        Observação: "{order.notes}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-dashed border-neutral-200 space-y-1">
                      <div className="flex justify-between text-neutral-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      
                      {Number(order.discountAmount) > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Desconto ({order.couponCode})</span>
                          <span>-{formatCurrency(order.discountAmount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-neutral-500">
                        <span>Frete</span>
                        <span>{Number(order.deliveryFee) === 0 ? 'Grátis' : formatCurrency(order.deliveryFee)}</span>
                      </div>

                      <div className="flex justify-between text-base font-black text-neutral-900 pt-1.5 border-t border-neutral-200">
                        <span>Total Pago</span>
                        <span className="text-patties-red text-lg">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SESSION ORDER HISTORY */}
        {sessionOrders.length > 1 && (
          <GlassCard className="p-6">
            <h4 className="font-black text-sm uppercase tracking-wider text-neutral-500 mb-4">
              Outros Pedidos Desta Sessão
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sessionOrders.map((histOrder) => (
                <button
                  key={histOrder.id}
                  onClick={() => handleSelectOrder(histOrder.orderNumber)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    order?.orderNumber === histOrder.orderNumber 
                      ? 'border-patties-red bg-red-50/50 font-black shadow-soft' 
                      : 'border-neutral-200/80 bg-white hover:border-neutral-300 font-bold'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="uppercase font-mono">#{histOrder.orderNumber}</span>
                    <span className="text-patties-red">{formatCurrency(histOrder.totalAmount)}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1 capitalize">
                    Status: {STAGES.find(s => s.id === histOrder.status)?.title || histOrder.status}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        )}

      </div>
    </PageLayout>
  );
};

export default OrderTrackingPage;
