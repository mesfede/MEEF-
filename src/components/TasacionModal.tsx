import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { PropertyType, ValuationRequest } from '../types';

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
    cityZone: 'Gral. La Madrid',
    totalArea: '',
    bedrooms: '',
    comments: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Por favor complete Nombre Completo y Teléfono de Contacto.');
      return;
    }

    const message = encodeURIComponent(
      `Hola MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios, solicito tasación para:\n- Tipo de Inmueble: ${formData.propertyType}\n- Ubicación: ${formData.address || 'No especificada'}, ${formData.cityZone}\n- Nombre: ${formData.fullName}\n- Teléfono: ${formData.phone}${formData.comments ? `\n- Observaciones: ${formData.comments}` : ''}`
    );

    const waUrl = `https://wa.me/5492284603168?text=${message}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="bg-[#181818] text-white p-5 flex items-center justify-between border-b border-[#48A82D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#48A82D] rounded-lg text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Tasaciones</h2>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-600">
              Completá los datos a continuación para solicitar la tasación de tu inmueble.
            </p>

              {/* Tipo de Inmueble */}
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
                  <option value="Campo / Quinta">Campo / Quinta</option>
                  <option value="Barrio Cerrado">Barrio Cerrado</option>
                  <option value="PH">PH</option>
                  <option value="Local / Oficina">Local / Oficina</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              {/* Location & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Dirección o Referencia</label>
                  <input
                    type="text"
                    placeholder="Ej: San Martín 450"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">Zona / Localidad</label>
                  <input
                    type="text"
                    placeholder="Ej: Gral. La Madrid"
                    value={formData.cityZone}
                    onChange={(e) => setFormData({ ...formData, cityZone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              {/* Mandatory Contact Information */}
              <div className="pt-2 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 mb-1 block">
                    Teléfono de Contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Tu Teléfono de contacto"
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
                  placeholder="Detalles sobre el estado del inmueble o consulta..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#48A82D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#48A82D] hover:bg-[#3C8F24] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Solicitar Tasación
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};
