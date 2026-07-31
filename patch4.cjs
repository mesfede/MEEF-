const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(/handleNavClick\('propiedades', 'VENTA'\)/g, "handleNavClick('catalogo', 'VENTA')");
content = content.replace(/handleNavClick\('propiedades', 'ALQUILER'\)/g, "handleNavClick('catalogo', 'ALQUILER')");
content = content.replace(/handleNavClick\('propiedades', 'LOTES'\)/g, "handleNavClick('catalogo', 'LOTES')");

fs.writeFileSync('src/components/Header.tsx', content);
console.log("Patched Header.tsx successfully");
