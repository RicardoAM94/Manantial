require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// CONFIGURACIÓN DE AUTENTICACIÓN
// ========================
const AUTH_CONFIG = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'secretos2024',
    sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex')
};

console.log('🔐 Sistema de autenticación configurado');
console.log('👤 Usuario admin:', AUTH_CONFIG.username);
console.log('🔑 Contraseña por defecto:', AUTH_CONFIG.password === 'secretos2024' ? 'DEFAULT (cambiar en producción)' : 'PERSONALIZADA');

// Configurar sesiones
app.use(session({
    secret: AUTH_CONFIG.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // cambiar a true en HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// SOLUCIÓN TEMPORAL: Deshabilitar completamente CSP para desarrollo
console.log('🔧 Modo desarrollo: CSP completamente deshabilitado');
console.log('📝 NODE_ENV:', process.env.NODE_ENV || 'no definido');

// Configuración permisiva para desarrollo - Sin restricciones CSP
app.use(helmet({
  contentSecurityPolicy: false, // Completamente deshabilitado
  crossOriginResourcePolicy: false, // Permitir recursos de otros dominios
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(express.json());

// Configurar tipos MIME correctos
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No Content - evita el error 404
});

// ========================
// MIDDLEWARE DE AUTENTICACIÓN
// ========================
function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// ========================
// RUTAS DE AUTENTICACIÓN
// ========================

// Página de login
app.get('/login', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/admin/dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Procesar login
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
        req.session.isAuthenticated = true;
        req.session.username = username;
        req.session.loginTime = new Date().toISOString();
        
        console.log(`✅ Login exitoso: ${username} en ${new Date().toLocaleString()}`);
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        console.log(`❌ Intento de login fallido: ${username} en ${new Date().toLocaleString()}`);
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});

// Logout
app.post('/admin/logout', (req, res) => {
    console.log('🚪 Solicitud de logout recibida');
    const username = req.session.username || 'usuario desconocido';
    
    if (!req.session.isAuthenticated) {
        console.log('⚠️  Intento de logout sin sesión activa');
        return res.status(401).json({ success: false, message: 'No hay sesión activa' });
    }
    
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al cerrar sesión:', err);
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        console.log(`✅ Logout exitoso: ${username} en ${new Date().toLocaleString()}`);
        res.json({ success: true, message: 'Sesión cerrada exitosamente' });
    });
});

// Verificar estado de sesión
app.get('/admin/session', (req, res) => {
    const isAuthenticated = !!(req.session && req.session.isAuthenticated);
    const username = req.session?.username || null;
    const loginTime = req.session?.loginTime || null;
    
    console.log(`📊 Estado de sesión consultado: ${isAuthenticated ? 'Activa' : 'Inactiva'}`);
    
    res.json({
        isAuthenticated,
        username,
        loginTime,
        sessionId: req.sessionID
    });
});

// ========================
// RUTAS PROTEGIDAS DEL ADMIN
// ========================

// Panel de administración (protegido) - Ruta directa
app.get('/admin.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Redirección de /admin a /admin.html
app.get('/admin', requireAuth, (req, res) => {
    res.redirect('/admin.html');
});

// Mantener compatibilidad con /admin/dashboard
app.get('/admin/dashboard', requireAuth, (req, res) => {
    res.redirect('/admin.html');
});

// ========================
// SISTEMA DE CONFIGURACIÓN PERSISTENTE
// ========================
const dataFile = path.join(__dirname, 'data', 'announcements.json');
const configFile = path.join(__dirname, 'config.json');

// Función para leer configuración global
async function readConfig() {
  try {
    const configData = await fs.readFile(configFile, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.warn('⚠️  Archivo config.json no encontrado, creando configuración por defecto...');
    const defaultConfig = {
      whatsapp: {
        number: "573148014430",
        lastUpdated: new Date().toISOString()
      },
      site: {
        title: "Manantial de los Secretos",
        description: "Sanación y Terapias Alternativas",
        theme: "default"
      },
      admin: {
        version: "1.0.0",
        lastLogin: null
      }
    };
    await writeConfig(defaultConfig);
    return defaultConfig;
  }
}

// Función para escribir configuración global
async function writeConfig(config) {
  try {
    await fs.writeFile(configFile, JSON.stringify(config, null, 2));
    console.log('✅ Configuración guardada en config.json');
    return true;
  } catch (error) {
    console.error('❌ Error escribiendo configuración:', error);
    return false;
  }
}

// Función helper para leer datos (anuncios y estadísticas)
async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo datos:', error);
    return {
      announcements: [],
      stats: { pageViews: 0, whatsappClicks: 0, totalAnnouncements: 0 }
    };
  }
}

// Función helper para escribir datos
async function writeData(data) {
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error escribiendo datos:', error);
    return false;
  }
}

// GET - Obtener todos los anuncios (PROTEGIDO)
app.get('/api/announcements', requireAuth, async (req, res) => {
  const data = await readData();
  res.json(data.announcements);
});

// GET - Obtener anuncios activos
app.get('/api/announcements/active', async (req, res) => {
  const data = await readData();
  const now = new Date();
  const activeAnnouncements = data.announcements.filter(ann => {
    if (ann.status !== 'active') return false;
    if (ann.expires && new Date(ann.expires) < now) return false;
    return true;
  }).sort((a, b) => {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  res.json(activeAnnouncements);
});

// POST - Crear anuncio (PROTEGIDO)
app.post('/api/announcements', requireAuth, async (req, res) => {
  const data = await readData();
  const newAnnouncement = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    ...req.body,
    created: new Date().toISOString()
  };
  
  data.announcements.unshift(newAnnouncement);
  data.stats.totalAnnouncements = data.announcements.length;
  
  const success = await writeData(data);
  if (success) {
    res.json(newAnnouncement);
  } else {
    res.status(500).json({ error: 'Error guardando anuncio' });
  }
});

// PUT - Actualizar anuncio (PROTEGIDO)
app.put('/api/announcements/:id', requireAuth, async (req, res) => {
  const data = await readData();
  const index = data.announcements.findIndex(ann => ann.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Anuncio no encontrado' });
  }
  
  data.announcements[index] = { ...data.announcements[index], ...req.body };
  
  const success = await writeData(data);
  if (success) {
    res.json(data.announcements[index]);
  } else {
    res.status(500).json({ error: 'Error actualizando anuncio' });
  }
});

// DELETE - Eliminar anuncio (PROTEGIDO)
app.delete('/api/announcements/:id', requireAuth, async (req, res) => {
  const data = await readData();
  const index = data.announcements.findIndex(ann => ann.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Anuncio no encontrado' });
  }
  
  data.announcements.splice(index, 1);
  data.stats.totalAnnouncements = data.announcements.length;
  
  const success = await writeData(data);
  if (success) {
    res.json({ message: 'Anuncio eliminado' });
  } else {
    res.status(500).json({ error: 'Error eliminando anuncio' });
  }
});

// GET - Obtener configuración (PROTEGIDO)
app.get('/api/config', requireAuth, async (req, res) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    res.status(500).json({ error: 'Error obteniendo configuración' });
  }
});

// GET - Obtener configuración pública de WhatsApp (SIN AUTENTICACIÓN)
app.get('/api/whatsapp-config', async (req, res) => {
  try {
    const config = await readConfig();
    // Solo devolver la configuración de WhatsApp, no datos sensibles
    res.json({
      whatsapp: config.whatsapp || { number: '573148014430' }
    });
  } catch (error) {
    console.error('❌ Error obteniendo config WhatsApp:', error);
    res.json({ whatsapp: { number: '573148014430' } });
  }
});

// PUT - Actualizar configuración (PROTEGIDO)
app.put('/api/config', requireAuth, async (req, res) => {
  try {
    const currentConfig = await readConfig();
    
    // Actualizar configuración con nuevos datos
    const updatedConfig = { ...currentConfig, ...req.body };
    
    // Si se actualiza WhatsApp, marcar timestamp
    if (req.body.whatsapp) {
      updatedConfig.whatsapp = {
        ...currentConfig.whatsapp,
        ...req.body.whatsapp,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const success = await writeConfig(updatedConfig);
    if (success) {
      console.log('✅ Configuración actualizada:', { whatsapp: updatedConfig.whatsapp?.number });
      res.json(updatedConfig);
    } else {
      res.status(500).json({ error: 'Error guardando configuración' });
    }
  } catch (error) {
    console.error('❌ Error actualizando configuración:', error);
    res.status(500).json({ error: 'Error actualizando configuración' });
  }
});

// GET - Obtener estadísticas (PROTEGIDO)
app.get('/api/stats', requireAuth, async (req, res) => {
  const data = await readData();
  res.json(data.stats);
});

// POST - Incrementar estadística
app.post('/api/stats/:stat', async (req, res) => {
  const data = await readData();
  const stat = req.params.stat;
  
  if (data.stats[stat] !== undefined) {
    data.stats[stat] = (data.stats[stat] || 0) + 1;
    const success = await writeData(data);
    
    if (success) {
      res.json({ [stat]: data.stats[stat] });
    } else {
      res.status(500).json({ error: 'Error actualizando estadística' });
    }
  } else {
    res.status(400).json({ error: 'Estadística no válida' });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔮 Manantial de los Secretos ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Accesible desde: http://localhost:${PORT}`);
});

module.exports = app;