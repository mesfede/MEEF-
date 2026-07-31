const fs = require('fs');
const content = fs.readFileSync('src/components/HeroSearch.tsx', 'utf8');

const target = `        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-zinc-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#48A82D]" />
            <span>Asesoramiento Legal e Inmobiliario</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#48A82D]" />
            <span>Tasaciones Profesionales</span>
          </div>
          <div className="flex items-center gap-2">
            <Trees className="w-4 h-4 text-[#48A82D]" />
            <span>Casas, Quintas, Lotes y Campos</span>
          </div>
        </div>`;

const replacement = ``;

if (content.includes(target)) {
  fs.writeFileSync('src/components/HeroSearch.tsx', content.replace(target, replacement));
  console.log("Patched HeroSearch.tsx successfully");
} else {
  console.log("Could not find target block in HeroSearch.tsx");
}
