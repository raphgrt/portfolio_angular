const fs = require('fs');
const path = require('path');

const environmentFilePath = path.join(__dirname, 'src/environments/environment.ts');
const apiToken = process.env.API_TOK || '';

const content = `export const environment = {
  production: false,
  apiToken: '${apiToken}'
};`;

fs.writeFileSync(environmentFilePath, content);
console.log('Environment file generated.');
