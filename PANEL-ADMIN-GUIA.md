# Panel de Administración - Manantial de los Secretos

## 🔮 Acceso al Panel

Para acceder al panel de administración:
- URL: `http://localhost:3000/admin` (desarrollo)
- URL: `http://tu-dominio.com/admin` (producción)

## 📢 Gestión de Anuncios

### Crear Nuevo Anuncio
1. Hacer clic en "Nuevo Anuncio"
2. Llenar el formulario con:
   - **Título**: Nombre del anuncio (ej: "Atención en Medellín")
   - **Ciudad**: Ciudad donde brindarás el servicio
   - **Fecha**: Fecha del viaje/atención
   - **Horario**: Horarios disponibles (ej: "9:00 AM - 6:00 PM")
   - **Ubicación**: Lugar específico (opcional)
   - **Descripción**: Información adicional
   - **Prioridad**: Alta, Normal, Baja
   - **Estado**: Activo, Programado, Inactivo
   - **Vencimiento**: Fecha cuando el anuncio se ocultará automáticamente

### Estados de Anuncios
- **Activo**: Se muestra en el slider del sitio principal
- **Programado**: Preparado para activar más tarde
- **Inactivo**: Oculto, no se muestra

### Prioridades
- **Alta** 🔴: Se muestran primero en el slider
- **Normal** 🟡: Orden estándar
- **Baja** 🟢: Se muestran al final

## 📱 Configuración de WhatsApp

### Configurar Número
1. Ir a la pestaña "Configuración"
2. Ingresar el número con código de país (ej: 573148014430)
3. Hacer clic en "Guardar"

### Mensajes Personalizados
El sistema permite configurar diferentes tipos de mensajes:

- **Consulta presencial general**
- **Viaje a ciudad específica**: Incluye automáticamente la ciudad y fecha
- **Mensaje personalizado**: Texto libre para cada anuncio

## 📊 Estadísticas

El panel muestra:
- **Visitas a la página**: Número total de visitantes
- **Clics en WhatsApp**: Cuántas veces han contactado por WhatsApp
- **Anuncios activos**: Total de anuncios funcionando

## 🔧 Funciones Disponibles

### Por cada anuncio:
- **Editar**: Modificar información del anuncio
- **Duplicar**: Crear una copia para otro viaje/fecha
- **Preview**: Ver cómo se verá el mensaje de WhatsApp
- **Eliminar**: Borrar permanentemente

### Plantillas de mensajes predefinidas:
- **viaje-ciudad**: "¡Hola! Me interesa agendar una cita para la atención en [CIUDAD] el [FECHA]. ¿Hay disponibilidad?"
- **consulta-presencial**: "¡Hola! Me interesa agendar una cita para atención presencial. ¿Cuál es la disponibilidad?"
- **custom**: Mensaje personalizado que tu defines

## 💡 Consejos de Uso

### Para Viajes Semanales:
1. Crea un anuncio base con toda la información común
2. Usa "Duplicar" para crear versiones para otras ciudades/fechas
3. Activa solo los anuncios de la semana actual
4. Programa los siguientes para que se activen automáticamente

### Gestión Eficiente:
- **Vencimiento automático**: Los anuncios se ocultan solos después de la fecha
- **Estados**: Usa "Programado" para preparar anuncios futuros
- **Prioridad Alta**: Para anuncios urgentes o de última hora

### Mensajes Efectivos:
- Personaliza mensajes para cada tipo de servicio
- Incluye información específica como horarios y ubicación
- Usa el preview para verificar cómo se ve antes de publicar

## 🔄 Integración Automática

El panel está integrado con el sitio principal:
- Los anuncios activos aparecen automáticamente en el slider
- Los mensajes de WhatsApp se personalizan según el anuncio
- Las estadísticas se actualizan en tiempo real
- Todo se guarda localmente en el navegador

## 🚀 Ejemplo de Flujo de Trabajo Semanal

1. **Lunes**: Planificar viajes de la semana
2. **Martes**: Crear anuncios para todas las ciudades
3. **Miércoles**: Activar anuncio de la ciudad de esta semana
4. **Domingo**: El anuncio se desactiva automáticamente por vencimiento
5. **Siguiente lunes**: Duplicar y activar el siguiente anuncio

## 📱 Compatibilidad

- ✅ Escritorio (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (Responsive design)
- ✅ Móvil (Interfaz adaptada)
- ✅ Datos guardados localmente (no se pierden al cerrar)

## 🔐 Seguridad

- Solo accesible desde el servidor
- Datos almacenados localmente en el navegador
- No requiere bases de datos externas
- Completamente autónomo

---

**¡El panel está listo para usar! 🎉**

Accede a `http://localhost:3000/admin` y comienza a gestionar tus anuncios de viajes y atención presencial.