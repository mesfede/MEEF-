import React, { useState } from 'react';
import { X, Calculator, CheckCircle2, Building2, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { OperationType, PropertyType, ValuationRequest } from '../types';

interface TasacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasacionModal: React.FC<TasacionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ValuationRequest>({
    fullName: '',
    email: '',
    phone: '',
    propertyType: 'Casa',
    operationType: 'VENTA',
    address: '',
    cityZone: 'Nordelta',
    totalArea: '',
    bedrooms: '3',
    comments: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios, solicito tasación profesional:\n- Nombre: ${formData.fullName}\n- Tipo: ${formData.propertyType} (${formData.operationType})\n- Ubicación: ${formData.address}, ${formData.cityZone}\n- Superficie: ${formData.totalArea} m2\n- Tel: ${formData.phone}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="bg-[#181818] text-white p-5 flex items-center justify-between border-b border-[#48A82D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#48A82D] rounded-lg text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Tasaciones Profesionales</h2>
              <p className="text-xs text-[#48A82D] font-medium">MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#48A82D]/10 text-[#48A82D] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                ¡Solicitud de Tasación Recibida!
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Un tasador matriculado de MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios analizará las características de tu inmueble y te contactará en menos de 24 hs.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/5491155218899?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#48A82D] hover:bg-[#3C8F24] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Enviar por WhatsApp Directo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-zinc-600">
                Completá el formulario para obtener una tasación real de mercado para venta o alquiler de tu casa, departamento o lote.
              </p>

              {/* Operation & Property Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Tipo de Operación</label>
                  <select
                    value={formData.operationType}
                    onChange={(e) =>
                      setFormData({ ...formData, operationType: e.target.value as OperationType })
                    }
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#48A82D]"
                  >
                    <option value="VENTA">Quiero Vender</option>
                    <option value="ALQUILER">Quiero Alquilar</option>
                    <option value="LOTES">Vender Lote / Terreno</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Tipo de Inmueble</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyType: e.target.value as PropertyType })
                    }
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#48A82D]"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Lote / Terreno">Lote / Terreno</option>
                    <option value="Barrio Cerrado">Barrio Cerrado</option>
                    <option value="PH">PH</option>
                    <option value="Local / Oficina">Local / Oficina</option>
                  </select>
                </div>
              </div>

              {/* Location Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Dirección o Barrio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Los Castores Lote 45"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Zona / Localidad</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Nordelta, Tigre, San Isidro"
                    value={formData.cityZone}
                    onChange={(e) => setFormData({ ...formData, cityZone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              {/* Area & Rooms */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Superficie Aprox (m²)</label>
                  <input
                    type="number"
                    placeholder="Ej: 250 m2"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Dormitorios / Ambientes</label>
                  <input
                    type="text"
                    placeholder="Ej: 3 dorms + dependencia"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    required
                    placeholder="Tu Teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 mb-1 block">Observaciones adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la propiedad, estado, año de construcción..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#48A82D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#48A82D] hover:bg-[#3C8F24] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Solicitar Tasación Profesional
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
