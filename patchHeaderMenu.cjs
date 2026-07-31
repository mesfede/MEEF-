const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Add onMenuToggle to HeaderProps
content = content.replace(
  '  isAdminLoggedIn?: boolean;',
  '  isAdminLoggedIn?: boolean;\n  onMenuToggle?: (isOpen: boolean) => void;'
);

// 2. Destructure onMenuToggle
content = content.replace(
  '  isAdminLoggedIn,',
  '  isAdminLoggedIn,\n  onMenuToggle,'
);

// 3. Add useEffect to notify parent when menuOpen changes
const targetUseEffect = `  const [menuOpen, setMenuOpen] = useState(false);`;
const replacementUseEffect = `  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    onMenuToggle?.(menuOpen);
  }, [menuOpen, onMenuToggle]);`;

content = content.replace(targetUseEffect, replacementUseEffect);

fs.writeFileSync('src/components/Header.tsx', content);
console.log("Patched Header.tsx menu toggle successfully");
