import React, { useRef, useState } from 'react';
import { Plus, LogOut, ShieldCheck, CheckCircle2, Download, Upload, FileText } from 'lucide-react';

interface AdminBarProps {
  adminEmail: string;
  onOpenAddProperty: () => void;
  onLogout: () => void;
  isFirebaseActive: boolean;
  totalPropertiesCount: number;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenAddProperty,
  onLogout,
  totalPropertiesCount,
  onExportBackup,
  onImportBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportBackup) {
      onImportBackup(file);
      setMsg('¡Copia de seguridad importada!');
      setTimeout(() => setMsg(''), 4000);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-2.5 sm:py-3 min-h-[52px] flex items-center justify-between gap-3 shadow-lg">
      {/* Left side: Administrator indicator & Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#48A82D] animate-pulse"></span>
          <span className="text-zinc-100 font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#48A82D]" />
            <span className="hidden sm:inline">Modo Administrador</span>
          </span>
        </div>
        <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-700 font-medium">
          {totalPropertiesCount} {totalPropertiesCount === 1 ? 'propiedad' : 'propiedades'}
        </span>
      </div>

      {/* Right side: Action buttons & Backup controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {msg && (
          <span className="text-[#48A82D] font-semibold text-xs flex items-center gap-1 mr-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </span>
        )}

        {/* Hidden File Input for Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Backup Export Button */}
        {onExportBackup && (
          <button
            type="button"
            onClick={onExportBackup}
            className="bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-zinc-200 border border-zinc-700/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Descargar copia de seguridad en archivo JSON"
          >
            <Download className="w-4 h-4 text-[#48A82D]" />
            <span className="hidden md:inline">Descargar Backup</span>
          </button>
        )}

        {/* Backup Import Button */}
        {onImportBackup && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-zinc-200 border border-zinc-700/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Restaurar propiedades desde archivo JSON"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Importar Backup</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenAddProperty}
          className="bg-[#48A82D] hover:bg-[#3C8F24] active:scale-[0.98] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>Cargar Propiedad</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="bg-zinc-900 hover:bg-zinc-800 hover:text-white active:scale-[0.98] text-zinc-300 border border-zinc-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          title="Cerrar sesión de administrador"
        >
          <LogOut className="w-4 h-4 text-zinc-400" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
};

