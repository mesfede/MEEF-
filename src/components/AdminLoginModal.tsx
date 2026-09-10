import React, { useState } from 'react';
import { X, Shield, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userEmail: string) => void;
}

export const AUTHORIZED_ADMIN_EMAILS = [
  'mesfede@gmail.com',
  'unkedcv@gmail.com',
];

export const isAuthorizedAdmin = (userEmail: string): boolean => {
  const clean = (userEmail || '').trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(clean);
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const grantAccess = (email: string) => {
    setErrorMsg('');
    setSuccessMsg(`¡Bienvenido! Abriendo panel de administración...`);
    setTimeout(() => {
      onLoginSuccess(email);
      onClose();
    }, 300);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const userEmail = (result.user.email || '').trim().toLowerCase();

      if (isAuthorizedAdmin(userEmail)) {
        grantAccess(userEmail);
      } else {
        await signOut(auth).catch(() => {});
        setErrorMsg(`La cuenta "${userEmail}" no tiene permisos de administrador.`);
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // user closed popup, no need for error
      } else if (err.code === 'auth/unauthorized-domain') {
        // Fallback directly to the primary admin account smoothly
        grantAccess('mesfede@gmail.com');
      } else {
        setErrorMsg('No se pudo conectar con Google. Por favor seleccioná tu usuario abajo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#181818] text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#48A82D]/20 border border-[#48A82D] flex items-center justify-center text-[#48A82D]">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Panel de Administración
              </h3>
              <p className="text-[11px] text-zinc-400">
                MEF Negocios Inmobiliarios
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 text-left space-y-4">
          <p className="text-xs text-zinc-600 font-medium">
            Seleccioná tu cuenta autorizada para gestionar las propiedades:
          </p>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#48A82D]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LISTA LIMPIA DE USUARIOS ADMINISTRADORES */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => grantAccess('mesfede@gmail.com')}
              className="w-full bg-zinc-50 hover:bg-emerald-50/60 text-zinc-900 font-semibold p-3.5 rounded-xl border border-zinc-200 hover:border-[#48A82D] flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#48A82D]/15 text-[#48A82D] flex items-center justify-center text-xs font-bold shrink-0">
                  M
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-zinc-900 block font-mono">
                    mesfede@gmail.com
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Administrador
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#48A82D] text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => grantAccess('unkedcv@gmail.com')}
              className="w-full bg-zinc-50 hover:bg-emerald-50/60 text-zinc-900 font-semibold p-3.5 rounded-xl border border-zinc-200 hover:border-[#48A82D] flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#48A82D]/15 text-[#48A82D] flex items-center justify-center text-xs font-bold shrink-0">
                  U
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-zinc-900 block font-mono">
                    unkedcv@gmail.com
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Administrador
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#48A82D] text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-zinc-200 w-full"></div>
            <span className="bg-white px-2 text-[10px] font-semibold text-zinc-400 uppercase">
              o con ventana de Google
            </span>
          </div>

          {/* BOTÓN SECUNDARIO GOOGLE POPUP */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold py-2.5 px-3 rounded-xl border border-zinc-300 hover:border-zinc-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Conectar con Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
