import React from 'react';
import { MessageCircle, ArrowRight, Instagram, Camera, Globe } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/5491155218899?text=${encodeURIComponent(
    'Hola Maria Eugenia! Quisiera consultarte para vender, comprar o tasar una propiedad.'
  )}`;

  return (
    <section id="nosotros" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-2xl p-6 sm:p-8 lg:p-10 text-white border border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#48A82D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 text-left">
          {/* Badge */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#181818] border border-[#48A82D]/50 text-[#48A82D] text-[11px] sm:text-xs font-extrabold uppercase tracking-wider">
              ¿Querés vender, comprar o tasar?
            </span>
          </div>

          {/* Headline - Exactly 2 lines */}
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight leading-tight">
            <span className="block text-white">Vendé o alquilá con tranquilidad,</span>
            <span className="block text-[#48A82D]">te acompañamos con la mejor difusión.</span>
          </h2>

          {/* Subtitle & Action Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pt-1">
            <div className="max-w-4xl space-y-3">
              <div className="text-xs sm:text-sm md:text-[15px] text-zinc-300 font-medium leading-tight space-y-1">
                <p className="whitespace-normal md:whitespace-nowrap">
                  Presentamos tu inmueble con <strong className="text-white font-semibold">fotos y video HD</strong>, publicaciones en <strong className="text-white font-semibold">Instagram</strong> y difusión en nuestra <strong className="text-white font-semibold">web</strong>.
                </p>
                <p className="whitespace-normal md:whitespace-nowrap text-zinc-300">
                  Sumamos atención personalizada y transparente en todo el proceso.
                </p>
              </div>

              {/* Compact feature chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 hover:border-[#48A82D] hover:bg-zinc-800 hover:text-white text-xs font-bold text-zinc-200 transition-all cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Fotos & Video HD</span>
                </a>
                <a
                  href="https://www.instagram.com/mef_negociosinmobiliarios/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 hover:border-pink-500 hover:bg-zinc-800 hover:text-white text-xs font-bold text-zinc-200 transition-all cursor-pointer shadow-xs"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/60 hover:border-blue-400 hover:bg-zinc-800 hover:text-white text-xs font-bold text-zinc-200 transition-all cursor-pointer shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Web 24/7</span>
                </a>
              </div>
            </div>

            {/* WhatsApp button */}
            <div className="w-full lg:w-auto shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#48A82D] hover:bg-[#3d9124] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribinos por WhatsApp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
