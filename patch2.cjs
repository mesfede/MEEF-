const fs = require('fs');
const content = fs.readFileSync('src/components/HeroSearch.tsx', 'utf8');

const replacement = content.replace(
  "const speed = isDeleting ? 25 : 50;",
  "const speed = isDeleting ? 40 : 100;"
);

fs.writeFileSync('src/components/HeroSearch.tsx', replacement);
console.log("Patched HeroSearch.tsx successfully");
