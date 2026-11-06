const fs = require('fs');
const html = fs.readFileSync('C:/Users/mi/AN/index.html', 'utf8');
const matches = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Referenced assets in index.html:');
[...new Set(matches)].forEach(src => console.log(' -', src));
