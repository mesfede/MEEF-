import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Sparkles, Building2, Trees, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#48A82D] uppercase tracking-widest bg-[#48A82D]/10 px-3.5 py-1 rounded-full">
            Nuestra Identidad
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Una empresa comprometida con la excelencia, la transparencia y el acompañamiento personalizado en cada operación inmobiliaria en General La Madrid y la región.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-[#181818] text-[#48A82D] rounded-xl flex items-center justify-center border border-zinc-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Seguridad Legal</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Verificación rigurosa de títulos, análisis dominiales y respaldo notarial en cada boleto de compraventa y contrato de alquiler.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-[#181818] text-[#48A82D] rounded-xl flex items-center justify-center border border-zinc-800">
              <Trees className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Especialistas en la Región</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Profundo conocimiento del mercado inmobiliario local en General La Madrid, Laprida, Coronel Suárez y campos de la zona.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-[#181818] text-[#48A82D] rounded-xl flex items-center justify-center border border-zinc-800">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Trato Personalizado</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Atención cercana y profesional conducida directamente por sus titulares para entender y cuidar cada detalle de tus proyectos.
            </p>
          </div>
        </div>

        {/* Banner quote */}
        <div className="bg-[#181818] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#48A82D] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs text-[#48A82D] font-bold uppercase tracking-widest block">
              ¿Querés vender o alquilar tu propiedad?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Publicá con el respaldo y la efectividad de nuestra firma
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Desplegamos estrategias de marketing digital de alto impacto y fotografía profesional para concretar tu venta al mejor valor de mercado.
            </p>
          </div>

          <a
            href="https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quiero%20publicar%20mi%20propiedad%20con%20ustedes."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#48A82D] hover:bg-[#3C8F24] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all shrink-0 cursor-pointer text-center"
          >
            Contactar Asesor Directo
          </a>
        </div>
      </div>
    </section>
  );
};
