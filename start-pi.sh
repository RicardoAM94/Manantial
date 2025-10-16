#!/bin/bash

# Script de inicio para Raspberry Pi
# Manantial de los Secretos

echo "🔮 Iniciando Manantial de los Secretos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Configurar PM2
echo "🚀 Configurando PM2..."
pm2 start ecosystem.config.js

# Configurar PM2 para inicio automático
pm2 startup
pm2 save

echo "✅ Manantial de los Secretos iniciado correctamente!"
echo "🌐 La aplicación está corriendo en:"
echo "   - Local: http://localhost:3000"
echo "   - Red: http://$(hostname -I | cut -d' ' -f1):3000"
echo ""
echo "📊 Para monitorear la aplicación usa: pm2 monit"
echo "🔄 Para reiniciar: pm2 restart manantial"
echo "🛑 Para detener: pm2 stop manantial"