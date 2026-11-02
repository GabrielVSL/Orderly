import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Barcode = ({ className = 'h-4' }) => (
  <div
    aria-hidden="true"
    className={`w-full opacity-60 ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(to right, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 11px, transparent 11px, transparent 13px, currentColor 13px, currentColor 14px, transparent 14px, transparent 17px)',
    }}
  />
);

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessAlert, setForgotSuccessAlert] = useState(false);
  const [resetTokenData, setResetTokenData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  // Verificadores da política de senha forte
  const password = tab === 'register' ? registerData.password : resetTokenData.newPassword;
  const passwordCriteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setRegisterData(prev => ({ ...prev, phone: val }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(loginData.email.trim(), loginData.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('A senha deve atender a todos os requisitos de segurança.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        phone: registerData.phone.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Informe seu e-mail cadastrado.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotSuccessAlert(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao processar solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (resetTokenData.newPassword !== resetTokenData.confirmPassword) {
      toast.error('A confirmação de senha não coincide com a nova senha.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('A nova senha deve atender a todos os requisitos de segurança.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token: resetTokenData.token.trim(),
        newPassword: resetTokenData.newPassword,
      });
      toast.success(res.data.message || 'Senha redefinida com sucesso!');
      setTab('login');
      setLoginData(prev => ({ ...prev, password: '' }));
      setResetTokenData({ token: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link inválido ou expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        
        {/* Backdrop clickable */}
        <div 
          className="fixed inset-0" 
          onClick={closeAuthModal} 
          aria-hidden="true" 
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#F3EFE6] text-[#141413] border border-[#141413]/30 shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Strip */}
          <div className="bg-[#141413] p-5 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#FEDB00] font-bold block">
                ★ PATTIES DIRECT • ACESSO SEGURO ★
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-white mt-0.5">
                {tab === 'login' && 'Identificação do Cliente'}
                {tab === 'register' && 'Novo Cadastro Patties'}
                {tab === 'forgot' && 'Recuperar Acesso'}
                {tab === 'reset' && 'Redefinir Senha'}
              </h2>
            </div>
            
            <button
              onClick={closeAuthModal}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar janela"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Barcode Strip */}
          <div className="px-5 py-2 bg-[#EAE5DC] border-b border-[#141413]/15 flex items-center justify-between flex-shrink-0">
            <Barcode className="h-3 text-[#141413]/40 max-w-[140px]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#141413]/60">
              Criptografia Bcrypt 256
            </span>
          </div>

          {/* Tabs Selector (Apenas para Login e Cadastro) */}
          {(tab === 'login' || tab === 'register') && (
            <div className="grid grid-cols-2 border-b border-[#141413]/20 flex-shrink-0 bg-[#EAE5DC]">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer text-center ${
                  tab === 'login'
                    ? 'bg-[#F3EFE6] text-[#141413] border-b-2 border-[#D71920]'
                    : 'text-[#141413]/60 hover:text-[#141413]'
                }`}
              >
                Já tenho Conta
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer text-center ${
                  tab === 'register'
                    ? 'bg-[#F3EFE6] text-[#141413] border-b-2 border-[#D71920]'
                    : 'text-[#141413]/60 hover:text-[#141413]'
                }`}
              >
                Criar Cadastro
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 overflow-y-auto">
            
            {/* 1. ABA DE LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    E-mail Cadastrado
                  </label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413]">
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="font-mono text-[9px] uppercase tracking-wider text-[#D71920] hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showLoginPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showLoginPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showLoginPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verificando...' : 'Entrar na Conta ➔'}
                  </button>
                </div>

                <p className="font-mono text-[10px] text-center text-[#141413]/60 pt-2 leading-relaxed">
                  Conecte-se para vincular e consultar suas comandas com privacidade.
                </p>
              </form>
            )}

            {/* 2. ABA DE CADASTRO (SIMPLES, SEM ENDEREÇO, COM POLÍTICA DE SENHA FORTE) */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Telefone (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Senha de Acesso *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showRegisterPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showRegisterPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showRegisterPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>

                  {/* Checklist visual dos requisitos de segurança da senha */}
                  <div className="mt-2.5 p-3 bg-[#EAE5DC] border border-[#141413]/15 font-mono text-[10px] space-y-1">
                    <span className="font-bold text-[#141413] block mb-1 uppercase tracking-wider">
                      Requisitos de Segurança da Senha:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[9px]">
                      <span className={passwordCriteria.length ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                        {passwordCriteria.length ? '✓' : '○'} Mínimo 8 dígitos
                      </span>
                      <span className={passwordCriteria.upper ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                        {passwordCriteria.upper ? '✓' : '○'} Letra Maiúscula (A-Z)
                      </span>
                      <span className={passwordCriteria.lower ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                        {passwordCriteria.lower ? '✓' : '○'} Letra Minúscula (a-z)
                      </span>
                      <span className={passwordCriteria.number ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                        {passwordCriteria.number ? '✓' : '○'} Número (0-9)
                      </span>
                      <span className={`col-span-2 ${passwordCriteria.special ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}`}>
                        {passwordCriteria.special ? '✓' : '○'} Caractere Especial (!, @, #, $, %, etc.)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isPasswordValid}
                    className="w-full py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Concluir Cadastro ➔'}
                  </button>
                </div>
              </form>
            )}

            {/* 3. ABA DE RECUPERAÇÃO DE SENHA (MENSAGERIA / E-MAIL) */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Seu E-mail Cadastrado
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ex: gabriel@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Link de Redefinição ➔'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="font-mono text-xs text-[#141413]/70 hover:text-[#141413] text-center pt-2 uppercase tracking-wider cursor-pointer"
                  >
                    ← Voltar para o Login
                  </button>
                </div>
              </form>
            )}

            {/* 4. ABA DE REDEFINIÇÃO DE SENHA COM TOKEN */}
            {tab === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Token de Recuperação *
                  </label>
                  <input
                    type="text"
                    required
                    value={resetTokenData.token}
                    onChange={(e) => setResetTokenData({ ...resetTokenData, token: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Nova Senha Forte *
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      value={resetTokenData.newPassword}
                      onChange={(e) => setResetTokenData({ ...resetTokenData, newPassword: e.target.value })}
                      className="w-full pl-4 pr-11 py-2.5 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showResetPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showResetPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showResetPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Confirmar Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmResetPassword ? "text" : "password"}
                      required
                      value={resetTokenData.confirmPassword}
                      onChange={(e) => setResetTokenData({ ...resetTokenData, confirmPassword: e.target.value })}
                      className="w-full pl-4 pr-11 py-2.5 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmResetPassword(!showConfirmResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showConfirmResetPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showConfirmResetPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showConfirmResetPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>
                </div>

                {/* Checklist visual da nova senha */}
                <div className="p-3 bg-[#EAE5DC] border border-[#141413]/15 font-mono text-[10px] space-y-1">
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <span className={passwordCriteria.length ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {passwordCriteria.length ? '✓' : '○'} 8+ dígitos
                    </span>
                    <span className={passwordCriteria.upper ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {passwordCriteria.upper ? '✓' : '○'} Maiúscula
                    </span>
                    <span className={passwordCriteria.lower ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {passwordCriteria.lower ? '✓' : '○'} Minúscula
                    </span>
                    <span className={passwordCriteria.number ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {passwordCriteria.number ? '✓' : '○'} Número
                    </span>
                    <span className={`col-span-2 ${passwordCriteria.special ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}`}>
                      {passwordCriteria.special ? '✓' : '○'} Caractere Especial
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isPasswordValid}
                    className="w-full py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha ➔'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="font-mono text-xs text-[#141413]/70 hover:text-[#141413] text-center pt-2 uppercase tracking-wider"
                  >
                    ← Cancelar e Voltar ao Login
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Footer Barcode */}
          <div className="p-3 bg-[#EAE5DC] border-t border-[#141413]/15 flex-shrink-0">
            <Barcode className="h-3 text-[#141413]/30 max-w-xs mx-auto" />
          </div>

          {/* Centered Success Alert Overlay */}
          <AnimatePresence>
            {forgotSuccessAlert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#141413]/85 backdrop-blur-sm p-6 flex items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                    ✓
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#141413]">
                    Link Enviado!
                  </h3>
                  <p className="font-sans text-xs text-[#141413]/80 leading-relaxed">
                    Se o e-mail informado estiver cadastrado em nosso sistema, as instruções e o link seguro para redefinição foram despachados.
                  </p>
                  <p className="font-mono text-[10px] text-[#141413]/60">
                    Verifique sua caixa de entrada e pasta de spam.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSuccessAlert(false);
                        setTab('login');
                        setForgotEmail('');
                      }}
                      className="w-full py-3 bg-[#141413] hover:bg-[#D71920] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      Entendido ➔
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AuthModal;
