@echo off
echo 🔮 INSTALADOR - MANANTIAL DE LOS SECRETOS 🔮
echo ===============================================
echo.

REM Verificar si Node.js está instalado
echo 📋 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado.
    echo.
    echo 📥 Por favor descarga e instala Node.js desde:
    echo 🌐 https://nodejs.org/
    echo.
    echo Después ejecuta este instalador nuevamente.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version
echo.

REM Verificar si npm está disponible
echo 📋 Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está disponible.
    pause
    exit /b 1
)

echo ✅ npm encontrado:
npm --version
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias del proyecto...
echo Por favor espera, esto puede tomar unos minutos...
echo.

npm install

if errorlevel 1 (
    echo ❌ Error al instalar dependencias.
    echo.
    echo 🔧 Intentando solución alternativa...
    npm install --legacy-peer-deps
    
    if errorlevel 1 (
        echo ❌ No se pudieron instalar las dependencias.
        echo Por favor verifica tu conexión a internet e intenta nuevamente.
        pause
        exit /b 1
    )
)

echo.
echo ✅ ¡Instalación completada exitosamente!
echo.
echo 🚀 Para iniciar el servidor de desarrollo ejecuta:
echo    start-dev.bat
echo.
echo 🌐 El sitio estará disponible en:
echo    http://localhost:3000
echo.
echo 📚 Para más información lee el archivo README.md
echo.
pause