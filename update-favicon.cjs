const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, 'public/images/logo-icon-128.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#24221F"/>
  <image href="data:image/png;base64,${b64}" x="7" y="7" width="50" height="50"/>
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'public/favicon.svg'), svg);
console.log('Favicon updated with user logo!');
