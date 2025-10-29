const fs = require('fs');
const path = require('path');

const configTemplatePath = path.join(__dirname, '../src/js/config.js');
const configOutputPath = path.join(
  __dirname,
  '../public/dist/config.injected.js'
);

const envVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_DEV_SEED_ENABLED',
  'VITE_USE_EMULATOR',
];

try {
  let configContent = fs.readFileSync(configTemplatePath, 'utf8');

  envVars.forEach(varName => {
    const placeholder = `%%${varName}%%`;
    const value = process.env[varName] || '';
    configContent = configContent.replace(new RegExp(placeholder, 'g'), value);
  });

  const outputDir = path.dirname(configOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(configOutputPath, configContent);
  console.log('✓ Config injected successfully to:', configOutputPath);

  const configDestPath = path.join(__dirname, '../public/src/js/config.js');
  const configDestDir = path.dirname(configDestPath);
  if (!fs.existsSync(configDestDir)) {
    fs.mkdirSync(configDestDir, { recursive: true });
  }
  fs.copyFileSync(configTemplatePath, configDestPath);

  let publicConfig = fs.readFileSync(configDestPath, 'utf8');
  envVars.forEach(varName => {
    const placeholder = `%%${varName}%%`;
    const value = process.env[varName] || '';
    publicConfig = publicConfig.replace(new RegExp(placeholder, 'g'), value);
  });
  fs.writeFileSync(configDestPath, publicConfig);
  console.log('✓ Config also copied to:', configDestPath);
} catch (error) {
  console.error('✗ Error injecting config:', error);
  process.exit(1);
}
