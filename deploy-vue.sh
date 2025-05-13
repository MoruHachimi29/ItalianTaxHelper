#!/bin/bash

# Script per preparare il deployment dell'applicazione Vue.js su Replit

echo "Starting deployment build process..."

# Crea la directory dist/server se non esiste
mkdir -p dist/server

# Assicurati che vue-app/node_modules esista
echo "Checking Vue.js dependencies..."
if [ ! -d "vue-app/node_modules" ]; then
  echo "Installing Vue.js dependencies..."
  cd vue-app
  npm install
  cd ..
fi

# Compilazione di Vue.js
echo "Building Vue.js application..."
cd vue-app
npm run build
cd ..

echo "Vue.js build completed."

# Copia deploy-index.js nella directory di destinazione
echo "Copying deployment files..."

# Usa esbuild per compilare il file deploy-index.js
echo "Compiling server/deploy-index.js to dist/server/deploy-index.js..."
npx esbuild server/deploy-index.js --platform=node --packages=external --bundle --format=esm --outdir=dist/server

# Assicurati che i file necessari esistano
if [ -f "dist/server/deploy-index.js" ]; then
  echo "✓ Server entry point created successfully: dist/server/deploy-index.js"
else
  echo "✗ Error: Failed to create dist/server/deploy-index.js"
  exit 1
fi

if [ -d "vue-app/dist" ]; then
  echo "✓ Vue.js build completed successfully: vue-app/dist"
else
  echo "✗ Error: Vue.js build directory not found: vue-app/dist"
  exit 1
fi

echo "Deployment build completed successfully!"
echo "You can now deploy the application using Replit's deployment feature."