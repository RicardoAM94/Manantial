# 🚀 Sistema de Persistencia con API - Manantial de los Secretos

## 🎯 **Problema Solucionado**

**Antes**: Los anuncios se guardaban solo en localStorage del navegador del administrador, no eran visibles para otros usuarios.

**Ahora**: Los anuncios se guardan en un archivo JSON en el servidor, disponible para todos los visitantes desde internet.

## 🏗️ **Arquitectura Implementada**

### 📁 **Archivo de Datos**
```
data/announcements.json
├── announcements: []     # Array de anuncios
├── config: {}           # Configuración (WhatsApp, mensajes)
└── stats: {}            # Estadísticas (visitas, clics)
```

### 🔌 **API Endpoints**
```javascript
// Anuncios
GET    /api/announcements        # Todos los anuncios
GET    /api/announcements/active # Solo anuncios activos
POST   /api/announcements        # Crear anuncio
PUT    /api/announcements/:id    # Editar anuncio
DELETE /api/announcements/:id    # Eliminar anuncio

// Configuración
GET    /api/config              # Obtener configuración
PUT    /api/config              # Guardar configuración

// Estadísticas
GET    /api/stats               # Obtener estadísticas
POST   /api/stats/:stat         # Incrementar estadística
```

## 🔄 **Flujo de Datos**

### 📝 **Panel de Administración**
1. **Admin crea anuncio** → Se envía a `/api/announcements`
2. **Servidor guarda** en `data/announcements.json`
3. **Responde** con el anuncio creado
4. **Panel actualiza** la lista desde el servidor

### 🌐 **Sitio Principal**
1. **Usuario visita** la página principal
2. **JavaScript carga** anuncios desde `/api/announcements/active`
3. **Slider se actualiza** automáticamente con anuncios del servidor
4. **Estadística de visita** se incrementa en el servidor

## ✨ **Ventajas del Nuevo Sistema**

### 🌍 **Disponibilidad Global**
- ✅ **Anuncios visibles** para todos los visitantes desde internet
- ✅ **Persistencia real** entre sesiones y usuarios
- ✅ **No depende del navegador** del administrador

### 🔄 **Sincronización Automática**
- ✅ **Cambios inmediatos** en el slider al crear/editar anuncios
- ✅ **Múltiples usuarios** pueden ver los mismos anuncios
- ✅ **Reinicio del servidor** mantiene todos los datos

### 📊 **Estadísticas Reales**
- ✅ **Contador de visitas** desde cualquier dispositivo
- ✅ **Clics de WhatsApp** centralizados
- ✅ **Métricas compartidas** entre todos los usuarios

## 🧪 **Cómo Probar**

### **Prueba 1: Persistencia entre Sesiones**
1. Crear un anuncio en `/admin`
2. Ir al sitio principal `/` 
3. **Verificar**: El anuncio aparece en el slider
4. **Reiniciar servidor** (Ctrl+C y volver a iniciar)
5. **Verificar**: El anuncio sigue apareciendo

### **Prueba 2: Visibilidad Global**
1. Crear anuncio desde una pestaña/dispositivo
2. Abrir otra pestaña/dispositivo en `/`
3. **Verificar**: El anuncio es visible sin refresh

### **Prueba 3: Estadísticas Reales**
1. Visitar la página principal varias veces
2. Hacer clic en botones de WhatsApp
3. Ver estadísticas en `/admin` → pestaña Estadísticas
4. **Verificar**: Los números aumentan correctamente

## 📂 **Estructura de Archivos**

```
ManatialDeLosSecretos/
├── data/
│   └── announcements.json     # ← NUEVO: Base de datos JSON
├── server.js                  # ← API agregada
├── server-dev.js              # ← API agregada  
└── public/
    ├── js/
    │   ├── admin.js          # ← Actualizado: usa API
    │   └── main.js           # ← Actualizado: carga desde API
    └── admin.html
```

## 🔒 **Seguridad y Respaldos**

### 📋 **Respaldo Manual**
```bash
# Respaldar datos
copy "data\announcements.json" "backup\announcements_2025-10-15.json"

# Restaurar datos
copy "backup\announcements_2025-10-15.json" "data\announcements.json"
```

### 🔄 **Migración desde localStorage**
Si tenías datos en localStorage, puedes:
1. Abrir consola en el panel admin (F12)
2. Ejecutar: `localStorage.getItem('manantial_announcements')`
3. Copiar los datos y crearlos manualmente en el nuevo sistema

## 🚀 **Para Producción**

En tu Raspberry Pi:
1. ✅ **El archivo JSON se mantiene** entre reinicios
2. ✅ **Múltiples usuarios** acceden a los mismos datos
3. ✅ **Backup automático** recomendado con cron job
4. ✅ **Escalable** - puede convertirse a base de datos real más tarde

---

**¡Sistema de persistencia completamente implementado!** 🎉

Los anuncios ahora:
- 📡 Se guardan en el servidor (no en el navegador)
- 🌍 Son visibles para todos los usuarios de internet
- 🔄 Persisten entre sesiones y reinicios
- 📊 Generan estadísticas reales y centralizadas