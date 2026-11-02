import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { KeyIcon, CheckBadgeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
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

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validador visual dos requisitos de segurança
  const criteria = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(newPassword),
  };
  const isPasswordValid = Object.values(criteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error('Token de recuperação ausente.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas digitadas não coincidem.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('A nova senha deve atender a todos os requisitos de segurança.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token: token.trim(),
        newPassword
      });
      toast.success(res.data.message || 'Senha alterada com sucesso!');
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link inválido ou expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] pb-24 selection:bg-[#D71920] selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 pt-8 sm:pt-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-3 border-b border-[#141413]/15 max-w-xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#141413]/70 hover:text-[#D71920] transition-colors group"
          >
            <span>←</span>
            <span>Voltar ao Início</span>
          </Link>

          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]/55">
            Segurança da Conta
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-[#F3EFE6] border border-[#141413]/25 shadow-xl max-w-xl mx-auto overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#141413] text-white p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#FEDB00] font-bold block mb-1">
                ★ PATTIES DIRECT • REDEFINIÇÃO DE ACESSO ★
              </span>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
                Criar Nova Senha
              </h1>
            </div>
            <div className="w-12 h-12 bg-white/10 flex items-center justify-center border border-white/20">
              <KeyIcon className="w-6 h-6 text-[#FEDB00]" />
            </div>
          </div>

          <Barcode className="h-3 text-[#141413]/30 mx-4 my-2" />

          {/* Body */}
          <div className="p-6 sm:p-8">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-600/30">
                  <CheckBadgeIcon className="w-10 h-10" />
                </div>
                <h2 className="font-serif text-2xl text-[#141413]">
                  Senha Redefinida com Sucesso!
                </h2>
                <p className="font-mono text-xs text-[#141413]/70 max-w-md mx-auto leading-relaxed">
                  Sua conta está atualizada e protegida com criptografia Bcrypt. Você já pode fazer login com a sua nova senha.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => openAuthModal(), 100);
                    }}
                    className="px-8 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    Entrar na Conta Agora ➔
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="font-mono text-xs text-[#141413]/70 leading-relaxed">
                  Digite sua nova senha abaixo. Ela deve conter letras maiúsculas, minúsculas, números e pelo menos um caractere especial.
                </p>

                {/* Token Field (se não veio na URL ou se o usuário quiser conferir) */}
                {!tokenFromUrl && (
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                      Código / Token de Recuperação *
                    </label>
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showNewPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showNewPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#141413] mb-1.5">
                    Confirmar Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#141413]/25 font-mono text-xs tracking-wider text-[#141413] focus:outline-none focus:border-[#D71920]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#141413]/50 hover:text-[#141413] transition-colors p-1 cursor-pointer"
                      title={showConfirmPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4 text-[#141413]/60" />}
                    </button>
                  </div>
                </div>

                {/* Checklist Visual de Segurança */}
                <div className="p-3.5 bg-[#EAE5DC] border border-[#141413]/15 font-mono text-[10px] space-y-1.5">
                  <span className="font-bold text-[#141413] block uppercase tracking-wider">
                    Requisitos Obrigatórios:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <span className={criteria.length ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {criteria.length ? '✓' : '○'} Mínimo 8 caracteres
                    </span>
                    <span className={criteria.upper ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {criteria.upper ? '✓' : '○'} Letra Maiúscula (A-Z)
                    </span>
                    <span className={criteria.lower ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {criteria.lower ? '✓' : '○'} Letra Minúscula (a-z)
                    </span>
                    <span className={criteria.number ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}>
                      {criteria.number ? '✓' : '○'} Número (0-9)
                    </span>
                    <span className={`col-span-2 ${criteria.special ? 'text-emerald-700 font-bold' : 'text-[#141413]/60'}`}>
                      {criteria.special ? '✓' : '○'} Caractere Especial (!, @, #, $, %, etc.)
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isPasswordValid}
                    className="w-full py-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Confirmar e Salvar Nova Senha ➔'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="p-4 bg-[#EAE5DC] border-t border-[#141413]/15">
            <Barcode className="h-4 text-[#141413]/30 max-w-xs mx-auto" />
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResetPasswordPage;
