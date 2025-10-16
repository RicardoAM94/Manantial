@echo off
echo 🔮 INSTALACIÓN DE MANANTIAL DE LOS SECRETOS 🔮
echo.
echo Este script te ayudará a configurar todo lo necesario para ejecutar
echo la aplicación en tu sistema Windows.
echo.

REM Verificar si Node.js está instalado
echo 🔍 Verificando si Node.js está instalado...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Node.js no está instalado en tu sistema.
    echo.
    echo 📥 NECESITAS INSTALAR Node.js MANUALMENTE:
    echo.
    echo 1. Ve a: https://nodejs.org/
    echo 2. Descarga la versión LTS (recomendada)
    echo 3. Instala siguiendo el asistente
    echo 4. Reinicia esta terminal
    echo 5. Ejecuta este script de nuevo
    echo.
    echo 💡 También necesitarás instalar Git si no lo tienes:
    echo    Descarga desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js está instalado
    node --version
    npm --version
)

echo.
echo 📦 Instalando dependencias del proyecto...
npm install

if errorlevel 1 (
    echo.
    echo ❌ Error al instalar dependencias.
    echo 💡 Intenta ejecutar: npm install --verbose
    pause
    exit /b 1
)

echo.
echo ✅ ¡Instalación completada exitosamente!
echo.
echo 🚀 PRÓXIMOS PASOS:
echo.
echo Para DESARROLLO (testing local):
echo   • Ejecuta: start-dev.bat
echo   • O manualmente: npm run dev
echo   • Abre: http://localhost:3000
echo.
echo Para PRODUCCIÓN (Raspberry Pi):
echo   • Sigue la guía en README.md
echo   • Sección "Deployment en Raspberry Pi"
echo.
echo 📱 IMPORTANTE - Configurar WhatsApp:
echo   • Edita public/js/main.js
echo   • Cambia el número en WHATSAPP_CONFIG
echo   • Línea 22: number: 'TU_NUMERO_CON_CODIGO_PAIS'
echo.
echo 🔮 ¡Tu página esotérica está lista!
echo.
pause