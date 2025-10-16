#!/bin/bash

# ===============================================
# ACTUALIZAR ARCHIVOS EN RASPBERRY PI
# Correcciones WhatsApp + Mejoras Responsive
# ===============================================

echo "🔄 Transfiriendo correcciones a Raspberry Pi..."

# Transferir archivos corregidos
echo "📱 Corrigiendo número de WhatsApp..."
scp "C:\Users\RicardoMR\Desktop\ManatialDeLosSecretos\public\js\main.js" ricardomr@192.168.0.250:/home/ricardomr/manantial/public/js/

echo "📱 Mejorando estilos responsive..."
scp "C:\Users\RicardoMR\Desktop\ManatialDeLosSecretos\public\css\styles.css" ricardomr@192.168.0.250:/home/ricardomr/manantial/public/css/

echo "✅ Archivos transferidos exitosamente"
echo ""
echo "🔧 CAMBIOS REALIZADOS:"
echo "  ✅ Número WhatsApp corregido: +573148014430"
echo "  ✅ Fuentes más grandes en móviles"
echo "  ✅ Eliminado scroll horizontal"
echo "  ✅ Mejor responsive design"
echo ""
echo "🌐 Probar en: http://192.168.0.250:3000"

pause