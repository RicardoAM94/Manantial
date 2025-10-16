# 🔮 Script de Empaquetado para Raspberry Pi
# Manantial de los Secretos v2.0

Write-Host "🔮 Empaquetando Manantial de los Secretos para Raspberry Pi..." -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

# Definir rutas
$sourceDir = "C:\Users\RicardoMR\Desktop\ManatialDeLosSecretos"
$destinationZip = "C:\Users\RicardoMR\Desktop\manantial-secretos-raspberry.zip"

# Verificar que el directorio fuente existe
if (!(Test-Path $sourceDir)) {
    Write-Host "❌ Error: No se encuentra el directorio $sourceDir" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Eliminar archivo ZIP anterior si existe
if (Test-Path $destinationZip) {
    Write-Host "🗑️ Eliminando archivo ZIP anterior..." -ForegroundColor Yellow
    Remove-Item $destinationZip -Force
}

try {
    # Crear archivo ZIP
    Write-Host "📦 Creando archivo ZIP..." -ForegroundColor Green
    
    # Archivos y carpetas a incluir
    $itemsToCompress = @(
        "server.js",
        "package.json", 
        ".env",
        ".gitignore",
        "DEPLOY-RASPBERRY.md",
        "SECURITY.md",
        "setup.js",
        "pm2.config.js",
        "install-raspberry.sh",
        "data",
        "public"
    )
    
    # Cambiar al directorio fuente
    Set-Location $sourceDir
    
    # Comprimir archivos seleccionados
    $fullPaths = @()
    foreach ($item in $itemsToCompress) {
        if (Test-Path $item) {
            $fullPaths += $item
            Write-Host "  ✓ Incluyendo: $item" -ForegroundColor Gray
        } else {
            Write-Host "  ⚠️ No encontrado: $item" -ForegroundColor Yellow
        }
    }
    
    Compress-Archive -Path $fullPaths -DestinationPath $destinationZip -Force
    
    if (Test-Path $destinationZip) {
        Write-Host "✅ Archivo creado exitosamente!" -ForegroundColor Green
        
        # Mostrar información del archivo
        $fileInfo = Get-Item $destinationZip
        Write-Host ""
        Write-Host "📁 Información del archivo:" -ForegroundColor Cyan
        Write-Host "   Ubicación: $($fileInfo.FullName)" -ForegroundColor Gray
        Write-Host "   Tamaño: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
        Write-Host "   Creado: $($fileInfo.CreationTime)" -ForegroundColor Gray
        
        Write-Host ""
        Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "1. Transfiere el archivo a tu Raspberry Pi" -ForegroundColor White
        Write-Host "2. Ejecuta el script de instalación automática" -ForegroundColor White
        
        Write-Host ""
        Write-Host "💡 Comandos sugeridos para Raspberry Pi:" -ForegroundColor Yellow
        Write-Host "   # Transferir archivo" -ForegroundColor Gray
        Write-Host "   scp manantial-secretos-raspberry.zip pi@[IP_RASPBERRY]:/home/pi/" -ForegroundColor Green
        Write-Host ""
        Write-Host "   # Conectar por SSH" -ForegroundColor Gray
        Write-Host "   ssh pi@[IP_RASPBERRY]" -ForegroundColor Green
        Write-Host ""
        Write-Host "   # Extraer y ejecutar instalador" -ForegroundColor Gray
        Write-Host "   unzip manantial-secretos-raspberry.zip" -ForegroundColor Green
        Write-Host "   chmod +x ManatialDeLosSecretos/install-raspberry.sh" -ForegroundColor Green
        Write-Host "   ./ManatialDeLosSecretos/install-raspberry.sh" -ForegroundColor Green
        
        Write-Host ""
        $openFolder = Read-Host "¿Abrir la carpeta con el archivo ZIP? (s/N)"
        if ($openFolder -eq "s" -or $openFolder -eq "S") {
            Start-Process "explorer.exe" -ArgumentList "/select,`"$destinationZip`""
        }
        
    } else {
        Write-Host "❌ Error: No se pudo crear el archivo ZIP" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error durante la compresión: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔮 Proceso completado. ¡Buena suerte con tu despliegue!" -ForegroundColor Magenta
Read-Host "Presiona Enter para salir"