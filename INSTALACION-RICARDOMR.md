# 🎯 INSTALACIÓN ESPECÍFICA PARA ricardomr@192.168.0.250

## ✅ Estado Actual
- **Archivo transferido:** `manantial-secretos-raspberry.zip` ✓
- **Usuario:** `ricardomr` 
- **IP:** `192.168.0.250`
- **Directorio destino:** `/home/ricardomr/manantial`

## 🚀 Pasos de Instalación

### Paso 1: Conectar a la Raspberry Pi
```bash
ssh ricardomr@192.168.0.250
```

### Paso 2: Verificar archivo transferido
```bash
cd /home/ricardomr
ls -la | grep zip
```

### Paso 3: Ejecutar instalador personalizado
```bash
# Opción A: Usar instalador específico (recomendado)
unzip -j manantial-secretos-raspberry.zip "*/install-ricardomr.sh"
chmod +x install-ricardomr.sh
./install-ricardomr.sh

# Opción B: Usar instalador general modificado
unzip manantial-secretos-raspberry.zip
cd ManatialDeLosSecretos
chmod +x install-raspberry.sh
./install-raspberry.sh
```

## 🔍 Verificación Post-Instalación

### Verificar que PM2 esté corriendo
```bash
pm2 status
pm2 logs manantial-secretos
```

### Probar conectividad local
```bash
curl http://localhost:3000
curl http://192.168.0.250:3000
```

### Verificar estructura de archivos
```bash
ls -la /home/ricardomr/manantial/
ls -la /home/ricardomr/logs/
```

## 🌐 URLs de Acceso

- **Sitio principal:** http://192.168.0.250:3000
- **Login admin:** http://192.168.0.250:3000/login
- **Panel admin:** http://192.168.0.250:3000/admin

## 🔐 Credenciales Iniciales

- **Usuario:** `admin`
- **Contraseña:** `secretos2024`

## 🛠️ Comandos de Gestión

### Gestión de la aplicación
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs manantial-secretos

# Reiniciar
pm2 restart manantial-secretos

# Detener
pm2 stop manantial-secretos

# Eliminar del PM2
pm2 delete manantial-secretos
```

### Gestión del sistema
```bash
# Ver uso de recursos
htop

# Ver espacio en disco
df -h

# Ver puertos en uso
netstat -tulpn | grep :3000
```

## 🔧 Configuración Adicional

### Cambiar credenciales (IMPORTANTE)
```bash
# Editar archivo .env
cd /home/ricardomr/manantial
nano .env

# Cambiar estas líneas:
ADMIN_USERNAME=tu_usuario_nuevo
ADMIN_PASSWORD=tu_password_super_seguro

# Reiniciar aplicación
pm2 restart manantial-secretos
```

### Configurar acceso desde internet
1. **En tu router:** Configura Port Forwarding
   - Puerto externo: 80 o 8080
   - Puerto interno: 3000
   - IP destino: 192.168.0.250

2. **Obtén tu IP pública:**
   ```bash
   curl ifconfig.me
   ```

## 🚨 Solución de Problemas

### Si la aplicación no inicia
```bash
# Ver logs detallados
pm2 logs manantial-secretos --lines 50

# Verificar dependencias
cd /home/ricardomr/manantial
npm install

# Probar manualmente
node server.js
```

### Si no se puede acceder desde la red
```bash
# Verificar firewall
sudo ufw status

# Permitir puerto 3000
sudo ufw allow 3000

# Verificar que el servidor esté escuchando
netstat -tulpn | grep :3000
```

### Si hay problemas de permisos
```bash
# Cambiar propietario de archivos
sudo chown -R ricardomr:ricardomr /home/ricardomr/manantial
sudo chown -R ricardomr:ricardomr /home/ricardomr/logs

# Dar permisos de ejecución
chmod +x /home/ricardomr/manantial/*.sh
```

## 📊 Monitoreo

### Logs en tiempo real
```bash
# Logs de la aplicación
tail -f /home/ricardomr/logs/manantial-app.log

# Logs de PM2
pm2 monit
```

### Backup manual
```bash
cd /home/ricardomr
tar -czf "backups/manantial-$(date +%Y%m%d_%H%M%S).tar.gz" manantial
```

## ✅ Checklist Final

- [ ] SSH conecta correctamente
- [ ] Archivo ZIP extraído en `/home/ricardomr/manantial`
- [ ] Dependencias npm instaladas
- [ ] PM2 ejecutando la aplicación
- [ ] Puerto 3000 accesible localmente
- [ ] Puerto 3000 accesible desde la red local
- [ ] Credenciales cambiadas
- [ ] Firewall configurado
- [ ] Backup inicial creado

**🎉 ¡Tu Manantial de los Secretos está listo en la Raspberry Pi!**