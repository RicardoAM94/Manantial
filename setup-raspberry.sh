#!/bin/bash

# ==============================================
# SETUP AUTOMÁTICO - MANANTIAL DE LOS SECRETOS
# ==============================================
# Script de instalación para Raspberry Pi con Ubuntu Server
# Clona desde GitHub e instala todo automáticamente

set -e  # Salir si hay algún error

echo "🌿 MANANTIAL DE LOS SECRETOS - SETUP AUTOMÁTICO"
echo "==============================================="
echo "📅 $(date)"
echo ""

# Configuración
PROJECT_NAME="Manantial"
PROJECT_DIR="/home/$USER/$PROJECT_NAME"
SERVICE_NAME="manantial-server"
GITHUB_REPO="https://github.com/RicardoAM94/Manantial.git"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs con colores
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar requisitos del sistema
check_system() {
    log_info "Verificando sistema..."
    
    # Verificar Ubuntu
    if ! grep -q "Ubuntu" /etc/os-release; then
        log_warning "Sistema no es Ubuntu, algunos comandos pueden fallar"
    fi
    
    # Verificar memoria disponible
    MEMORY_MB=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    if [ "$MEMORY_MB" -lt 512 ]; then
        log_warning "Memoria disponible baja: ${MEMORY_MB}MB (recomendado: >512MB)"
    fi
    
    # Verificar espacio en disco
    DISK_AVAILABLE=$(df -BM "$HOME" | awk 'NR==2 {print $4}' | sed 's/M//')
    if [ "$DISK_AVAILABLE" -lt 2048 ]; then
        log_warning "Espacio en disco bajo: ${DISK_AVAILABLE}MB (recomendado: >2GB)"
    fi
    
    log_success "Verificación del sistema completada"
}

# Función para actualizar el sistema
update_system() {
    log_info "Actualizando sistema operativo..."
    
    sudo apt update -y
    sudo apt upgrade -y
    
    # Instalar dependencias básicas
    sudo apt install -y curl wget git htop ufw
    
    log_success "Sistema actualizado correctamente"
}

# Función para instalar Node.js
install_nodejs() {
    log_info "Instalando Node.js..."
    
    if command_exists node; then
        NODE_VERSION=$(node --version)
        log_info "Node.js ya está instalado: $NODE_VERSION"
        
        # Verificar si es una versión compatible (>= 16)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            log_warning "Versión de Node.js muy antigua, actualizando..."
        else
            log_success "Versión de Node.js compatible"
            return 0
        fi
    fi
    
    # Instalar Node.js 18 LTS
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verificar instalación
    if command_exists node && command_exists npm; then
        log_success "Node.js $(node --version) y npm $(npm --version) instalados correctamente"
    else
        log_error "Error instalando Node.js"
        exit 1
    fi
}

# Función para clonar el repositorio
clone_repository() {
    log_info "Clonando repositorio desde GitHub..."
    
    # Eliminar directorio si existe
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "Directorio $PROJECT_DIR ya existe, eliminando..."
        rm -rf "$PROJECT_DIR"
    fi
    
    # Clonar repositorio
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
    
    if [ -d "$PROJECT_DIR" ]; then
        log_success "Repositorio clonado en $PROJECT_DIR"
        cd "$PROJECT_DIR"
    else
        log_error "Error clonando repositorio"
        exit 1
    fi
}

# Función para instalar dependencias del proyecto
install_dependencies() {
    log_info "Instalando dependencias del proyecto..."
    
    cd "$PROJECT_DIR"
    
    # Instalar dependencias
    npm install
    
    if [ $? -eq 0 ]; then
        log_success "Dependencias instaladas correctamente"
    else
        log_error "Error instalando dependencias"
        exit 1
    fi
}

# Función para configurar el proyecto
configure_project() {
    log_info "Configurando proyecto..."
    
    cd "$PROJECT_DIR"
    
    # Crear directorios necesarios si no existen
    mkdir -p data
    
    # Verificar que existan los archivos esenciales
    if [ ! -f "data/announcements.json" ]; then
        log_error "Archivo data/announcements.json no encontrado en el repositorio"
        log_info "Por favor, asegúrate de que el repositorio tenga la estructura completa"
        exit 1
    fi
    
    if [ ! -f "public/index.html" ]; then
        log_error "Archivo public/index.html no encontrado en el repositorio"
        log_info "Por favor, asegúrate de que el repositorio tenga la estructura completa"
        exit 1
    fi
    
    log_success "Archivos esenciales del proyecto verificados"
    
    # Copiar archivo de configuración de entorno
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_success "Archivo .env creado desde .env.example"
        
        # Generar secreto de sesión único
        SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
        sed -i "s/your-super-secret-session-key-change-this-in-production/$SESSION_SECRET/" .env
        
        log_info "Configuración inicial aplicada"
        log_warning "IMPORTANTE: Edita el archivo .env para personalizar credenciales de admin"
        log_warning "Ubicación: $PROJECT_DIR/.env"
    else
        log_info "Archivo .env ya existe, mantiendo configuración actual"
    fi
    
    # Crear config.json si no existe
    if [ ! -f "config.json" ]; then
        log_info "Creando config.json inicial..."
        cat > config.json << 'EOF'
{
  "whatsapp": {
    "number": "573148014430",
    "lastUpdated": "2025-10-16T00:00:00.000Z"
  },
  "site": {
    "title": "Manantial de los Secretos",
    "description": "Sanación y Terapias Alternativas",
    "theme": "default"
  },
  "admin": {
    "version": "1.0.0",
    "lastLogin": null
  }
}
EOF
        log_success "Archivo config.json creado"
    fi
    
    log_success "Configuración del proyecto completada"
}

# Función para limpiar servicios systemd anteriores
cleanup_old_services() {
    log_info "Limpiando servicios systemd anteriores..."
    
    # Detener y deshabilitar servicio si existe
    if sudo systemctl list-units --full -all | grep -Fq "$SERVICE_NAME.service"; then
        log_info "Deteniendo servicio existente..."
        sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
        sudo systemctl disable $SERVICE_NAME 2>/dev/null || true
    fi
    
    # Eliminar archivo de servicio si existe
    if [ -f "/etc/systemd/system/$SERVICE_NAME.service" ]; then
        log_info "Eliminando archivo de servicio anterior..."
        sudo rm -f "/etc/systemd/system/$SERVICE_NAME.service"
    fi
    
    # Recargar daemon
    sudo systemctl daemon-reload
    
    log_success "Servicios anteriores limpiados"
}

# Función para crear servicio systemd
create_systemd_service() {
    log_info "Creando servicio systemd..."

    # Detectar la ubicación de Node.js
    NODE_PATH=$(which node)
    log_info "Node.js encontrado en: $NODE_PATH"

    # Crear archivo de servicio
    sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Manantial de los Secretos - Sistema de Gestión Web
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
Environment=NODE_ENV=production
ExecStart=$NODE_PATH server.js
Restart=on-failure
RestartSec=10

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# Security
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=$PROJECT_DIR

[Install]
WantedBy=multi-user.target
EOF

    # Recargar systemd y habilitar servicio
    sudo systemctl daemon-reload
    sudo systemctl enable $SERVICE_NAME

    log_success "Servicio systemd creado y habilitado"
}

# Función para configurar firewall
configure_firewall() {
    log_info "Configurando firewall..."
    
    # Habilitar UFW si no está activo
    if ! sudo ufw status | grep -q "Status: active"; then
        sudo ufw --force enable
    fi
    
    # Permitir SSH
    sudo ufw allow ssh
    
    # Permitir puerto 3000
    sudo ufw allow 3000
    
    log_success "Firewall configurado (puertos 22 y 3000 abiertos)"
}

# Función para iniciar el servicio
start_service() {
    log_info "Iniciando servicio..."
    
    # Detener el servicio si está corriendo
    sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
    
    # Iniciar servicio
    sudo systemctl start $SERVICE_NAME
    
    # Verificar estado
    sleep 3
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        log_success "Servicio iniciado correctamente"
        
        # Mostrar estado
        sudo systemctl status $SERVICE_NAME --no-pager | head -15
        
        return 0
    else
        log_error "Error iniciando el servicio"
        log_info "Verificando logs..."
        sudo journalctl -u $SERVICE_NAME --no-pager | tail -10
        return 1
    fi
}

# Función para mostrar información final
show_final_info() {
    echo ""
    echo "🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE"
    echo "======================================"
    echo ""
    log_success "Manantial de los Secretos está corriendo!"
    echo ""
    echo "📍 INFORMACIÓN DE ACCESO:"
    echo "   🌐 Página Principal: http://$(hostname -I | awk '{print $1}'):3000"
    echo "   🔧 Panel Admin: http://$(hostname -I | awk '{print $1}'):3000/admin.html"
    echo "   📂 Directorio: $PROJECT_DIR"
    echo ""
    echo "🔑 CREDENCIALES ADMIN (cambiar en .env):"
    echo "   👤 Usuario: admin"
    echo "   🔒 Contraseña: secretos2024"
    echo ""
    echo "⚙️ COMANDOS ÚTILES:"
    echo "   📊 Ver estado: sudo systemctl status $SERVICE_NAME"
    echo "   📋 Ver logs: sudo journalctl -u $SERVICE_NAME -f"
    echo "   🔄 Reiniciar: sudo systemctl restart $SERVICE_NAME"
    echo "   ⏹️  Detener: sudo systemctl stop $SERVICE_NAME"
    echo "   ✅ Iniciar: sudo systemctl start $SERVICE_NAME"
    echo ""
    echo "📁 ARCHIVOS DE CONFIGURACIÓN:"
    echo "   🌐 Variables de entorno: $PROJECT_DIR/.env"
    echo "   ⚙️ Configuración global: $PROJECT_DIR/config.json"
    echo "   📊 Datos de aplicación: $PROJECT_DIR/data/"
    echo ""
    echo "🔄 PARA ACTUALIZAR DESDE GITHUB:"
    echo "   cd $PROJECT_DIR"
    echo "   sudo systemctl stop $SERVICE_NAME"
    echo "   git pull origin main"
    echo "   npm install"
    echo "   sudo systemctl start $SERVICE_NAME"
    echo ""
    log_warning "IMPORTANTE: Cambiar las credenciales por defecto antes de usar en producción!"
}

# Función principal
main() {
    log_info "Iniciando setup automático..."
    echo ""
    
    check_system
    update_system
    install_nodejs
    clone_repository
    install_dependencies
    configure_project
    cleanup_old_services
    create_systemd_service
    configure_firewall
    
    if start_service; then
        show_final_info
    else
        log_error "Setup completado pero el servicio no pudo iniciarse"
        log_info "Revisa los logs y la configuración"
        exit 1
    fi
}

# Verificar que no se ejecute como root
if [ "$EUID" -eq 0 ]; then
    log_error "No ejecutar este script como root (sudo)"
    log_info "Ejecutar como: ./setup-raspberry.sh"
    exit 1
fi

# Ejecutar función principal
main

echo ""
log_success "🌿 ¡Manantial de los Secretos está listo para usar!"