import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCardIcon, 
  QrCodeIcon, 
  BanknotesIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';
import { brandConfig } from '../config/brandConfig';
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

export function CheckoutPage() {
  const { cartItems, isLoading, placeOrder } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "pix",
  });

  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  });

  // Preenchimento inteligente com dados do usuário logado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      setAddressData(prev => ({
        ...prev,
        cep: prev.cep || user.cep || '',
        street: prev.street || user.street || '',
        number: prev.number || user.number || '',
        neighborhood: prev.neighborhood || user.neighborhood || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        complement: prev.complement || user.complement || '',
      }));
    }
  }, [user]);

  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const validCartItems = cartItems.filter(item => item && item.product);

  const subtotal = validCartItems.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.product?.price || 0));
  }, 0);

  const isFreeDelivery = subtotal >= brandConfig.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : (validCartItems.length > 0 ? brandConfig.defaultDeliveryFee : 0);
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Busca automática de endereço via CEP (ViaCEP)
  const handleCepChange = async (e) => {
    const rawValue = e.target.value.replace(/\D/g, '').slice(0, 8);
    const formatted = rawValue.length > 5 ? `${rawValue.slice(0, 5)}-${rawValue.slice(5)}` : rawValue;

    setAddressData(prev => ({ ...prev, cep: formatted }));
    setCepSuccess(false);

    if (rawValue.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawValue}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddressData(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
          setCepSuccess(true);
          toast.success('Endereço localizado pelo CEP!');
          
          setTimeout(() => {
            const numEl = document.getElementById('field-number');
            if (numEl) numEl.focus();
          }, 150);
        } else {
          toast.error('CEP não localizado. Preencha o endereço manualmente.');
        }
      } catch (err) {
        console.error('Falha ao consultar ViaCEP:', err);
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  // Formatação amigável de telefone
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setFormData(prev => ({ ...prev, phone: val }));
  };

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    try {
      const response = await api.post('/orders/validate-coupon', {
        code,
        subtotal
      });
      setAppliedCoupon(response.data.code);
      setDiscountAmount(response.data.discountAmount);
      toast.success(response.data.message || `Cupom ${response.data.code} aplicado!`);
      setCouponCodeInput('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Cupom inválido.';
      toast.error(msg);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success('Cupom removido.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || validCartItems.length === 0) return;

    if (!addressData.street.trim() || !addressData.number.trim()) {
      toast.error('Informe a rua e o número para entrega.');
      return;
    }

    // Formata o endereço completo e legível para a entrega
    const compText = addressData.complement.trim() ? ` - ${addressData.complement.trim()}` : '';
    const cepText = addressData.cep.trim() ? ` (CEP: ${addressData.cep.trim()})` : '';
    const fullAddress = `${addressData.street.trim()}, ${addressData.number.trim()}${compText} - ${addressData.neighborhood.trim()}, ${addressData.city.trim()} - ${addressData.state.trim()}${cepText}`;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: fullAddress,
      notes: orderNotes.trim() || null,
      paymentMethod: formData.paymentMethod,
      couponCode: appliedCoupon
    };

    try {
      await placeOrder(payload);
    } catch {
      // Erro tratado com toast no CartContext
    }
  };

  const paymentOptions = [
    { id: 'pix', label: 'PIX Instantâneo', icon: QrCodeIcon, badge: 'Aprovação Imediata' },
    { id: 'card', label: 'Cartão na Entrega', icon: CreditCardIcon, badge: 'Débito / Crédito' },
    { id: 'cash', label: 'Dinheiro na Entrega', icon: BanknotesIcon, badge: 'Troco se precisar' },
  ];

  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] pb-24 selection:bg-[#D71920] selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 pt-6 sm:pt-8">
        
        {/* Top Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[#141413]/15">
          <Link 
            to="/order" 
            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#141413]/70 hover:text-[#D71920] transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Voltar ao Cardápio</span>
          </Link>

          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#141413]/55">
            Passo 04 / Finalização
          </span>
        </div>

        {/* Section Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#141413]/20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1.5">
              04 / BALCÃO &amp; FINALIZAÇÃO • CHAPA QUENTE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#141413] tracking-[-0.02em]">
              Finalizar Pedido
            </h1>
            <p className="text-[#141413]/70 text-sm sm:text-base mt-1.5 max-w-2xl">
              Informe os dados de entrega para prepararmos sua comanda e despacharmos quentinho direto da chapa.
            </p>
          </div>
        </div>

        {/* Empty Cart Warning */}
        {validCartItems.length === 0 ? (
          <div className="bg-[#F3EFE6] border border-[#141413]/20 p-12 text-center max-w-xl mx-auto shadow-md space-y-4">
            <Barcode className="h-6 text-[#141413]/30 max-w-xs mx-auto mb-2" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D71920] font-bold block">
              Carrinho Vazio
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141413]">
              Sua comanda ainda não tem itens
            </h2>
            <p className="font-mono text-xs text-[#141413]/70">
              Escolha seus smash burgers, batatas crocantes e bebidas antes de finalizar o pedido.
            </p>
            <div className="pt-4">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <span>Montar Pedido Agora</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customer Data & Address & Payment (7 cols) */}
            <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#141413]/25 shadow-md p-6 sm:p-8 space-y-6">
              
              <div className="border-b border-[#141413]/15 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1">
                  ★ DADOS DE ENTREGA &amp; CONTATO ★
                </span>
                <h3 className="font-serif text-2xl text-[#141413]">
                  Informações da Comanda
                </h3>
              </div>

              {/* Status de Autenticação / Vinculação de Comanda */}
              {isAuthenticated ? (
                <div className="p-3.5 bg-[#FAF7F2] border border-emerald-700/30 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Conectado como <strong>{user.name}</strong> • Comanda vinculada à sua conta</span>
                  </div>
                  <span className="text-[10px] text-[#141413]/55 hidden sm:inline">{user.email}</span>
                </div>
              ) : (
                <div className="p-3.5 bg-[#FAF7F2] border border-[#141413]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#141413]/80">
                    <span className="text-[#D71920]">★</span>
                    <span>Já tem conta? Conecte-se para preencher seus dados e proteger suas comandas.</span>
                  </div>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="px-3.5 py-1.5 bg-[#141413] hover:bg-[#D71920] text-[#FEDB00] font-bold text-[10px] uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
                  >
                    Entrar na Conta
                  </button>
                </div>
              )}

              {/* 1. Informações Básicas do Cliente (sem placeholders poluídos) */}
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      E-mail de Contato *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Endereço com Busca Automática por CEP */}
              <div className="pt-4 border-t border-[#141413]/15 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413]">
                    Endereço de Entrega
                  </span>
                  {isFetchingCep && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#D71920] animate-pulse">
                      Consultando CEP...
                    </span>
                  )}
                </div>

                {/* CEP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={addressData.cep}
                        onChange={handleCepChange}
                        maxLength={9}
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                      />
                      {cepSuccess && (
                        <span className="absolute right-3 top-3 text-emerald-600 font-bold text-xs" title="CEP localizado com sucesso">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <p className="font-mono text-[9px] text-[#141413]/60 pb-3 leading-tight">
                      Digite o CEP para preencher rua, bairro e cidade automaticamente.
                    </p>
                  </div>
                </div>

                {/* Rua / Avenida + Número */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Número *
                    </label>
                    <input
                      id="field-number"
                      type="text"
                      required
                      value={addressData.number}
                      onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>

                {/* Complemento de Endereço (substituindo observações) */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Complemento do Endereço (Opcional)
                  </label>
                  <input
                    type="text"
                    value={addressData.complement}
                    onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                {/* Bairro + Cidade / UF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.neighborhood}
                      onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                        UF *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={addressData.state}
                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] text-center focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações da Comanda */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Observações para a Cozinha ou Entrega (Opcional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ex: Tocar o interfone, deixar na portaria, caprichar no guardanapo..."
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] placeholder-[#141413]/40 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

              </div>

              {/* 3. Forma de Pagamento */}
              <div className="pt-4 border-t border-[#141413]/15">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] block mb-3">
                  Forma de Pagamento
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentOptions.map((opt) => {
                    const isSelected = formData.paymentMethod === opt.id;
                    const Icon = opt.icon;

                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: opt.id })}
                        className={`p-4 border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#141413] text-[#FEDB00] border-[#141413] shadow-sm'
                            : 'bg-[#FAF7F2] text-[#141413] border-[#141413]/20 hover:border-[#141413]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-[#FEDB00]' : 'text-[#D71920]'}`} />
                          {isSelected && <CheckIcon className="w-4 h-4 text-[#FEDB00]" />}
                        </div>
                        <div>
                          <span className="font-mono font-bold text-xs uppercase block leading-tight">
                            {opt.label}
                          </span>
                          <span className={`font-mono text-[9px] uppercase tracking-wider mt-1 block ${
                            isSelected ? 'text-[#F5F1E8]/70' : 'text-[#141413]/60'
                          }`}>
                            {opt.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary / Vintage Ticket Strip (5 cols) */}
            <div className="lg:col-span-5 bg-[#F3EFE6] border border-[#141413]/25 shadow-md p-6 sm:p-8 space-y-5 lg:sticky lg:top-[76px]">
              
              <Barcode className="h-5 text-[#141413]/40" />

              <div className="border-b border-[#141413]/15 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block">
                    ★ PATTIES DIRECT ★
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#141413]">
                    Resumo da Comanda
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#141413] text-[#FEDB00]">
                  {validCartItems.reduce((acc, ci) => acc + ci.quantity, 0)} ITENS
                </span>
              </div>

              {/* Scrollable Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {validCartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#141413]/15 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img 
                        src={item.product?.imageUrl} 
                        alt={item.product?.name} 
                        className="w-10 h-10 object-cover bg-[#141413] border border-[#141413]/15 flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://pattiesburger.com/wp-content/uploads/2022/04/ORIGINAL.jpg';
                        }}
                      />
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-[#141413] block text-xs truncate">
                          {item.product?.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#141413]/60">
                          {item.quantity}x • {formatCurrency(item.product?.price || 0)}
                        </span>
                        {item.notes && (
                          <span className="block font-mono text-[9px] text-[#D71920] font-bold mt-0.5 truncate">
                            ★ {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#D71920] text-xs flex-shrink-0">
                      {formatCurrency(item.quantity * Number(item.product?.price || 0))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form (limpo, sem EX poluído) */}
              <div className="pt-3 border-t border-[#141413]/15">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-[#EAE5DC] border border-[#D71920]/40 font-mono text-xs">
                    <div className="flex items-center gap-2 text-[#D71920] font-bold">
                      <TagIcon className="w-4 h-4" />
                      <span>CUPOM {appliedCoupon} (-{formatCurrency(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#141413]/60 hover:text-[#D71920] transition-colors cursor-pointer"
                      title="Remover cupom"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="CÓDIGO DO CUPOM"
                        className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs uppercase tracking-wider text-[#141413] placeholder-[#141413]/40 focus:outline-none focus:border-[#D71920]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-[#141413] hover:bg-[#D71920] text-white font-mono font-bold text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#141413]/55">
                      Cupom disponível: <strong>PATTIES10</strong> (10% OFF)
                    </p>
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="pt-3 border-t border-[#141413]/15 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#141413]/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D71920] font-bold">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#141413]/70">
                  <span>Taxa de Entrega</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#141413] pt-2 border-t border-[#141413]/20">
                  <span>Total a Pagar</span>
                  <span className="text-[#D71920] text-lg font-bold">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || validCartItems.length === 0}
                className="w-full py-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Transmitindo Pedido para a Chapa...</span>
                ) : (
                  <>
                    <span>Confirmar e Enviar Pedido</span>
                    <span>➔</span>
                  </>
                )}
              </button>

              <Barcode className="h-4 text-[#141413]/30" />

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default CheckoutPage;
