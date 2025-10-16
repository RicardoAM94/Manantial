# 🔮 Manantial de los Secretos - Sistema de Autenticación

## 🔐 Configuración de Seguridad

### Configuración Inicial

1. **Copia el archivo de configuración:**
```bash
cp .env.example .env
```

2. **Edita las credenciales en el archivo `.env`:**
```bash
ADMIN_USERNAME=tu_usuario_admin
ADMIN_PASSWORD=tu_password_super_seguro
SESSION_SECRET=clave_secreta_muy_larga_y_segura
```

### Credenciales por Defecto

⚠️ **IMPORTANTE**: Las credenciales por defecto son:
- **Usuario:** `admin`
- **Contraseña:** `secretos2024`

🚨 **DEBES CAMBIAR ESTAS CREDENCIALES ANTES DE DESPLEGAR EN PRODUCCIÓN**

### Acceso al Sistema

1. **Página Principal:** `http://tu-dominio.com/`
2. **Login Administrativo:** `http://tu-dominio.com/login`
3. **Panel de Administración:** `http://tu-dominio.com/admin` (requiere autenticación)

### Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/admin` → Redirige a `/admin/dashboard`
- `/admin/dashboard` → Panel principal
- `/api/announcements` (POST, PUT, DELETE)
- `/api/config` (GET, PUT)
- `/api/stats` (GET)

### Rutas Públicas

Estas rutas NO requieren autenticación:
- `/` → Página principal
- `/login` → Formulario de acceso
- `/api/announcements/active` → Anuncios para el slider público
- `/api/stats/pageViews` (POST) → Contador de visitas

## 🛡️ Características de Seguridad

### Gestión de Sesiones
- Sesiones con expiración automática (24 horas por defecto)
- Cookies HTTP-Only para prevenir XSS
- Regeneración de IDs de sesión
- Logout seguro con destrucción de sesión

### Protección de Rutas
- Middleware de autenticación en todas las rutas admin
- Redirección automática a login si no autenticado
- Manejo de sesiones expiradas en el frontend

### Configuración Segura
- Variables de entorno para credenciales
- Secrets aleatorios para sesiones
- Helmet.js para headers de seguridad
- Validación de entrada en formularios

## 🚀 Instalación y Uso

### Requisitos
- Node.js 14+
- npm o yarn

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
# o
node server-dev.js
```

### Producción
```bash
npm start
# o
node server.js
```

## 📋 Lista de Verificación de Seguridad

Antes de desplegar en producción:

- [ ] Cambiar `ADMIN_USERNAME` en `.env`
- [ ] Cambiar `ADMIN_PASSWORD` en `.env`
- [ ] Configurar `SESSION_SECRET` único y seguro
- [ ] Establecer `DEVELOPMENT_MODE=false`
- [ ] Configurar HTTPS en producción
- [ ] Verificar que `.env` está en `.gitignore`
- [ ] Configurar backup de `data/announcements.json`
- [ ] Configurar logs de seguridad

## 🔧 Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| `PORT` | Puerto del servidor | `3000` |
| `ADMIN_USERNAME` | Usuario administrador | `admin` |
| `ADMIN_PASSWORD` | Contraseña admin | `secretos2024` |
| `SESSION_SECRET` | Clave para sesiones | Auto-generado |
| `DEVELOPMENT_MODE` | Modo desarrollo | `true` |
| `SESSION_MAX_AGE` | Duración sesión (ms) | `86400000` |

## ⚠️ Notas de Seguridad

1. **Nunca** commits el archivo `.env` al repositorio
2. **Siempre** cambia las credenciales por defecto
3. **Usa HTTPS** en producción
4. **Mantén** Node.js actualizado
5. **Monitorea** logs de acceso

## 📞 Soporte

Para problemas de seguridad o configuración, revisa los logs del servidor o contacta al administrador del sistema.

---

*Sistema desarrollado para Manantial de los Secretos* 🔮