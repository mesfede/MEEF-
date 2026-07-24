const fs = require('fs');
let file = './src/components/AdminPropertyModal.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/img\.onerror = null;\s*img\.src =\s*'([^']+)';/g, "if (img.dataset.hasError) return; img.dataset.hasError = 'true'; img.src = '$1';");
fs.writeFileSync(file, content);
console.log('Fixed admin modal');
