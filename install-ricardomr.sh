#!/bin/bash

# ==============================================
# 🍓 INSTALADOR PARA ricardomr@192.168.0.250
# Manantial de los Secretos v2.0
# ==============================================

echo "🔮 Instalación personalizada para ricardomr"
echo "============================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar usuario
if [ "$USER" != "ricardomr" ]; then
    print_error "Este script debe ejecutarse como usuario 'ricardomr'"
    print_status "Usuario actual: $USER"
    exit 1
fi

print_success "Usuario correcto: $USER"

# Ir al directorio home
cd /home/ricardomr

# Verificar si el archivo ZIP está presente
if [ -f "manantial-secretos-raspberry.zip" ]; then
    print_status "Archivo ZIP encontrado"
elif [ -f "ManatialDeLosSecretos.zip" ]; then
    print_status "Archivo ZIP alternativo encontrado"
    mv "ManatialDeLosSecretos.zip" "manantial-secretos-raspberry.zip"
else
    print_error "No se encontró el archivo ZIP"
    print_status "Archivos disponibles en /home/ricardomr:"
    ls -la /home/ricardomr/ | grep -i zip
    exit 1
fi

# Crear directorio manantial si no existe
if [ -d "manantial" ]; then
    print_warning "El directorio 'manantial' ya existe"
    read -p "¿Hacer backup y continuar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        print_status "Creando backup..."
        mkdir -p backups
        tar -czf "backups/manantial-backup-$TIMESTAMP.tar.gz" manantial
        rm -rf manantial
        print_success "Backup creado: backups/manantial-backup-$TIMESTAMP.tar.gz"
    else
        print_error "Instalación cancelada"
        exit 1
    fi
fi

# Extraer ZIP
print_status "Extrayendo archivos..."
unzip -q manantial-secretos-raspberry.zip

# Verificar si se extrajo ManatialDeLosSecretos o directamente los archivos
if [ -d "ManatialDeLosSecretos" ]; then
    print_status "Renombrando directorio a 'manantial'..."
    mv ManatialDeLosSecretos manantial
elif [ -f "server.js" ]; then
    print_status "Archivos extraídos directamente, creando directorio manantial..."
    mkdir -p manantial
    mv *.js *.json *.md *.sh data public manantial/ 2>/dev/null
else
    print_error "Estructura de archivos no reconocida"
    ls -la
    exit 1
fi

# Ir al directorio del proyecto
cd manantial

# Verificar archivos esenciales
if [ ! -f "server.js" ]; then
    print_error "server.js no encontrado"
    exit 1
fi

if [ ! -f "package.json" ]; then
    print_error "package.json no encontrado"
    exit 1
fi

print_success "Archivos del proyecto verificados ✓"

# Actualizar sistema
print_status "Actualizando sistema Ubuntu Server..."
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas para Ubuntu Server
print_status "Instalando herramientas esenciales..."
sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_status "Instalando Node.js 18 LTS para Ubuntu..."
    # Método alternativo más confiable para Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verificar instalación
    if ! command -v node &> /dev/null; then
        print_warning "Método NodeSource falló, intentando con snap..."
        sudo snap install node --classic
    fi
else
    print_success "Node.js $(node --version) ya está instalado"
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | sed 's/v//')
print_success "Node.js versión: $NODE_VERSION"
print_success "npm versión: $(npm --version)"

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Instalando PM2 globalmente..."
    sudo npm install -g pm2@latest
    
    # Agregar npm global bin al PATH si no está
    if ! echo $PATH | grep -q "/usr/bin"; then
        echo 'export PATH=$PATH:/usr/bin' >> ~/.bashrc
        export PATH=$PATH:/usr/bin
    fi
else
    print_success "PM2 ya está instalado - versión: $(pm2 --version)"
fi

# Crear directorios necesarios
print_status "Creando directorios..."
mkdir -p /home/ricardomr/logs
mkdir -p /home/ricardomr/backups

# Instalar dependencias
print_status "Instalando dependencias npm..."
npm install

# Configurar .env si no existe
if [ ! -f ".env" ]; then
    print_status "Creando archivo .env..."
    cat > .env << EOF
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secretos2024
SESSION_SECRET=$(openssl rand -hex 64)
DEVELOPMENT_MODE=false
SESSION_MAX_AGE=86400000
EOF
    print_success "Archivo .env creado"
fi

# Crear directorio data si no existe
mkdir -p data

# Configurar firewall UFW (Ubuntu Server)
print_status "Configurando firewall UFW para Ubuntu Server..."
sudo ufw status || sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw --force enable
sudo ufw status numbered
print_success "Firewall UFW configurado correctamente para Ubuntu Server"

# Detener cualquier proceso PM2 anterior
pm2 delete all 2>/dev/null || true

# Iniciar con PM2
print_status "Iniciando aplicación con PM2..."
pm2 start pm2.config.js

# Configurar PM2 para iniciar automáticamente
print_status "Configurando PM2 para inicio automático..."
sudo env PATH=$PATH:/usr/bin:/usr/local/bin pm2 startup systemd -u ricardomr --hp /home/ricardomr
pm2 save

# Verificar configuración de systemd
print_status "Verificando configuración de systemd..."
sudo systemctl status pm2-ricardomr --no-pager || true

# Obtener IP
PI_IP=$(hostname -I | awk '{print $1}')

echo
echo "=============================================="
echo "🎉 ¡INSTALACIÓN COMPLETADA! 🎉"
echo "=============================================="
echo
echo "🌐 URLs de acceso:"
echo "   Local: http://localhost:3000"
echo "   Red local: http://$PI_IP:3000" 
echo "   Login admin: http://$PI_IP:3000/login"
echo
echo "🔐 Credenciales:"
echo "   Usuario: admin"
echo "   Contraseña: secretos2024"
echo
echo "📁 Ubicación: /home/ricardomr/manantial"
echo "📊 Logs: /home/ricardomr/logs"
echo
echo "🛠️ Comandos útiles:"
echo "   pm2 logs manantial-secretos"
echo "   pm2 restart manantial-secretos"
echo "   pm2 status"
echo
echo "🔮 ¡Manantial de los Secretos está funcionando!"

print_success "Instalación completada para usuario ricardomr"