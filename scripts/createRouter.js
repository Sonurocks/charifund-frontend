const fs = require('fs');
const path = require('path');

const routes = [
  'dashboard', 'members', 'settings', 'campaign', 'event', 'category', 'blog', 'comments', 'banner', 'queries', 'feedback'
];

routes.forEach(route => {
  const dir = path.join('g:/charifund/charifund-frontend/src/app/admin/', route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const componentName = route.charAt(0).toUpperCase() + route.slice(1);
  const content = `import ${componentName} from '@/src/components/Admin/${componentName}';\n\nexport default function Page() {\n  return <${componentName} />;\n}\n`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log("Routes created successfully!");
