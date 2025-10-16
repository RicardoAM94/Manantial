# 🍓 GUÍA RÁPIDA: Transferir a Raspberry Pi

## 🚀 MÉTODO RECOMENDADO: Instalación Automática

### Paso 1: 📦 Empaquetar el Proyecto
```bash
# En Windows, ejecutar UNO de estos comandos:

# Opción A: Doble clic en el archivo
pack-for-raspberry.bat

# Opción B: PowerShell
.\pack-for-raspberry.ps1

# Opción C: Manual con PowerShell
Compress-Archive -Path "ManatialDeLosSecretos" -DestinationPath "manantial-secretos-raspberry.zip"
```

### Paso 2: 📤 Transferir a Raspberry Pi
```bash
# Desde Windows (cmd o PowerShell)
scp manantial-secretos-raspberry.zip pi@[IP_RASPBERRY]:/home/pi/

# Ejemplo con IP específica:


```

### Paso 3: 🔗 Conectar por SSH
```bash
ssh pi@[IP_RASPBERRY]

# Ejemplo:
ssh pi@192.168.1.100
```

### Paso 4: 🛠️ Instalación Automática
```bash
# En la Raspberry Pi:
cd /home/pi
unzip manantial-secretos-raspberry.zip
cd ManatialDeLosSecretos
chmod +x install-raspberry.sh
./install-raspberry.sh
```

**¡Eso es todo!** El script hará todo automáticamente:
- ✅ Instalar Node.js y dependencias
- ✅ Configurar PM2
- ✅ Instalar la aplicación
- ✅ Configurar firewall
- ✅ Iniciar el servicio
- ✅ Configurar inicio automático

---

## 🔧 MÉTODO MANUAL (Si prefieres control total)

### 1. Preparar Raspberry Pi
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar herramientas
sudo apt install -y git tree htop ufw

# Instalar PM2
sudo npm install -g pm2
```

### 2. Transferir y Configurar Proyecto
```bash
# Transferir archivo
scp manantial-secretos-raspberry.zip pi@[IP_RASPBERRY]:/home/pi/

# En Raspberry Pi
ssh pi@[IP_RASPBERRY]
cd /home/pi
unzip manantial-secretos-raspberry.zip
cd ManatialDeLosSecretos

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar credenciales
```

### 3. Configurar Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 3000
```

### 4. Iniciar con PM2
```bash
# Crear directorios de logs
mkdir -p /home/pi/logs

# Iniciar aplicación
pm2 start pm2.config.js

# Configurar inicio automático
pm2 startup
pm2 save
```

---

## 🌐 Configuración de Red

### Obtener IP de Raspberry Pi
```bash
# En Raspberry Pi
ip addr show | grep inet
# o
hostname -I
```

### Configurar Port Forwarding en Router
1. Accede a la configuración del router (ej: 192.168.1.1)
2. Busca "Port Forwarding" o "Reenvío de puertos"
3. Configura:
   - **Puerto externo:** 80 o 8080
   - **Puerto interno:** 3000
   - **IP destino:** IP de la Raspberry Pi
   - **Protocolo:** TCP

### IP Estática (Opcional pero recomendada)
```bash
# Editar configuración
sudo nano /etc/dhcpcd.conf

# Agregar al final:
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8

# Reiniciar red
sudo systemctl restart dhcpcd
```

---

## 🔍 Verificación y Monitoreo

### Comandos Útiles
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs manantial-secretos

# Reiniciar aplicación
pm2 restart manantial-secretos

# Ver uso de recursos
htop

# Probar conectividad local
curl http://localhost:3000
```

### URLs de Acceso
- **Local:** `http://localhost:3000`
- **Red local:** `http://[IP_RASPBERRY]:3000`
- **Externo:** `http://[TU_IP_PUBLICA]:[PUERTO_ROUTER]`
- **Login admin:** `http://[TU_DOMINIO]/login`

### Credenciales por Defecto
- **Usuario:** `admin`
- **Contraseña:** `secretos2024`
- **⚠️ CAMBIAR INMEDIATAMENTE**

---

## 🛡️ Seguridad Adicional

### Cambiar Puerto SSH (Recomendado)
```bash
sudo nano /etc/ssh/sshd_config
# Cambiar: Port 22 → Port 2222
sudo systemctl restart ssh
```

### Configurar Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### Backup Automático
```bash
# Crear script de backup
nano /home/pi/backup.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/home/pi/backups/manantial-$DATE.tar.gz" -C /home/pi manantial-secretos

# Crontab (backup diario)
crontab -e
# 0 2 * * * /home/pi/backup.sh
```

---

## 🎯 CHECKLIST FINAL

- [ ] Raspberry Pi actualizada
- [ ] Node.js 14+ instalado
- [ ] Proyecto transferido y funcionando
- [ ] PM2 configurado e iniciado
- [ ] Firewall configurado
- [ ] Port forwarding configurado en router
- [ ] Credenciales cambiadas
- [ ] IP estática configurada (opcional)
- [ ] Backup configurado
- [ ] URLs de acceso verificadas

**🔮 ¡Tu Manantial de los Secretos está listo para el mundo!**