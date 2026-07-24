import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Lock } from 'lucide-react';
import { OperationType } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onSelectOperation: (op: OperationType | 'TODAS') => void;
  onOpenValuationModal: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectOperation,
  onOpenValuationModal,
  onOpenAdminLogin,
}) => {
  return (
    <footer id="contacto" className="bg-[#181818] text-zinc-300 pt-16 pb-8 border-t-4 border-[#48A82D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />

            <p className="text-xs text-zinc-400 leading-relaxed pt-2">
              Gestión inmobiliaria integral, venta y alquiler de viviendas, tasaciones profesionales y comercialización de lotes, quintas y campos en General La Madrid, Laprida y la zona.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onSelectOperation('VENTA')}
                  className="hover:text-[#48A82D] transition-colors cursor-pointer"
                >
                  Propiedades en Venta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('ALQUILER')}
                  className="hover:text-[#48A82D] transition-colors cursor-pointer"
                >
                  Propiedades en Alquiler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('LOTES')}
                  className="hover:text-[#48A82D] transition-colors cursor-pointer"
                >
                  Lotes y Terrenos en Barrio Cerrado
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenValuationModal}
                  className="hover:text-[#48A82D] transition-colors cursor-pointer"
                >
                  Solicitar Tasación Inmobiliaria
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
              Contacto Directo
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#48A82D] shrink-0 mt-0.5" />
                <span>Sede Central en General La Madrid (Bs. As.) • Atención en Laprida y la zona.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#48A82D] shrink-0" />
                <a href="tel:+5491155218899" className="hover:text-white font-semibold">
                  +54 9 11 5521-8899
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#48A82D] shrink-0" />
                <a href="mailto:contacto@mefnegociosinmobiliarios.ar" className="hover:text-white">
                  contacto@mefnegociosinmobiliarios.ar
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#48A82D] shrink-0" />
                <span>Lun a Vie: 9:00 a 18:30 hs | Sáb: 10:00 a 13:00 hs</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Fast WhatsApp CTA */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
              Atención Inmediata
            </h4>
            <p className="text-xs text-zinc-400">
              Chateá directamente con nuestro equipo de asesores inmobiliarios.
            </p>
            <a
              href="https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Negocios%20Inmobiliarios,%20quisiera%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Abrir WhatsApp Directo</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>© {new Date().getFullYear()} MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios. Todos los derechos reservados.</span>
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer p-0.5 rounded opacity-40 hover:opacity-100"
                title="Acceso de Administración"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400">Políticas de Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
