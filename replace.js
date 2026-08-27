const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('getToken({ req: request })')) {
    content = content.replace(/getToken\(\{\s*req:\s*request\s*\}\)/g, 'getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })');
    fs.writeFileSync(file, content);
    console.log('Updated:', file);
  }
}
