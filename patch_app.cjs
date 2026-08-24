const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add URL routing logic
const routingLogic = `
  // Handle URL routing for properties
  useEffect(() => {
    if (properties.length === 0) return;
    const searchParams = new URLSearchParams(window.location.search);
    const propId = searchParams.get('propiedad');
    if (propId) {
      const property = properties.find(p => p.id === propId);
      if (property && (!selectedProperty || selectedProperty.id !== propId)) {
        setSelectedProperty(property);
      }
    }
  }, [properties]);

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const propId = searchParams.get('propiedad');
      if (propId) {
        const property = properties.find(p => p.id === propId);
        if (property) setSelectedProperty(property);
      } else {
        setSelectedProperty(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties]);
`;

code = code.replace(
  "// Reset page when filters change",
  routingLogic + "\n  // Reset page when filters change"
);

// 2. Wrap setSelectedProperty with URL updates
const handlePropertySelect = `
  const handlePropertySelect = (p: Property | null) => {
    setSelectedProperty(p);
    if (p) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('propiedad', p.id);
      window.history.pushState({}, '', newUrl.toString());
      document.title = \`\${p.title} - MARÍA EUGENIA FERNÁNDEZ\`;
    } else {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('propiedad');
      window.history.pushState({}, '', newUrl.toString());
      document.title = 'MARÍA EUGENIA FERNÁNDEZ | Negocios Inmobiliarios';
    }
  };
`;

code = code.replace(
  "// Global UI State",
  "// Global UI State\n" + handlePropertySelect
);

// 3. Replace all "setSelectedProperty" with "handlePropertySelect", EXCEPT for the state setter and the declaration itself.
// Since we have `setSelectedProperty(p)`, we can replace them using regex or string match.
code = code.replace(/onSelectProperty=\{\(p\) => setSelectedProperty\(p\)\}/g, "onSelectProperty={(p) => handlePropertySelect(p)}");
code = code.replace(/onClose=\{\(\) => setSelectedProperty\(null\)\}/g, "onClose={() => handlePropertySelect(null)}");

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully');
