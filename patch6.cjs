const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };`;

const replacement = `  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };`;

if (content.includes(target)) {
  fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
  console.log("Patched App.tsx successfully");
} else {
  console.log("Could not find target block in App.tsx");
}
