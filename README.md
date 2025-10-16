# 🌿 Manantial de los Secretos

**Sistema Web de Gestión para Sanación y Terapias Alternativas**

Una aplicación web completa para gestionar anuncios, configuraciones y estadísticas de un centro de terapias alternativas, con integración directa a WhatsApp y sistema de configuración persistente.

## ✨ Características Principales

- � **Integración WhatsApp Inteligente** - Sistema centralizado de configuración
- � **Gestión de Anuncios** - CRUD completo con mensajes personalizados
- � **Panel Administrativo** - Control total sin dependencia de localStorage
- � **Estadísticas en Tiempo Real** - Seguimiento de interacciones
- � **Sistema de Autenticación** - Acceso seguro con sesiones
- 📱 **Diseño Responsivo** - Optimizado para móviles y escritorio
- ⚙️ **Configuración Persistente** - Archivo JSON global (no localStorage)
- 🔄 **Deploy desde GitHub** - Clonación y setup automático

## 🚀 Instalación Rápida (Raspberry Pi)

### Requisitos Previos

- **Raspberry Pi 3B+ o superior** (recomendado Pi 4)
- **Raspbian OS Lite** o **Ubuntu Server**
- **Conexión a internet estable**
- **Mínimo 1GB RAM disponible**
- **8GB espacio en SD** (recomendado 32GB)

### 📦 Instalación Inicial

#### 1. Preparar Raspberry Pi

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y git curl nginx ufw fail2ban
```

#### 2. Instalar Node.js

```bash
# Instalar NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### 3. Clonar el Proyecto

```bash
# Crear directorio para el proyecto
mkdir -p ~/projects
cd ~/projects

# Clonar repositorio (reemplaza con tu URL)
git clone https://github.com/tu-usuario/manantial-de-los-secretos.git
cd manantial-de-los-secretos

# Instalar dependencias
npm install
```

#### 4. Configurar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Dar permisos al script de inicio
chmod +x start-pi.sh

# Ejecutar script de inicio
./start-pi.sh
```

### 🔧 Configuración del Servidor

#### 1. Configurar Nginx como Proxy Reverso

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/manantial
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/manantial /etc/nginx/sites-enabled/

# Deshabilitar sitio por defecto
sudo rm /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 2. Configurar Firewall

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 'Nginx Full'

# Verificar status
sudo ufw status
```

### 🌐 Configuración de Dominio

#### 1. Comprar Dominio

Recomendaciones de registradores:
- **Namecheap** (económico)
- **GoDaddy** (popular)
- **Cloudflare** (con CDN incluido)
- **Google Domains** (fácil configuración)

#### 2. Configurar DNS

En el panel de tu registrador, configura los siguientes registros DNS:

```
Tipo: A
Nombre: @
Valor: [IP_PUBLICA_DE_TU_RASPBERRY]

Tipo: A
Nombre: www
Valor: [IP_PUBLICA_DE_TU_RASPBERRY]
```

#### 3. IP Pública Dinámica (DDNS)

Si tu ISP te asigna IP dinámica, usa un servicio DDNS:

```bash
# Instalar ddclient
sudo apt install ddclient

# Configurar para No-IP (ejemplo)
sudo nano /etc/ddclient.conf
```

```
protocol=noip
use=web
server=dynupdate.no-ip.com
login=tu-usuario
password='tu-password'
tu-dominio.com
```

### 🔒 Configurar SSL/HTTPS

#### Usar Certbot (Let's Encrypt - GRATIS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo crontab -e
```

Agregar esta línea al crontab:
```
0 12 * * * /usr/bin/certbot renew --quiet
```

### 📡 Exposición a Internet

#### 1. Configuración del Router

Accede a tu router (generalmente 192.168.1.1) y configura:

**Port Forwarding:**
- Puerto externo: 80 → IP Raspberry: 80
- Puerto externo: 443 → IP Raspberry: 443
- Puerto externo: 22 → IP Raspberry: 22 (SSH)

#### 2. IP Estática Local para Raspberry Pi

```bash
# Editar configuración de red
sudo nano /etc/dhcpcd.conf
```

Agregar al final:
```
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

### 🔧 Configuración de WhatsApp

#### Configurar Número de WhatsApp

1. **Editar archivo JavaScript:**
```bash
nano public/js/main.js
```

2. **Cambiar la configuración:**
```javascript
const WHATSAPP_CONFIG = {
    number: '5491234567890', // Tu número con código de país (sin +)
    // ... resto de configuración
};
```

#### Obtener WhatsApp Business API (Opcional)

Para mayor profesionalismo:
1. Crear cuenta en **WhatsApp Business**
2. Configurar **WhatsApp Business API** con proveedores como:
   - Twilio
   - 360dialog
   - ChatAPI

### 📊 Monitoreo y Mantenimiento

#### Comandos PM2 Útiles

```bash
# Ver estado de aplicaciones
pm2 status

# Monitoreo en tiempo real
pm2 monit

# Ver logs
pm2 logs manantial

# Reiniciar aplicación
pm2 restart manantial

# Detener aplicación
pm2 stop manantial

# Eliminar aplicación
pm2 delete manantial
```

#### Logs del Sistema

```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs del sistema
sudo journalctl -f
```

### 🛡️ Seguridad

#### 1. Configurar Fail2Ban

```bash
# Editar configuración de Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true
```

#### 2. Actualizar Sistema Regularmente

```bash
# Crear script de actualización automática
sudo nano /home/pi/update-system.sh
```

```bash
#!/bin/bash
sudo apt update && sudo apt upgrade -y
npm update
pm2 restart all
```

```bash
# Hacer ejecutable y programar
chmod +x /home/pi/update-system.sh

# Agregar a crontab (cada domingo a las 3 AM)
sudo crontab -e
0 3 * * 0 /home/pi/update-system.sh
```

### 📈 Optimización de Performance

#### 1. Optimización de Memoria

```bash
# Editar configuración de memoria
sudo nano /boot/config.txt
```

Agregar:
```
# Asignar más memoria a CPU
gpu_mem=16

# Overclocking (opcional, cuidado con temperatura)
arm_freq=1750
over_voltage=6
```

#### 2. Swap File (si tienes poca RAM)

```bash
# Crear swap de 1GB
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 📱 Configuración Adicional

#### Google Analytics (Opcional)

1. **Crear cuenta en Google Analytics**
2. **Obtener código de seguimiento**
3. **Agregar al HTML antes de `</head>`:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

#### SEO Básico

El sitio ya incluye:
- ✅ Meta tags optimizados
- ✅ Structured data
- ✅ Sitemap automático
- ✅ Responsive design
- ✅ Velocidad optimizada

### 🚨 Solución de Problemas

#### Aplicación no inicia
```bash
# Verificar logs
pm2 logs manantial

# Verificar puerto
sudo netstat -tlnp | grep 3000

# Reiniciar desde cero
pm2 delete all
npm start
```

#### Nginx Error 502
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar configuración de Nginx
sudo nginx -t

# Reiniciar servicios
sudo systemctl restart nginx
pm2 restart manantial
```

#### Sin acceso desde internet
```bash
# Verificar IP pública
curl ifconfig.me

# Verificar puerto forwarding en router
# Verificar firewall
sudo ufw status
```

### 📞 Contacto y Soporte

Para soporte técnico o consultas sobre el deployment:
- 📧 Email: soporte@manantial.com
- 💬 WhatsApp: [Configurar tu número]
- 📚 Documentación completa en el repositorio

---

## ✅ Checklist de Deployment

- [ ] Raspberry Pi configurado y actualizado
- [ ] Node.js y PM2 instalados
- [ ] Proyecto clonado y dependencias instaladas
- [ ] PM2 configurado y aplicación iniciada
- [ ] Nginx instalado y configurado
- [ ] Firewall configurado
- [ ] Dominio comprado y DNS configurado
- [ ] Port forwarding configurado en router
- [ ] SSL/HTTPS configurado
- [ ] Número de WhatsApp configurado
- [ ] Monitoreo configurado
- [ ] Backups programados

¡Tu página esotérica está lista para conquistar el mundo digital! 🔮✨