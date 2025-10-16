#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔮 Configuración Inicial - Manantial de los Secretos');
console.log('='.repeat(50));

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupEnvironment() {
  console.log('\n📝 Configuración de credenciales de administrador:');
  
  const username = await ask('👤 Ingresa el nombre de usuario admin (por defecto: admin): ') || 'admin';
  const password = await ask('🔑 Ingresa la contraseña admin (por defecto: secretos2024): ') || 'secretos2024';
  const port = await ask('🌐 Puerto del servidor (por defecto: 3000): ') || '3000';
  
  const envContent = `# =======================================
# CONFIGURACIÓN DEL SERVIDOR
# =======================================
PORT=${port}

# =======================================
# CREDENCIALES DE ADMINISTRACIÓN
# =======================================
ADMIN_USERNAME=${username}
ADMIN_PASSWORD=${password}

# Clave secreta para sesiones (generada automáticamente)
SESSION_SECRET=${require('crypto').randomBytes(64).toString('hex')}

# =======================================
# CONFIGURACIÓN DE SEGURIDAD
# =======================================
DEVELOPMENT_MODE=true
SESSION_MAX_AGE=86400000
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ Archivo .env creado exitosamente');
  console.log('🔐 Credenciales configuradas:');
  console.log(`   👤 Usuario: ${username}`);
  console.log(`   🔑 Contraseña: ${password}`);
  console.log(`   🌐 Puerto: ${port}`);
  
  console.log('\n🚀 Para iniciar el servidor ejecuta:');
  console.log('   npm start     (producción)');
  console.log('   npm run dev   (desarrollo)');
  
  console.log('\n🌐 URLs de acceso:');
  console.log(`   Sitio principal: http://localhost:${port}`);
  console.log(`   Login admin: http://localhost:${port}/login`);
  console.log(`   Panel admin: http://localhost:${port}/admin`);
  
  console.log('\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro');
  
  rl.close();
}

setupEnvironment().catch(console.error);