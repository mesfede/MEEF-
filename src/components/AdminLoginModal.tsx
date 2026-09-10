import React, { useState } from 'react';
import { X, Shield, CheckCircle2, AlertCircle, Lock, Sparkles, LogIn, Loader2 } from 'lucide-react';
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
        setSuccessMsg(`¡Acceso verificado para ${userEmail}! Abriendo panel de administración...`);
        setTimeout(() => {
          onLoginSuccess(userEmail);
          onClose();
        }, 500);
      } else {
        // Sign out unauthorized account immediately
        await signOut(auth).catch(() => {});
        setErrorMsg(
          `Acceso Denegado: La cuenta "${userEmail}" no está autorizada como administrador. Únicamente mesfede@gmail.com y unkedcv@gmail.com tienen permisos para administrar la web.`
        );
      }
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Inicio de sesión cancelado.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg(
          'Dominio no autorizado en Firebase. Para habilitar Google Sign-In, agregue el dominio actual en la consola de Firebase (Authentication > Configuración > Dominios autorizados).'
        );
      } else {
        setErrorMsg(err.message || 'Error al autenticar con Google. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#181818] text-white p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#48A82D]/20 border border-[#48A82D] flex items-center justify-center text-[#48A82D]">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-[#48A82D] uppercase tracking-wider">
                Acceso de Administrador
              </h3>
              <p className="text-[11px] text-zinc-400">
                Exclusivo Cuentas de Google Registradas
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
        <div className="p-6 text-left space-y-4">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
              <Lock className="w-3.5 h-3.5 text-[#48A82D]" />
              <span>Administradores Autorizados</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              El panel de gestión solo admite el acceso mediante cuenta de Google de los siguientes usuarios verificados:
            </p>
            <div className="space-y-1.5 pt-1">
              {AUTHORIZED_ADMIN_EMAILS.map((admin) => (
                <div
                  key={admin}
                  className="flex items-center justify-between px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs"
                >
                  <span className="font-mono font-medium text-zinc-800">{admin}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#48A82D] bg-[#48A82D]/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Habilitado
                  </span>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#48A82D]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-50 text-zinc-900 font-bold py-3.5 px-4 rounded-xl border-2 border-zinc-300 hover:border-[#48A82D] shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-zinc-700 text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-[#48A82D]" />
                  <span>Conectando con Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span className="text-xs sm:text-sm font-semibold">
                    Iniciar Sesión con Google
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>Seguridad: Google OAuth 2.0</span>
            <span className="text-[#48A82D] font-bold">2 Admins Registrados</span>
          </div>
        </div>
      </div>
    </div>
  );
};
