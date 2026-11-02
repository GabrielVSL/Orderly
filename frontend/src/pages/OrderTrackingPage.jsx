import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentCheckIcon, 
  FireIcon, 
  ArchiveBoxIcon, 
  TruckIcon, 
  CheckBadgeIcon, 
  MapPinIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';
import { brandConfig } from '../config/brandConfig';
import { useAuth } from '../context/AuthContext';
import { useOrderTracking } from '../context/OrderTrackingContext';
import { DeliveryMap } from '../components/DeliveryMap';
import api from '../services/api';
import toast from 'react-hot-toast';

const Barcode = ({ className = 'h-6' }) => (
  <div
    aria-hidden="true"
    className={`w-full opacity-70 ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(to right, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 11px, transparent 11px, transparent 13px, currentColor 13px, currentColor 14px, transparent 14px, transparent 17px)',
    }}
  />
);

const STAGES = [
  { id: 'received', title: 'Pedido Recebido', stamp: 'NO CAIXA', description: 'Confirmado no caixa do Patties', icon: ClipboardDocumentCheckIcon },
  { id: 'preparing', title: 'Na Chapa Quente', stamp: 'NA CHAPA', description: 'Smash prensado com crostinha a 250°C', icon: FireIcon },
  { id: 'packing', title: 'Embalando Combo', stamp: 'EMBALANDO', description: 'Batata skinny quentinha e bebidas', icon: ArchiveBoxIcon },
  { id: 'delivering', title: 'Saiu p/ Entrega', stamp: 'A CAMINHO', description: 'Motoboy a caminho da sua mesa', icon: TruckIcon },
  { id: 'delivered', title: 'Entregue!', stamp: 'ENTREGUE', description: 'Bom apetite! Viva a experiência Patties', icon: CheckBadgeIcon },
];

export function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { activeOrder, trackOrder } = useOrderTracking();
  const isDebugMode = import.meta.env.DEV || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === '1');
  
  const [order, setOrder] = useState(null);
  const [sessionOrders, setSessionOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [routeMetrics, setRouteMetrics] = useState({
    remainingMin: 0,
    remainingKm: 0,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [orderNumber]);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);
      setIsForbidden(false);

      try {
        // 1. Sempre busca lista de comandas do usuário ou da sessão
        let ordersList = [];
        try {
          const listRes = await api.get('/orders');
          ordersList = listRes.data || [];
          setSessionOrders(ordersList);
        } catch {
          // segue normalmente
        }

        // 2. Se há orderNumber na URL, busca essa comanda específica para tracking
        if (orderNumber) {
          const res = await api.get(`/orders/${orderNumber}`);
          setOrder(res.data);
          trackOrder(res.data.orderNumber);
        } else {
          // Quando estiver em /orders (Hub), não seleciona comanda única para exibir a lista
          setOrder(null);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setIsForbidden(true);
          setError('Esta comanda é privada e pertence a outro usuário cadastrado.');
        } else {
          setError(err.response?.data?.message || 'Pedido não localizado com este código.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber, user, trackOrder]);

  // Sincroniza em tempo real com as atualizações centralizadas do OrderTrackingContext (evita polling duplicado)
  useEffect(() => {
    if (activeOrder && activeOrder.orderNumber === orderNumber) {
      setOrder(activeOrder);
    }
  }, [activeOrder, orderNumber]);

  const handleDeliveryCompleted = useCallback(async () => {
    if (!order || order.status === 'delivered') return;
    try {
      const res = await api.patch(`/orders/${order.orderNumber}/status`, {
        status: 'delivered',
      });
      setOrder(res.data.order || res.data);
      toast.success('Pedido entregue com sucesso! Bom apetite!');
    } catch {
      // segue silencioso
    }
  }, [order?.orderNumber, order?.status]);

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
      setOrder(res.data.order || res.data);
      toast.success(`Comanda atualizada: ${STAGES.find(s => s.id === nextStageId)?.title}`);
    } catch {
      toast.error('Falha ao atualizar status da comanda.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getDynamicETA = () => {
    if (!order) return '';
    if (order.status === 'delivered') return 'Concluído';
    if (order.status === 'delivering') {
      const min = routeMetrics?.remainingMin || 8;
      return `${min} min restantes`;
    }
    if (order.status === 'packing') return '~12 min (Embalando)';
    if (order.status === 'preparing') return '~18 min (Chapa quente)';
    return '~25 min (Confirmando no caixa)';
  };

  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 'delivering':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-[#2F66FF] border border-[#2F66FF]/30 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F66FF]" />
            </span>
            A Caminho
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-800 border border-emerald-600/30 font-mono text-[10px] font-bold uppercase tracking-wider">
            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
            Entregue
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-900 border border-amber-600/30 font-mono text-[10px] font-bold uppercase tracking-wider">
            <FireIcon className="w-3.5 h-3.5 text-amber-600" />
            Na Chapa
          </span>
        );
      case 'packing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 text-orange-900 border border-orange-600/30 font-mono text-[10px] font-bold uppercase tracking-wider">
            <ArchiveBoxIcon className="w-3.5 h-3.5 text-orange-600" />
            Embalando
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-900 border border-yellow-600/30 font-mono text-[10px] font-bold uppercase tracking-wider">
            <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-yellow-600" />
            No Caixa
          </span>
        );
    }
  };

  const currentStageIndex = order ? STAGES.findIndex(s => s.id === order.status) : 0;

  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] pb-24 selection:bg-[#D71920] selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 pt-6 sm:pt-8">
        
        {/* Editorial Top Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[#141413]/15">
          <div className="flex items-center gap-4">
            {orderNumber && (
              <Link 
                to="/orders" 
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D71920] hover:text-[#b8141a] transition-colors group"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Minhas Comandas</span>
              </Link>
            )}

            <Link 
              to="/order" 
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#141413]/70 hover:text-[#D71920] transition-colors group"
            >
              {!orderNumber && <span className="group-hover:-translate-x-1 transition-transform">←</span>}
              <span>Voltar ao Cardápio</span>
            </Link>
          </div>

          {!user && (
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer shadow-xs"
            >
              <span>Fazer Login</span>
              <span className="text-xs">➔</span>
            </button>
          )}
        </div>

        {/* ==================================================================== */}
        {/* CASO 1: LOADING STATE */}
        {/* ==================================================================== */}
        {isLoading ? (
          <div className="bg-[#F3EFE6] border border-[#141413]/20 p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 border-3 border-[#D71920] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#141413]/80 font-bold">
              Consultando a Chapa do Patties...
            </p>
          </div>
        ) : isForbidden ? (
          /* ==================================================================== */
          /* CASO 2: COMANDA PRIVADA DE OUTRO USUÁRIO */
          /* ==================================================================== */
          <div className="bg-[#F3EFE6] border border-[#D71920]/40 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-md">
            <Barcode className="h-6 text-[#141413]/40 max-w-xs mx-auto" />
            
            <div className="w-16 h-16 bg-[#141413] text-[#FEDB00] flex items-center justify-center mx-auto border border-[#FEDB00]/40">
              <LockClosedIcon className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1">
                ★ COMANDA PRIVADA &amp; PROTEGIDA ★
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#141413] tracking-tight mb-2">
                Acesso Restrito ao Titular da Comanda
              </h2>
              <p className="font-mono text-xs text-[#141413]/70 leading-relaxed max-w-md mx-auto">
                Esta comanda <strong>#{orderNumber}</strong> foi gerada por um usuário cadastrado. Para acompanhar o status, faça login com a conta correspondente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={openAuthModal}
                className="px-6 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Entrar com Minha Conta
              </button>
              
              <Link
                to="/orders"
                className="px-6 py-3.5 bg-[#141413] hover:bg-black text-[#FEDB00] font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Minhas Comandas
              </Link>
            </div>
          </div>
        ) : error ? (
          /* ==================================================================== */
          /* CASO 3: COMANDA NÃO ENCONTRADA */
          /* ==================================================================== */
          <div className="bg-[#F3EFE6] border border-[#D71920]/40 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-md">
            <Barcode className="h-6 text-[#141413]/40 max-w-xs mx-auto" />
            
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D71920] font-bold block mb-1">
                Comanda Não Localizada
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#141413] tracking-tight mb-2">
                {error}
              </h2>
              <p className="font-mono text-xs text-[#141413]/70 leading-relaxed max-w-md mx-auto">
                Verifique se o link da comanda está correto ou confira sua lista completa de comandas abaixo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link
                to="/orders"
                className="px-6 py-3.5 bg-[#141413] hover:bg-black text-[#FEDB00] font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Ver Todas as Minhas Comandas
              </Link>
              <Link 
                to="/order" 
                className="px-6 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Novo Pedido no Cardápio
              </Link>
            </div>
          </div>
        ) : !orderNumber ? (
          /* ==================================================================== */
          /* CASO 4: HUB DE COMANDAS (/orders sem :orderNumber)                    */
          /* Exibe a lista elegante com status, resumo dos itens e botão de mapa  */
          /* ==================================================================== */
          <div className="space-y-8">
            <div className="pb-6 border-b border-[#141413]/20">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1.5">
                04 / CENTRAL DE COMANDAS PATTIES
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#141413] tracking-[-0.02em]">
                Minhas Comandas
              </h1>
              <p className="text-[#141413]/70 text-sm sm:text-base mt-1.5 max-w-2xl">
                Selecione uma comanda abaixo para acompanhar o preparo na chapa quente e o trajeto do motoboy em tempo real no mapa.
              </p>
            </div>

            {sessionOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sessionOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => navigate(`/orders/${ord.orderNumber}`)}
                    className="bg-[#FAF7F2] border border-[#141413]/20 shadow-sm hover:shadow-lg hover:border-[#141413]/60 transition-all p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#141413]/10">
                        <span className="font-mono text-xs font-black uppercase tracking-[0.16em] px-2.5 py-1 bg-[#141413] text-[#FEDB00]">
                          #{ord.orderNumber}
                        </span>
                        {getStatusBadge(ord.status)}
                      </div>

                      {/* Data e Horário */}
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#141413]/60 mb-3">
                        <ClockIcon className="w-3.5 h-3.5 text-[#141413]/40" />
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}{' '}
                          às{' '}
                          {new Date(ord.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Resumo dos Itens */}
                      <div className="space-y-1.5 mb-4">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#141413]/45 block font-bold">
                          Itens da Comanda ({ord.items?.length || 0})
                        </span>
                        <div className="text-xs text-[#141413]/80 space-y-1">
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.slice(0, 3).map((it, idx) => (
                              <div key={idx} className="truncate">
                                <strong>{it.quantity}x</strong> {it.productName}
                                {it.notes && (
                                  <span className="font-mono text-[10px] text-[#D71920] font-semibold ml-1.5">
                                    ★ {it.notes}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <span className="italic text-[#141413]/50">Combo Smash Patties</span>
                          )}
                          {ord.items && ord.items.length > 3 && (
                            <span className="font-mono text-[10px] text-[#141413]/50 block">
                              + {ord.items.length - 3} outro(s) item(ns)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Endereço de Entrega */}
                      {ord.deliveryAddress && (
                        <div className="flex items-start gap-1.5 text-[11px] text-[#141413]/70 mb-4 bg-white/60 p-2.5 border border-[#141413]/10">
                          <MapPinIcon className="w-3.5 h-3.5 text-[#D71920] flex-shrink-0 mt-0.5" />
                          <span className="truncate">{ord.deliveryAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Rodapé com Total e Botão */}
                    <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between gap-3 mt-2">
                      <div>
                        <span className="block font-mono text-[8px] uppercase tracking-wider text-[#141413]/50">
                          Total Pago
                        </span>
                        <span className="font-mono font-bold text-base text-[#D71920]">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${ord.orderNumber}`);
                        }}
                        className="px-3.5 py-2 bg-[#141413] group-hover:bg-[#D71920] text-white font-mono text-[10px] font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Acompanhar</span>
                        <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Estado Vazio caso não haja comandas */
              <div className="bg-[#FAF7F2] border border-[#141413]/20 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto shadow-sm">
                <Barcode className="h-6 text-[#141413]/40 max-w-xs mx-auto" />
                <h3 className="font-serif text-2xl sm:text-3xl text-[#141413]">
                  {!user ? 'Acesse sua conta para ver suas comandas' : 'Nenhuma comanda ativa no momento'}
                </h3>
                <p className="font-mono text-xs text-[#141413]/70 max-w-md mx-auto leading-relaxed">
                  {!user
                    ? 'Faça login com sua conta para carregar automaticamente o histórico completo dos seus pedidos e acompanhar suas entregas ao vivo.'
                    : 'Você não possui nenhum pedido ativo nesta sessão. Que tal experimentar um smash quentinho direto da chapa?'}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {!user ? (
                    <>
                      <button
                        type="button"
                        onClick={openAuthModal}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] transition-colors cursor-pointer w-full sm:w-auto shadow-sm"
                      >
                        <span>Fazer Login / Criar Conta</span>
                        <span>➔</span>
                      </button>
                      <Link
                        to="/order"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#141413] hover:bg-black text-[#FEDB00] font-mono text-xs font-bold uppercase tracking-[0.18em] transition-colors w-full sm:w-auto"
                      >
                        <span>Ver Cardápio</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/order"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] transition-colors shadow-sm"
                    >
                      <span>Fazer Pedido no Cardápio</span>
                      <span>➔</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================================== */
          /* CASO 5: TELA DE DETALHE & RASTREAMENTO AO VIVO (/orders/:orderNumber) */
          /* ==================================================================== */
          <div className="bg-[#FAF7F2] border border-[#141413]/20 shadow-xl overflow-hidden">
            
            {/* 1. Header do Rastreio: Status Ao Vivo, Previsão Dinâmica e Ação */}
            <div className="p-5 sm:p-6 bg-[#141413] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                {/* Indicador de Status Alinhado */}
                {order.status === 'delivered' ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs mb-1.5">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PEDIDO ENTREGUE COM SUCESSO</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FEDB00] font-bold">
                      ACOMPANHAMENTO AO VIVO
                    </span>
                  </div>
                )}

                <h2 className="font-serif text-2xl sm:text-3xl text-white">
                  {order.status === 'received' && 'Aguardando confirmação na loja'}
                  {order.status === 'preparing' && 'Prensando smash na chapa quente'}
                  {order.status === 'packing' && 'Embalando com batatas quentinhas'}
                  {order.status === 'delivering' && 'Motoboy a caminho da sua mesa!'}
                  {order.status === 'delivered' && 'Entregue com sucesso! Bom apetite!'}
                </h2>

                <p className="font-mono text-xs text-white/60 mt-1">
                  Comanda <strong className="text-white">#{order.orderNumber}</strong> • Previsão: <span className="text-[#FEDB00] font-bold">{getDynamicETA()}</span>
                </p>
              </div>

              {/* Botão de Avanço Manual / Reinício do Ciclo (Exibido apenas em Modo Demonstração / Dev) */}
              {isDebugMode && (
                <button
                  onClick={handleAdvanceStatus}
                  disabled={isUpdatingStatus}
                  title="Simulação para testes e apresentação"
                  className="px-4 py-2.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.18em] disabled:opacity-50 transition-colors cursor-pointer shadow-md self-stretch sm:self-auto text-center inline-flex items-center justify-center gap-2"
                >
                  {isUpdatingStatus ? (
                    <>
                      <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                      <span>Atualizando...</span>
                    </>
                  ) : currentStageIndex === STAGES.length - 1 ? (
                    <>
                      <ArrowPathIcon className="w-3.5 h-3.5" />
                      <span>[Demo] Reiniciar Ciclo</span>
                    </>
                  ) : (
                    <>
                      <span>[Demo] Próxima Etapa</span>
                      <span>➔</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* 2. Mapa Leaflet Dark / Light com Rota Real OSRM */}
            <DeliveryMap 
              status={order.status} 
              statusUpdatedAt={order.updatedAt}
              deliveryAddress={order.deliveryAddress} 
              onDeliveryCompleted={handleDeliveryCompleted}
              onMetricsUpdate={setRouteMetrics}
            />

            {/* 3. Painel de Informações Limpo e Direto */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Stepper Progress Bar (4 Etapas) */}
              <div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Confirmado', icon: CheckIcon, active: currentStageIndex >= 0 },
                    { label: 'Na Chapa', icon: FireIcon, active: currentStageIndex >= 1 },
                    { label: 'A Caminho', isMoto: true, active: currentStageIndex >= 3 },
                    { label: 'Entregue', icon: CheckBadgeIcon, active: currentStageIndex >= 4 },
                  ].map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className={`h-1.5 w-full rounded-full transition-all ${
                          step.active ? 'bg-[#2F66FF]' : 'bg-[#141413]/15'
                        }`} />
                        <div className="flex items-center justify-center gap-1.5">
                          {step.isMoto ? (
                            <img
                              src="/images/delivery-motorcycle.png"
                              alt="Moto"
                              className={`w-4 h-4 object-contain ${step.active ? 'opacity-100' : 'opacity-30'}`}
                            />
                          ) : (
                            <StepIcon className={`w-3.5 h-3.5 ${step.active ? 'text-[#2F66FF]' : 'text-[#141413]/35'}`} />
                          )}
                          <span className={`font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${
                            step.active ? 'text-[#141413]' : 'text-[#141413]/40'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações do Motoboy e Destino */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#141413]/10">
                
                {/* Entregador Oficial Patties */}
                <div className="flex items-center gap-4 p-4 bg-white border border-[#141413]/10 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#FEDB00] flex items-center justify-center flex-shrink-0 border-2 border-[#0E132A] shadow-sm">
                    <img
                      src={brandConfig.courier?.iconUrl || '/images/delivery-motorcycle.png'}
                      alt="Motocicleta de Entrega"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#141413]/50 block">
                      {brandConfig.courier?.serviceName || 'Entregador Patties Express'}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#141413] truncate">
                      {brandConfig.courier?.name || 'Carlos Eduardo'}
                    </h4>
                    <p className="font-mono text-[10px] text-[#141413]/70 truncate">
                      {brandConfig.courier?.vehicle || 'Honda CG 160 Fan • Placa PAT-2026'}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs text-amber-600 bg-amber-50 px-2 py-1 border border-amber-200">
                    ★ {brandConfig.courier?.rating || '4.9'}
                  </span>
                </div>

                {/* Destino de Entrega */}
                <div className="flex items-center gap-4 p-4 bg-white border border-[#141413]/10 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-[#D71920] flex items-center justify-center flex-shrink-0 border border-red-200">
                    <MapPinIcon className="w-6 h-6 text-[#D71920]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#141413]/50 block">
                      Destino de Entrega
                    </span>
                    <h4 className="font-sans font-bold text-sm text-[#141413] truncate">
                      {order.deliveryAddress}
                    </h4>
                    <p className="font-mono text-[10px] text-[#141413]/70 truncate">
                      Titular: {order.customerName}
                    </p>
                  </div>
                </div>

              </div>

              {/* Accordion com Detalhes da Comanda */}
              <div className="border border-[#141413]/15 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="w-full p-4 bg-white hover:bg-[#FAF7F2] transition-colors flex items-center justify-between font-mono text-xs uppercase tracking-wider font-bold text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-4 h-4 text-[#D71920]" />
                    <span>Itens do Pedido ({order.items?.length || 0} itens)</span>
                    <span className="text-[#D71920] font-bold">• {formatCurrency(order.totalAmount)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>{showOrderDetails ? 'Ocultar Itens' : 'Ver Itens'}</span>
                    {showOrderDetails ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {showOrderDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 bg-[#FAF7F2] border-t border-[#141413]/10 space-y-4"
                  >
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-[#141413]/5">
                          <div className="flex items-center gap-3">
                            {item.productImageUrl && (
                              <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 object-cover rounded border border-[#141413]/10" />
                            )}
                            <div>
                              <strong className="block text-[#141413] font-serif text-sm">{item.productName}</strong>
                              <span className="font-mono text-[10px] text-[#141413]/60">{item.quantity}x • {formatCurrency(item.unitPrice)}</span>
                              {item.notes && (
                                <span className="block font-mono text-[9px] text-[#D71920] font-bold mt-0.5">
                                  ★ {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#D71920] text-sm">
                            {formatCurrency(item.quantity * Number(item.unitPrice))}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="font-mono text-xs italic text-[#141413]/70 bg-white p-3 border border-[#141413]/10">
                        Observação: "{order.notes}"
                      </p>
                    )}

                    <div className="pt-2 font-mono text-xs space-y-1.5 text-[#141413]/70 border-t border-[#141413]/10">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      {Number(order.discountAmount) > 0 && (
                        <div className="flex justify-between text-[#D71920] font-bold">
                          <span>Desconto ({order.couponCode})</span>
                          <span>-{formatCurrency(order.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxa de Entrega</span>
                        <span>{Number(order.deliveryFee) === 0 ? 'Grátis' : formatCurrency(order.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-[#141413] pt-2 border-t border-[#141413]/15">
                        <span>Total Pago</span>
                        <span className="text-[#D71920] text-base">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default OrderTrackingPage;
