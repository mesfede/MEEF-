import React, { useState } from 'react';
import { Plus, Database, LogOut, ShieldCheck, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { seedSamplePropertiesToFirestore } from '../services/propertyService';

interface AdminBarProps {
  adminEmail: string;
  onOpenAddProperty: () => void;
  onLogout: () => void;
  isFirebaseActive: boolean;
  totalPropertiesCount: number;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  adminEmail,
  onOpenAddProperty,
  onLogout,
  isFirebaseActive,
  totalPropertiesCount,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSeed = async () => {
    if (
      !window.confirm(
        '¿Desea cargar las 5 propiedades de muestra iniciales en su base de datos Firebase?'
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedMsg('');
    try {
      await seedSamplePropertiesToFirestore();
      setSeedMsg('¡Propiedades de muestra subidas a Firebase!');
      setTimeout(() => setSeedMsg(''), 4000);
    } catch (err: any) {
      console.error('Error seeding sample properties:', err);
      alert(`Error al importar muestras: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-zinc-900 text-white border-b-2 border-[#48A82D] px-4 py-2.5 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xl z-40 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#48A82D] animate-pulse"></span>
        <div className="flex items-center gap-1.5 text-[#48A82D] font-extrabold uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>Panel de Administrador MEF</span>
        </div>
        <span className="text-zinc-500 hidden sm:inline">|</span>
        <span className="text-zinc-300 text-[11px] font-medium hidden sm:inline">
          Sesión: <strong className="text-white">{adminEmail}</strong>
        </span>
        <span className="bg-emerald-950/80 text-[#48A82D] border border-[#48A82D]/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
          {isFirebaseActive ? 'Firebase Conectado' : 'Modo Offline'}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {seedMsg && (
          <span className="text-[#48A82D] font-bold text-[11px] animate-fadeIn flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{seedMsg}</span>
          </span>
        )}

        {totalPropertiesCount === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Importar las propiedades de muestra iniciales a Firebase"
          >
            <Database className="w-3.5 h-3.5 text-[#48A82D]" />
            <span>{seeding ? 'Subiendo...' : 'Importar Muestras'}</span>
          </button>
        )}

        <button
          onClick={onOpenAddProperty}
          className="bg-[#48A82D] hover:bg-[#3C8F24] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cargar Nueva Propiedad</span>
        </button>

        <button
          onClick={onLogout}
          className="bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-400 border border-zinc-700 hover:border-red-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="Cerrar sesión de administrador"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
};
