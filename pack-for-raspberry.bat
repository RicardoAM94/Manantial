@echo off
echo 🔮 Comprimiendo Manantial de los Secretos para Raspberry Pi...
echo ===========================================================

:: Cambiar al directorio padre
cd /d C:\Users\RicardoMR\Desktop\

:: Crear archivo ZIP excluyendo archivos innecesarios
echo 📦 Creando archivo manantial-secretos-raspberry.zip...

powershell -Command "Compress-Archive -Path 'ManatialDeLosSecretos\*' -DestinationPath 'manantial-secretos-raspberry.zip' -Force"

if exist "manantial-secretos-raspberry.zip" (
    echo ✅ Archivo creado exitosamente: manantial-secretos-raspberry.zip
    echo.
    echo 📁 Tamaño del archivo:
    dir "manantial-secretos-raspberry.zip" | find ".zip"
    echo.
    echo 🚀 Próximos pasos:
    echo 1. Transfiere el archivo manantial-secretos-raspberry.zip a tu Raspberry Pi
    echo 2. Ejecuta el script de instalación en la Raspberry Pi
    echo.
    echo 💡 Comandos para la Raspberry Pi:
    echo    scp manantial-secretos-raspberry.zip pi@[IP_RASPBERRY]:/home/pi/
    echo    ssh pi@[IP_RASPBERRY]
    echo    unzip manantial-secretos-raspberry.zip
    echo    chmod +x ManatialDeLosSecretos/install-raspberry.sh
    echo    ./ManatialDeLosSecretos/install-raspberry.sh
) else (
    echo ❌ Error al crear el archivo ZIP
    pause
    exit /b 1
)

echo.
echo 🎯 ¿Quieres abrir la carpeta con el archivo ZIP? (S/N)
set /p choice="> "
if /i "%choice%"=="S" (
    start .
)

pause