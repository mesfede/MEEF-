const fs = require('fs');

// 1. Update App.tsx catalog filter buttons size (+20%)
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const appOldTarget = `<div className="bg-zinc-200/70 p-1 rounded-xl flex gap-1">
                {(['TODAS', 'VENTA', 'ALQUILER', 'LOTES'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => handleUpdateFilters({ operation: op })}
                    className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer \${
                      filters.operation === op
                        ? 'bg-[#181818] text-white shadow-xs'
                        : 'text-zinc-700 hover:text-zinc-900'
                    }\`}
                  >
                    {op === 'TODAS' ? 'Todas' : op}
                  </button>
                ))}`;

const appNewReplacement = `<div className="bg-zinc-200/80 p-1.5 sm:p-2 rounded-2xl flex gap-1.5 sm:gap-2 shadow-xs">
                {(['TODAS', 'VENTA', 'ALQUILER', 'LOTES'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => handleUpdateFilters({ operation: op })}
                    className={\`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer \${
                      filters.operation === op
                        ? 'bg-[#181818] text-white shadow-md'
                        : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300/50'
                    }\`}
                  >
                    {op === 'TODAS' ? 'Todas' : op}
                  </button>
                ))}`;

if (appContent.includes(appOldTarget)) {
  appContent = appContent.replace(appOldTarget, appNewReplacement);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Successfully updated catalog tabs in App.tsx");
} else {
  console.log("Could not find appOldTarget in App.tsx");
}

// 2. Update PropertyCard.tsx
let cardContent = fs.readFileSync('src/components/PropertyCard.tsx', 'utf8');

// Ensure Trees icon is imported if needed
if (!cardContent.includes('Trees')) {
  cardContent = cardContent.replace(
    "import { Heart, MapPin, Maximize, Bed, Bath, Car,",
    "import { Heart, MapPin, Maximize, Bed, Bath, Car, Trees,"
  );
}

const cardSpecsOld = `{/* SPECS STRIP */}
        <div className="pt-3 border-t border-zinc-100 grid grid-cols-4 gap-2 text-center text-xs text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl">
          {property.operation === 'LOTES' || property.type === 'Lote / Terreno' ? (
            <>
              <div className="col-span-2 flex flex-col items-center">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Superficie Lote</span>
                <span className="font-bold text-zinc-800">{property.totalArea} m²</span>
              </div>
              <div className="col-span-2 flex flex-col items-center">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Acceso Agua</span>
                <span className="font-bold text-[#48A82D]">
                  {property.lotFeatures?.waterAccess ? 'Sí (Al Lago)' : 'Terreno Plano'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <Maximize className="w-3.5 h-3.5 text-[#48A82D] mb-0.5" />
                <span className="font-bold text-zinc-800">{property.coveredArea > 0 ? \`\${property.coveredArea} m²\` : '—'}</span>
                <span className="text-[9px] text-zinc-400">Cubiertos</span>
              </div>
              <div className="flex flex-col items-center">
                <Bed className="w-3.5 h-3.5 text-[#48A82D] mb-0.5" />
                <span className="font-bold text-zinc-800">{property.bedrooms > 0 ? property.bedrooms : '—'}</span>
                <span className="text-[9px] text-zinc-400">Dorm.</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath className="w-3.5 h-3.5 text-[#48A82D] mb-0.5" />
                <span className="font-bold text-zinc-800">{property.bathrooms > 0 ? property.bathrooms : '—'}</span>
                <span className="text-[9px] text-slate-400">Baños</span>
              </div>
              <div className="flex flex-col items-center">
                <Car className="w-3.5 h-3.5 text-[#48A82D] mb-0.5" />
                <span className="font-bold text-zinc-800">{property.garages > 0 ? property.garages : '—'}</span>
                <span className="text-[9px] text-zinc-400">Cocheras</span>
              </div>
            </>
          )}
        </div>`;

const cardSpecsNew = `{/* SPECS STRIP */}
        <div className="pt-3 border-t border-zinc-100 grid grid-cols-4 gap-1.5 text-center bg-zinc-50/90 py-3 px-2 rounded-xl">
          {property.operation === 'LOTES' || property.type === 'Lote / Terreno' ? (
            <>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm leading-none">{property.totalArea} m²</span>
                <Maximize className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#48A82D] text-xs leading-none">
                  {property.lotFeatures?.waterAccess ? 'Agua' : 'Plano'}
                </span>
                <Trees className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.coveredArea > 0 ? \`\${property.coveredArea} m²\` : '—'}
                </span>
                <Maximize className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.bedrooms > 0 ? property.bedrooms : '—'}
                </span>
                <Bed className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.bathrooms > 0 ? property.bathrooms : '—'}
                </span>
                <Bath className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.garages > 0 ? property.garages : '—'}
                </span>
                <Car className="w-4 h-4 text-[#48A82D] mt-1.5" />
              </div>
            </>
          )}
        </div>`;

if (cardContent.includes(cardSpecsOld)) {
  cardContent = cardContent.replace(cardSpecsOld, cardSpecsNew);
  fs.writeFileSync('src/components/PropertyCard.tsx', cardContent);
  console.log("Successfully updated PropertyCard.tsx specs strip");
} else {
  console.log("Could not find cardSpecsOld in PropertyCard.tsx");
}

// 3. Update RecentSpotlight.tsx
let spotlightContent = fs.readFileSync('src/components/RecentSpotlight.tsx', 'utf8');

const spotlightOld = `<div className="grid grid-cols-4 gap-2 text-center text-xs bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase">Superficie</span>
              <span className="font-bold text-white">{spotlightProperty.coveredArea || spotlightProperty.totalArea} m²</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Dormitorios</span>
              <span className="font-bold text-white">{spotlightProperty.bedrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Baños</span>
              <span className="font-bold text-white">{spotlightProperty.bathrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Operación</span>
              <span className="font-bold text-[#48A82D]">{spotlightProperty.operation}</span>
            </div>
          </div>`;

const spotlightNew = `<div className="grid grid-cols-4 gap-2 text-center bg-zinc-800/80 py-3 px-2 rounded-xl border border-zinc-700/60">
            <div className="flex flex-col items-center justify-center">
              <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                {spotlightProperty.coveredArea || spotlightProperty.totalArea ? \`\${spotlightProperty.coveredArea || spotlightProperty.totalArea} m²\` : '—'}
              </span>
              <Maximize className="w-4 h-4 text-[#48A82D] mt-1.5" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                {spotlightProperty.bedrooms || '—'}
              </span>
              <Bed className="w-4 h-4 text-[#48A82D] mt-1.5" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                {spotlightProperty.bathrooms || '—'}
              </span>
              <Bath className="w-4 h-4 text-[#48A82D] mt-1.5" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                {spotlightProperty.garages || '—'}
              </span>
              <Car className="w-4 h-4 text-[#48A82D] mt-1.5" />
            </div>
          </div>`;

if (spotlightContent.includes(spotlightOld)) {
  spotlightContent = spotlightContent.replace(spotlightOld, spotlightNew);
  fs.writeFileSync('src/components/RecentSpotlight.tsx', spotlightContent);
  console.log("Successfully updated RecentSpotlight.tsx specs strip");
} else {
  console.log("Could not find spotlightOld in RecentSpotlight.tsx");
}

