# 🍓 Guía de Despliegue en Raspberry Pi

## 📋 Preparación del Proyecto

### 1. 🗂️ Estructura del Proyecto a Transferir

```
ManatialDeLosSecretos/
├── server.js                   # Servidor principal
├── server-dev.js              # Servidor desarrollo (opcional)
├── package.json               # Dependencias
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos a ignorar
├── SECURITY.md               # Documentación de seguridad
├── setup.js                  # Script de configuración
├── data/
│   └── announcements.json    # Base de datos JSON
├── public/
│   ├── index.html           # Página principal
│   ├── admin.html           # Panel administrativo
│   ├── login.html           # Página de login
│   ├── test.html            # Página de pruebas
│   ├── favicon.svg          # Icono del sitio
│   ├── favicon.ico          # Icono fallback
│   ├── css/
│   │   ├── styles.css       # Estilos principales
│   │   └── admin.css        # Estilos del admin
│   └── js/
│       ├── main.js          # JavaScript principal
│       ├── admin.js         # JavaScript del admin
│       └── whatsapp-simple.js # Validación WhatsApp
```

### 2. 🚀 Métodos de Transferencia

## MÉTODO 1: 📦 Comprimir y Transferir

### Paso 1: Crear archivo comprimido
```bash
# En Windows (PowerShell)
cd C:\Users\RicardoMR\Desktop\
Compress-Archive -Path "ManatialDeLosSecretos" -DestinationPath "manantial-secretos.zip"
```

### Paso 2: Transferir a Raspberry Pi
```bash
# Usando SCP
scp manantial-secretos.zip pi@[IP_RASPBERRY]:/home/pi/

# O usando WinSCP (interfaz gráfica)
# Conectar por SFTP y arrastrar el archivo
```

## MÉTODO 2: 🔄 Git (Recomendado)

### Paso 1: Crear repositorio
```bash
# En el directorio del proyecto
git init
git add .
git commit -m "Initial commit - Manantial de los Secretos v2.0"

# Subir a GitHub/GitLab (opcional pero recomendado)
git remote add origin [URL_DEL_REPOSITORIO]
git push -u origin main
```

### Paso 2: Clonar en Raspberry Pi
```bash
# En la Raspberry Pi
cd /home/pi
git clone [URL_DEL_REPOSITORIO] manantial-secretos
cd manantial-secretos
```

## MÉTODO 3: 📁 Transferencia Directa por Carpetas

### Usando SCP para transferir carpeta completa:
```bash
scp -r C:\Users\RicardoMR\Desktop\ManatialDeLosSecretos pi@[IP_RASPBERRY]:/home/pi/manantial-secretos
```

---

## 🛠️ Configuración en Raspberry Pi

### 1. 📥 Instalación de Dependencias

```bash
# Conectar por SSH
ssh pi@[IP_RASPBERRY]

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (versión 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2. 🔧 Configurar el Proyecto

```bash
# Ir al directorio del proyecto
cd /home/pi/manantial-secretos

# Instalar dependencias
npm install

# Verificar que todos los archivos estén presentes
ls -la

# Verificar estructura
tree -L 3
```

### 3. ⚙️ Configurar Variables de Entorno

```bash
# Editar archivo .env
nano .env

# O usar el script de configuración
npm run config
```

### 4. 🧪 Prueba Local

```bash
# Probar el servidor
npm start

# En otra terminal SSH, probar conectividad
curl http://localhost:3000

# Detener con Ctrl+C
```

---

## 🌐 Configuración para Acceso Externo

### 1. 🔥 Configurar Firewall (UFW)

```bash
# Instalar y configurar UFW
sudo apt install ufw -y

# Configurar reglas básicas
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH
sudo ufw allow ssh

# Permitir puerto 3000 (aplicación)
sudo ufw allow 3000

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

### 2. 🏠 Configuración del Router

Necesitarás configurar **Port Forwarding** en tu router:
- **Puerto Externo:** 80 o 8080
- **Puerto Interno:** 3000
- **IP Destino:** IP de la Raspberry Pi
- **Protocolo:** TCP

### 3. 🔧 IP Estática para Raspberry Pi

```bash
# Editar configuración de red
sudo nano /etc/dhcpcd.conf

# Agregar al final (ajusta según tu red):
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8

# Reiniciar servicio de red
sudo systemctl restart dhcpcd
```

---

## 🚀 Despliegue en Producción

### 1. 📦 Instalar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear archivo de configuración PM2
nano ecosystem.config.js
```

### 2. 📄 Configuración PM2 (ecosystem.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'manantial-secretos',
    script: 'server.js',
    cwd: '/home/pi/manantial-secretos',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: '/home/pi/logs/manantial-app.log',
    error_file: '/home/pi/logs/manantial-error.log',
    out_file: '/home/pi/logs/manantial-out.log',
    time: true
  }]
};
```

### 3. 🔄 Iniciar Aplicación con PM2

```bash
# Crear directorio de logs
mkdir -p /home/pi/logs

# Iniciar aplicación
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs manantial-secretos

# Configurar inicio automático
pm2 startup
pm2 save
```

---

## 🔒 Configuración de Seguridad

### 1. 🛡️ Cambiar Credenciales por Defecto

```bash
# Usar script de configuración
npm run config

# O editar .env directamente
nano .env
```

### 2. 🔐 Configurar HTTPS (Opcional)

```bash
# Instalar Certbot para Let's Encrypt
sudo apt install certbot -y

# Obtener certificado (requiere dominio)
sudo certbot certonly --standalone -d tu-dominio.com

# Configurar certificados en la aplicación
```

### 3. 🚪 Cambiar Puerto SSH (Recomendado)

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambiar línea: Port 22 → Port 2222
# Reiniciar SSH
sudo systemctl restart ssh
```

---

## 📊 Monitoreo y Mantenimiento

### 1. 🔍 Comandos Útiles

```bash
# Ver estado del servidor
pm2 status

# Reiniciar aplicación
pm2 restart manantial-secretos

# Ver logs
pm2 logs manantial-secretos --lines 50

# Estadísticas del sistema
htop

# Espacio en disco
df -h

# Memoria RAM
free -h
```

### 2. 🔄 Actualización de la Aplicación

```bash
# Método Git
cd /home/pi/manantial-secretos
git pull origin main
npm install
pm2 restart manantial-secretos

# Método manual
# Reemplazar archivos y ejecutar:
npm install
pm2 restart manantial-secretos
```

### 3. 💾 Backup Automático

```bash
# Crear script de backup
nano /home/pi/backup-manantial.sh
```

```bash
#!/bin/bash
# Script de backup
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/pi/backups"
SOURCE_DIR="/home/pi/manantial-secretos"

mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/manantial-backup-$DATE.tar.gz" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)"

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "manantial-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completado: manantial-backup-$DATE.tar.gz"
```

```bash
# Hacer ejecutable
chmod +x /home/pi/backup-manantial.sh

# Agregar a crontab (backup diario a las 2 AM)
crontab -e
# Agregar línea: 0 2 * * * /home/pi/backup-manantial.sh
```

---

## 🌐 Acceso Final

Una vez configurado, podrás acceder a tu aplicación:

- **Local:** `http://[IP_RASPBERRY]:3000`
- **Externo:** `http://[TU_IP_PUBLICA]:[PUERTO_CONFIGURADO]`
- **Admin:** `http://[TU_DOMINIO]/login`

### 🎯 URLs de Acceso:
- **Sitio Principal:** `/`
- **Login Admin:** `/login` 
- **Panel Admin:** `/admin`
- **Pruebas:** `/test.html`

**¡Tu Raspberry Pi estará lista para servir el Manantial de los Secretos al mundo!** 🔮🌍