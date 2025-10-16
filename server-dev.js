const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔧 SERVIDOR DE DESARROLLO - SIN RESTRICCIONES DE SEGURIDAD');
console.log('⚠️  SOLO PARA DESARROLLO LOCAL - NO USAR EN PRODUCCIÓN');

// Solo compresión, sin Helmet (sin restricciones de seguridad)
app.use(compression());
app.use(express.json());

// Headers manuales básicos para desarrollo
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Manantial-de-los-Secretos-Dev');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Panel de administración
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ========================
// API ENDPOINTS
// ========================
const dataFile = path.join(__dirname, 'data', 'announcements.json');

// Función helper para leer datos
async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo datos:', error);
    return {
      announcements: [],
      config: { whatsapp: { number: "573148014430" }, messages: {} },
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

// GET - Obtener todos los anuncios
app.get('/api/announcements', async (req, res) => {
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

// POST - Crear anuncio
app.post('/api/announcements', async (req, res) => {
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

// PUT - Actualizar anuncio
app.put('/api/announcements/:id', async (req, res) => {
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

// DELETE - Eliminar anuncio
app.delete('/api/announcements/:id', async (req, res) => {
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

// GET - Obtener configuración
app.get('/api/config', async (req, res) => {
  const data = await readData();
  res.json(data.config);
});

// PUT - Actualizar configuración
app.put('/api/config', async (req, res) => {
  const data = await readData();
  data.config = { ...data.config, ...req.body };
  
  const success = await writeData(data);
  if (success) {
    res.json(data.config);
  } else {
    res.status(500).json({ error: 'Error guardando configuración' });
  }
});

// GET - Obtener estadísticas
app.get('/api/stats', async (req, res) => {
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
  console.log(`📡 Red local: http://localhost:${PORT}`);
  console.log('✅ Sin restricciones CSP - Todas las fuentes permitidas');
});

module.exports = app;