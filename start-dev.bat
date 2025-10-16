@echo off
echo 🔮 Iniciando Manantial de los Secretos (Modo Desarrollo)...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

REM Iniciar servidor en modo desarrollo
echo 🚀 Iniciando servidor de desarrollo...
echo 🌐 Abriendo en: http://localhost:3000
echo 🔧 Servidor sin restricciones CSP - Todas las fuentes permitidas
echo ⚠️  SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev-win