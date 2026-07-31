const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update WhatsApp Button class
const whatsappOldClass = `        className={\`fixed bottom-5 left-0 right-0 z-30 pointer-events-none flex justify-end max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 \${
          isMenuOpen || filterModalOpen || valuationModalOpen || favoritesDrawerOpen || googleMapsModalOpen || selectedProperty || adminLoginModalOpen || adminPropertyModalOpen
            ? 'opacity-0 pointer-events-none scale-90'
            : scrollY > 50
            ? 'opacity-40 hover:opacity-100 scale-95 hover:scale-105'
            : 'opacity-100 scale-100 hover:scale-105'
        }\`}`;

const whatsappNewClass = `        className={\`fixed bottom-5 left-0 right-0 z-30 pointer-events-none flex justify-end max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 \${
          isMenuOpen || filterModalOpen || valuationModalOpen || favoritesDrawerOpen || googleMapsModalOpen || selectedProperty || adminLoginModalOpen || adminPropertyModalOpen
            ? 'opacity-0 pointer-events-none'
            : scrollY > 50
            ? 'opacity-30 hover:opacity-100'
            : 'opacity-100'
        }\`}`;

if (content.includes(whatsappOldClass)) {
  content = content.replace(whatsappOldClass, whatsappNewClass);
  console.log("Updated WhatsApp button classes");
} else {
  console.log("Could not match exact whatsappOldClass");
}

// 2. Add subtle map background image to main container
const mainOld = `<main className="flex-1">`;
const mainNew = `<main className="flex-1 relative bg-zinc-50 overflow-hidden">
        {/* Subtle Map Watermark Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.09] bg-cover bg-center bg-fixed mix-blend-multiply filter contrast-125 grayscale"
          style={{ backgroundImage: "url('/map-bg.jpg')" }}
        />
        <div className="relative z-10">`;

if (content.includes(mainOld)) {
  // Also need to close the inner z-10 div before </main>
  content = content.replace(mainOld, mainNew);
  content = content.replace('</main>', '</div>\n      </main>');
  console.log("Updated main section with map background");
} else {
  console.log("Could not find mainOld");
}

fs.writeFileSync('src/App.tsx', content);
