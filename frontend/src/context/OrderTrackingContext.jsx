import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const OrderTrackingContext = createContext(null);

export const STAGE_INFO = {
  received: { title: 'Pedido Recebido', stamp: 'NO CAIXA', desc: 'Confirmado no caixa do Patties' },
  preparing: { title: 'Na Chapa Quente', stamp: 'NA CHAPA', desc: 'Smash prensado com crostinha a 250°C' },
  packing: { title: 'Embalando Combo', stamp: 'EMBALANDO', desc: 'Batata skinny quentinha e bebidas' },
  delivering: { title: 'Saiu p/ Entrega', stamp: 'A CAMINHO', desc: 'Motoboy a caminho da sua mesa' },
  delivered: { title: 'Entregue com Sucesso', stamp: 'ENTREGUE', desc: 'Bom apetite! Viva a experiência Patties' },
};

export function OrderTrackingProvider({ children }) {
  const location = useLocation();

  const [activeOrder, setActiveOrder] = useState(null);
  const [activeOrderNumber, setActiveOrderNumber] = useState(() => {
    return localStorage.getItem('patties_active_order') || null;
  });

  const [notification, setNotification] = useState(null);
  const previousStatusRef = useRef(null);
  const isPollingRef = useRef(false);

  // Define um pedido para ser monitorado globalmente
  const trackOrder = useCallback((orderNumber) => {
    if (!orderNumber) return;
    const clean = orderNumber.trim().toUpperCase();
    setActiveOrderNumber(clean);
    localStorage.setItem('patties_active_order', clean);
  }, []);

  // Limpa o pedido ativo quando desejado
  const clearActiveOrder = useCallback(() => {
    setActiveOrder(null);
    setActiveOrderNumber(null);
    localStorage.removeItem('patties_active_order');
  }, []);

  // Fecha o banner de notificação do topo
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Busca e sincroniza status do pedido
  const fetchActiveOrderStatus = useCallback(async () => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    try {
      let targetNumber = activeOrderNumber;

      // Se não tem activeOrderNumber no state/localStorage, tenta pegar a comanda mais recente da sessão/usuário
      if (!targetNumber) {
        const listRes = await api.get('/orders');
        const orders = listRes.data || [];
        if (orders.length > 0) {
          const latest = orders[0];
          targetNumber = latest.orderNumber;
          setActiveOrderNumber(latest.orderNumber);
          localStorage.setItem('patties_active_order', latest.orderNumber);
          setActiveOrder(latest);
          previousStatusRef.current = latest.status;
          return;
        }
      }

      if (!targetNumber) return;

      const res = await api.get(`/orders/${targetNumber}`);
      const updatedOrder = res.data;

      if (!updatedOrder) return;

      const oldStatus = previousStatusRef.current;
      const newStatus = updatedOrder.status;

      setActiveOrder(updatedOrder);

      // Detecta transição de status
      if (oldStatus && oldStatus !== newStatus) {
        const stage = STAGE_INFO[newStatus] || STAGE_INFO.received;
        
        // Exibe notificação no topo se o usuário não estiver na tela desse pedido específico
        const isCurrentlyViewingOrder = location.pathname === `/orders/${targetNumber}`;

        setNotification({
          orderNumber: targetNumber,
          prevStatus: oldStatus,
          newStatus,
          title: stage.title,
          desc: stage.desc,
          stamp: stage.stamp,
          isViewing: isCurrentlyViewingOrder,
        });

        // Auto-dispensa após 10 segundos
        setTimeout(() => {
          setNotification((curr) => (curr?.orderNumber === targetNumber ? null : curr));
        }, 10000);
      }

      previousStatusRef.current = newStatus;
    } catch {
      // Pedido não encontrado ou privado
    } finally {
      isPollingRef.current = false;
    }
  }, [activeOrderNumber, location.pathname]);

  // Polling periódico a cada 5 segundos para auto-avanço das etapas
  useEffect(() => {
    fetchActiveOrderStatus();

    const interval = setInterval(() => {
      fetchActiveOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchActiveOrderStatus]);

  const value = {
    activeOrder,
    activeOrderNumber,
    trackOrder,
    clearActiveOrder,
    notification,
    dismissNotification,
    refreshActiveOrder: fetchActiveOrderStatus,
  };

  return (
    <OrderTrackingContext.Provider value={value}>
      {children}
    </OrderTrackingContext.Provider>
  );
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext);
  if (!context) {
    throw new Error('useOrderTracking must be used within an OrderTrackingProvider');
  }
  return context;
}

export default OrderTrackingContext;
