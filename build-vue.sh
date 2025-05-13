#!/bin/bash

# Script per compilare sia Vue.js che il server Express

echo "Starting build process..."

# Compilazione di Vue.js
echo "Building Vue.js application..."
cd vue-app
npm install
npm run build
cd ..

# Compilazione del server Express
echo "Building Express server..."
npm run build

# Verifica che la directory dist/server esista
if [ ! -d "dist/server" ]; then
  echo "Creating dist/server directory..."
  mkdir -p dist/server
fi

# Copia il file index.js nella directory corretta
if [ -f "dist/index.js" ]; then
  echo "Moving index.js to correct location..."
  cp dist/index.js dist/server/index.js
fi

echo "Build completed successfully!"
echo "You can start the application in production mode with: npm run start"