// ================================
// PANEL DE ADMINISTRACIÓN - JS
// ================================

// Variables globales
let announcements = [];
let currentEditId = null;

// ========================
// AUTENTICACIÓN
// ========================
function addLogoutButton() {
    // Agregar botón de logout al header si no existe
    const header = document.querySelector('.admin-header');
    if (header && !document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
        logoutBtn.addEventListener('click', handleLogout);
        header.appendChild(logoutBtn);
    }
}

async function handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        try {
            console.log('🚪 Iniciando logout...');
            
            const response = await fetch('/admin/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'  // Incluir cookies de sesión
            });
            
            console.log('📡 Respuesta logout:', response.status, response.statusText);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Logout exitoso:', result);
                window.location.href = '/login';
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }
        } catch (error) {
            console.error('❌ Error en logout:', error);
            // Si hay error de red, aún redirigir al login
            if (confirm('Error al cerrar sesión. ¿Ir al login de todos modos?')) {
                window.location.href = '/login';
            }
        }
    }
}

// Manejar sesión expirada
function handleSessionExpired() {
    alert('Tu sesión ha expirado. Serás redirigido al login.');
    window.location.href = '/login';
}

// Configuración de API
const API = {
    announcements: '/api/announcements',
    activeAnnouncements: '/api/announcements/active',
    config: '/api/config',
    stats: '/api/stats'
};

// ========================
// INICIALIZACIÓN
// ========================
document.addEventListener('DOMContentLoaded', async function() {
    initializeAdmin();
    await loadAnnouncements();
    await loadConfiguration();
    await loadStats();
    setupEventListeners();
});

function initializeAdmin() {
    console.log('🔮 Panel de Administración - Manantial de los Secretos');
    
    // Agregar botón de logout
    addLogoutButton();
    
    // Mostrar tab activo
    showTab('announcements');
    
    // Configurar formulario
    setupFormHandlers();
}

function setupEventListeners() {
    // Formulario de anuncio
    const announcementForm = document.getElementById('announcement-form');
    if (announcementForm) {
        announcementForm.addEventListener('submit', handleAnnouncementSubmit);
    }
    
    // Selector de mensaje WhatsApp personalizado
    const whatsappMsgSelect = document.getElementById('ann-whatsapp-msg');
    if (whatsappMsgSelect) {
        whatsappMsgSelect.addEventListener('change', handleWhatsAppMessageChange);
    }
    
    // Prevenir cierre accidental
    window.addEventListener('beforeunload', function(e) {
        const hasUnsavedChanges = checkUnsavedChanges();
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function setupFormHandlers() {
    // Configurar valores por defecto en formularios
    const dateInput = document.getElementById('ann-date');
    const expiresInput = document.getElementById('ann-expires');
    
    if (dateInput && !dateInput.value) {
        dateInput.value = getTomorrowDate();
    }
    
    if (expiresInput && !expiresInput.value) {
        expiresInput.value = getNextWeekDate();
    }
    
    // Configurar validaciones adicionales
    const titleInput = document.getElementById('ann-title');
    const cityInput = document.getElementById('ann-city');
    
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
        });
    }
    
    if (cityInput) {
        cityInput.addEventListener('input', function() {
            this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
        });
    }
}

// ========================
// GESTIÓN DE TABS
// ========================
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activar nav item
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Cargar datos específicos del tab
    if (tabName === 'announcements') {
        renderAnnouncements();
    } else if (tabName === 'analytics') {
        updateStats();
    }
}

// ========================
// FUNCIONES HTTP
// ========================
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        // Verificar si la sesión expiró (redirección a login)
        if (response.status === 401 || response.url.includes('/login')) {
            handleSessionExpired();
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        
        // Verificar si es un error de sesión
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            handleSessionExpired();
            return;
        }
        
        showToast('Error de conexión con el servidor', 'error');
        throw error;
    }
}

// ========================
// GESTIÓN DE ANUNCIOS
// ========================
async function loadAnnouncements() {
    try {
        console.log('📡 Cargando anuncios desde el servidor...');
        announcements = await apiCall(API.announcements);
        console.log(`✅ ${announcements.length} anuncios cargados desde el servidor`);
        renderAnnouncements();
    } catch (error) {
        console.error('❌ Error cargando anuncios:', error);
        announcements = [];
        renderAnnouncements();
    }
}

async function saveAnnouncement(announcementData, isEdit = false) {
    try {
        console.log('💾 Guardando anuncio en el servidor...');
        
        let result;
        if (isEdit) {
            result = await apiCall(`${API.announcements}/${announcementData.id}`, {
                method: 'PUT',
                body: JSON.stringify(announcementData)
            });
            console.log('✅ Anuncio actualizado en el servidor');
        } else {
            result = await apiCall(API.announcements, {
                method: 'POST',
                body: JSON.stringify(announcementData)
            });
            console.log('✅ Anuncio creado en el servidor');
        }
        
        // Recargar anuncios desde el servidor
        await loadAnnouncements();
        return result;
    } catch (error) {
        console.error('❌ Error guardando anuncio:', error);
        throw error;
    }
}

function renderAnnouncements() {
    const activeList = document.getElementById('announcements-list');
    const scheduledList = document.getElementById('scheduled-list');
    
    // Limpiar listas
    activeList.innerHTML = '';
    scheduledList.innerHTML = '';
    
    // Filtrar anuncios
    const activeAnnouncements = announcements.filter(ann => ann.status === 'active');
    const scheduledAnnouncements = announcements.filter(ann => ann.status === 'scheduled');
    
    // Renderizar anuncios activos
    if (activeAnnouncements.length === 0) {
        activeList.innerHTML = '<div class="empty-state">No hay anuncios activos. <button class="btn-primary" onclick="showAddAnnouncementModal()">Crear el primero</button></div>';
    } else {
        activeAnnouncements.forEach(announcement => {
            activeList.appendChild(createAnnouncementCard(announcement));
        });
    }
    
    // Renderizar anuncios programados
    if (scheduledAnnouncements.length === 0) {
        scheduledList.innerHTML = '<div class="empty-state">No hay anuncios programados.</div>';
    } else {
        scheduledAnnouncements.forEach(announcement => {
            scheduledList.appendChild(createAnnouncementCard(announcement, true));
        });
    }
}

function createAnnouncementCard(announcement, isScheduled = false) {
    const card = document.createElement('div');
    card.className = 'announcement-card';
    
    const priorityClass = `priority-${announcement.priority}`;
    const statusClass = `status-${announcement.status}`;
    
    // Verificar si está vencido
    const isExpired = announcement.expires && new Date(announcement.expires) < new Date();
    
    card.innerHTML = `
        <div class="announcement-header">
            <h3 class="announcement-title">${announcement.title}</h3>
            <span class="priority-badge ${priorityClass}">
                ${announcement.priority === 'high' ? '🔴 Alta' : 
                  announcement.priority === 'low' ? '🟢 Baja' : '🟡 Normal'}
            </span>
        </div>
        
        <div class="status-badge ${statusClass}">
            ${announcement.status === 'active' ? '✅ Activo' : 
              announcement.status === 'scheduled' ? '⏳ Programado' : '❌ Inactivo'}
        </div>
        
        <div class="announcement-meta">
            <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${announcement.city}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(announcement.date)}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${announcement.time}</span>
            </div>
            ${announcement.location ? `
                <div class="meta-item">
                    <i class="fas fa-building"></i>
                    <span>${announcement.location}</span>
                </div>
            ` : ''}
        </div>
        
        ${announcement.description ? `
            <div class="announcement-description">
                ${announcement.description}
            </div>
        ` : ''}
        
        ${isExpired ? `
            <div class="expired-notice" style="background: #fee2e2; color: #991b1b; padding: 0.5rem; border-radius: 4px; margin: 1rem 0; font-size: 0.9rem;">
                <i class="fas fa-exclamation-triangle"></i> Este anuncio ha vencido
            </div>
        ` : ''}
        
        <div class="announcement-actions">
            <button class="btn-primary btn-small" onclick="editAnnouncement('${announcement.id}')">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-secondary btn-small" onclick="duplicateAnnouncement('${announcement.id}')">
                <i class="fas fa-copy"></i> Duplicar
            </button>
            <button class="btn-secondary btn-small" onclick="previewWhatsApp('${announcement.id}')">
                <i class="fab fa-whatsapp"></i> Preview
            </button>
            <button class="btn-danger btn-small" onclick="deleteAnnouncement('${announcement.id}')">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    return card;
}

// ========================
// MODAL DE ANUNCIOS
// ========================
function showAddAnnouncementModal() {
    currentEditId = null;
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-plus"></i> Nuevo Anuncio';
    clearAnnouncementForm();
    document.getElementById('announcement-modal').classList.add('active');
}

function editAnnouncement(id) {
    const announcement = announcements.find(ann => ann.id === id);
    if (!announcement) return;
    
    currentEditId = id;
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-edit"></i> Editar Anuncio';
    
    // Llenar formulario
    document.getElementById('ann-title').value = announcement.title;
    document.getElementById('ann-city').value = announcement.city;
    document.getElementById('ann-date').value = announcement.date;
    document.getElementById('ann-time').value = announcement.time;
    document.getElementById('ann-location').value = announcement.location || '';
    document.getElementById('ann-description').value = announcement.description || '';
    document.getElementById('ann-priority').value = announcement.priority;
    document.getElementById('ann-status').value = announcement.status;
    document.getElementById('ann-expires').value = announcement.expires || '';
    document.getElementById('ann-whatsapp-msg').value = announcement.whatsappMsg || 'consulta-presencial';
    document.getElementById('ann-custom-msg').value = announcement.customMsg || '';
    
    handleWhatsAppMessageChange();
    document.getElementById('announcement-modal').classList.add('active');
}

function duplicateAnnouncement(id) {
    const announcement = announcements.find(ann => ann.id === id);
    if (!announcement) return;
    
    const duplicate = {
        ...announcement,
        id: generateId(),
        title: `${announcement.title} (Copia)`,
        status: 'inactive',
        created: new Date().toISOString()
    };
    
    announcements.unshift(duplicate);
    saveAnnouncements();
    showToast('Anuncio duplicado exitosamente', 'success');
}

function deleteAnnouncement(id) {
    const announcement = announcements.find(ann => ann.id === id);
    if (!announcement) return;
    
    showConfirmModal(
        '¿Eliminar anuncio?',
        `¿Estás seguro de que quieres eliminar "${announcement.title}"? Esta acción no se puede deshacer.`,
        async () => {
            try {
                await apiCall(`${API.announcements}/${id}`, { method: 'DELETE' });
                await loadAnnouncements();
                showToast('Anuncio eliminado exitosamente', 'success');
            } catch (error) {
                console.error('❌ Error eliminando anuncio:', error);
                showToast('Error al eliminar anuncio', 'error');
            }
        }
    );
}

function clearAnnouncementForm() {
    const form = document.getElementById('announcement-form');
    const dateInput = document.getElementById('ann-date');
    const expiresInput = document.getElementById('ann-expires');
    
    if (form) {
        form.reset();
    }
    
    if (dateInput) {
        dateInput.value = getTomorrowDate();
    }
    
    if (expiresInput) {
        expiresInput.value = getNextWeekDate();
    }
    
    handleWhatsAppMessageChange();
}

async function handleAnnouncementSubmit(e) {
    e.preventDefault();
    console.log('📝 Enviando formulario de anuncio...');
    
    // Validar campos requeridos
    const titleElement = document.getElementById('ann-title');
    const cityElement = document.getElementById('ann-city');
    const dateElement = document.getElementById('ann-date');
    
    if (!titleElement || !cityElement || !dateElement) {
        console.error('❌ Elementos del formulario no encontrados');
        showToast('Error en el formulario', 'error');
        return;
    }
    
    if (!titleElement.value.trim() || !cityElement.value.trim() || !dateElement.value) {
        showToast('Por favor completa los campos obligatorios', 'error');
        return;
    }
    
    const formData = {
        id: currentEditId || generateId(),
        title: titleElement.value.trim(),
        city: cityElement.value.trim(),
        date: dateElement.value,
        time: document.getElementById('ann-time')?.value || '',
        location: document.getElementById('ann-location')?.value || '',
        description: document.getElementById('ann-description')?.value || '',
        priority: document.getElementById('ann-priority')?.value || 'normal',
        status: document.getElementById('ann-status')?.value || 'active',
        expires: document.getElementById('ann-expires')?.value || '',
        whatsappMsg: document.getElementById('ann-whatsapp-msg')?.value || 'consulta-presencial',
        customMsg: document.getElementById('ann-custom-msg')?.value || '',
        created: currentEditId ? 
            (announcements.find(ann => ann.id === currentEditId)?.created || new Date().toISOString()) : 
            new Date().toISOString()
    };
    
    console.log('📋 Datos del formulario:', formData);
    
    try {
        if (currentEditId) {
            // Editar existente
            await saveAnnouncement(formData, true);
            console.log('✏️ Anuncio editado:', formData.title);
            showToast('Anuncio actualizado exitosamente', 'success');
        } else {
            // Agregar nuevo
            await saveAnnouncement(formData, false);
            console.log('➕ Nuevo anuncio creado:', formData.title);
            showToast('Anuncio creado exitosamente', 'success');
        }
        
        closeModal();
    } catch (error) {
        console.error('❌ Error al procesar anuncio:', error);
        showToast('Error al guardar el anuncio', 'error');
    }
}

function handleWhatsAppMessageChange() {
    const select = document.getElementById('ann-whatsapp-msg');
    const customGroup = document.getElementById('custom-msg-group');
    
    if (!select || !customGroup) return;
    
    if (select.value === 'custom') {
        customGroup.style.display = 'block';
    } else {
        customGroup.style.display = 'none';
    }
}

// ========================
// PREVIEW DE WHATSAPP
// ========================
async function previewWhatsApp(id) {
    const announcement = announcements.find(ann => ann.id === id);
    if (!announcement) return;
    
    const config = await getWhatsAppConfig();
    let message = '';
    
    if (announcement.whatsappMsg === 'custom' && announcement.customMsg) {
        message = announcement.customMsg;
    } else if (announcement.whatsappMsg === 'viaje-ciudad') {
        message = `¡Hola! Me interesa agendar una cita para la atención en ${announcement.city} el ${formatDate(announcement.date)}. ¿Hay disponibilidad?`;
    } else {
        message = '¡Hola! Me interesa agendar una cita para atención presencial. ¿Cuál es la disponibilidad?';
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${config.number}?text=${encodedMessage}`;
    
    // Mostrar preview
    const preview = `
        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 400px; margin: 2rem auto;">
            <h3 style="margin: 0 0 1rem 0; color: #25D366; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fab fa-whatsapp"></i> Preview WhatsApp
            </h3>
            <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-family: system-ui;">
                "${message}"
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn-primary" onclick="window.open('${whatsappUrl}', '_blank')">
                    <i class="fab fa-whatsapp"></i> Abrir WhatsApp
                </button>
                <button class="btn-secondary" onclick="closePreview()">Cerrar</button>
            </div>
        </div>
        <div id="preview-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;" onclick="closePreview()"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', preview);
}

function closePreview() {
    const backdrop = document.getElementById('preview-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

// ========================
// CONFIGURACIÓN
// ========================
async function loadConfiguration() {
    try {
        console.log('📡 Cargando configuración desde el servidor...');
        const config = await apiCall(API.config);
        
        const whatsappInput = document.getElementById('whatsapp-number');
        const msgPresencialInput = document.getElementById('msg-presencial');
        const msgViajesInput = document.getElementById('msg-viajes');
        
        if (whatsappInput && config.whatsapp) {
            whatsappInput.value = config.whatsapp.number || '';
        }
        
        if (msgPresencialInput && config.messages) {
            msgPresencialInput.value = config.messages.presencial || '';
        }
        
        if (msgViajesInput && config.messages) {
            msgViajesInput.value = config.messages.viajes || '';
        }
        
        console.log('✅ Configuración cargada');
    } catch (error) {
        console.error('❌ Error cargando configuración:', error);
    }
}

async function saveWhatsAppConfig() {
    try {
        const numberInput = document.getElementById('whatsapp-number');
        const number = numberInput.value.trim();
        
        if (!number) {
            showToast('Por favor ingresa un número de WhatsApp', 'error');
            return;
        }
        
        // Validar el número antes de guardar
        const validation = validateWhatsAppNumber(number);
        if (!validation.valid) {
            showToast(`Error: ${validation.error}`, 'error');
            return;
        }
        
        const config = {
            whatsapp: { number: validation.formatted },
            updated: new Date().toISOString()
        };
        
        await apiCall(API.config, {
            method: 'PUT',
            body: JSON.stringify(config)
        });
        
        // Actualizar el input con el formato correcto
        numberInput.value = validation.formatted;
        
        showToast(`✅ Configuración guardada para ${validation.country}`, 'success');
        console.log('📱 WhatsApp config saved:', validation.formatted);
        
    } catch (error) {
        console.error('❌ Error guardando configuración WhatsApp:', error);
        showToast('Error al guardar configuración', 'error');
    }
}

async function saveMessageTemplates() {
    try {
        const config = {
            messages: {
                presencial: document.getElementById('msg-presencial').value,
                viajes: document.getElementById('msg-viajes').value,
                updated: new Date().toISOString()
            }
        };
        
        await apiCall(API.config, {
            method: 'PUT',
            body: JSON.stringify(config)
        });
        
        showToast('Plantillas de mensajes guardadas', 'success');
        console.log('📝 Message templates saved');
    } catch (error) {
        console.error('❌ Error guardando plantillas:', error);
        showToast('Error al guardar plantillas', 'error');
    }
}

// Función para obtener configuración de WhatsApp del servidor
async function getWhatsAppConfig() {
    try {
        const response = await apiCall(API.config);
        return response.whatsapp || { number: '573148014430' };
    } catch (error) {
        console.error('❌ Error obteniendo configuración WhatsApp:', error);
        return { number: '573148014430' };
    }
}

// ========================
// ESTADÍSTICAS
// ========================
async function loadStats() {
    try {
        console.log('📊 Cargando estadísticas desde el servidor...');
        const stats = await apiCall(API.stats);
        updateStatsDisplay(stats);
        console.log('✅ Estadísticas cargadas');
        return stats;
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        const defaultStats = {
            pageViews: 0,
            whatsappClicks: 0,
            totalAnnouncements: 0
        };
        updateStatsDisplay(defaultStats);
        return defaultStats;
    }
}

function updateStatsDisplay(stats) {
    const activeAnnouncements = announcements.filter(ann => ann.status === 'active').length;
    
    const pageViewsEl = document.getElementById('page-views');
    const whatsappClicksEl = document.getElementById('whatsapp-clicks');
    const activeAnnouncementsEl = document.getElementById('active-announcements');
    
    if (pageViewsEl) pageViewsEl.textContent = stats.pageViews || 0;
    if (whatsappClicksEl) whatsappClicksEl.textContent = stats.whatsappClicks || 0;
    if (activeAnnouncementsEl) activeAnnouncementsEl.textContent = activeAnnouncements;
}

async function updateStats() {
    try {
        const stats = await apiCall(API.stats);
        updateStatsDisplay(stats);
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

// ========================
// MODALES
// ========================
function closeModal() {
    const modal = document.getElementById('announcement-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    
    const confirmBtn = document.getElementById('confirm-action');
    confirmBtn.onclick = () => {
        onConfirm();
        closeConfirmModal();
    };
    
    document.getElementById('confirm-modal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

// ========================
// UTILIDADES
// ========================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function getNextWeekDate() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
}

function checkUnsavedChanges() {
    // Implementar lógica para detectar cambios no guardados
    return false;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'times-circle' : 
                          'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    });
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#2563eb'
    };
    
    toast.style.background = colors[type];
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// ========================
// ACCIONES GLOBALES
// ========================
function previewSite() {
    window.open('/', '_blank');
}

function clearAllData() {
    showConfirmModal(
        '¿Eliminar todos los datos?',
        '¿Estás seguro de que quieres eliminar todos los anuncios, configuraciones y estadísticas? Esta acción no se puede deshacer.',
        () => {
            localStorage.removeItem(CONFIG.storageKey);
            localStorage.removeItem(CONFIG.whatsappKey);
            localStorage.removeItem(CONFIG.messagesKey);
            localStorage.removeItem(CONFIG.statsKey);
            
            announcements = [];
            renderAnnouncements();
            loadConfiguration();
            updateStats();
            
            showToast('Todos los datos han sido eliminados', 'success');
        }
    );
}

function logout() {
    handleLogout();
}

// ========================
// API PARA EL SITIO PRINCIPAL
// ========================
window.ManantialAdmin = {
    getActiveAnnouncements: () => {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (!stored) return [];
        
        const announcements = JSON.parse(stored);
        const now = new Date();
        
        return announcements.filter(ann => {
            if (ann.status !== 'active') return false;
            if (ann.expires && new Date(ann.expires) < now) return false;
            return true;
        }).sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    },
    
    getWhatsAppConfig: getWhatsAppConfig,
    
    incrementStat: (stat) => {
        const stats = loadStats();
        stats[stat] = (stats[stat] || 0) + 1;
        localStorage.setItem(CONFIG.statsKey, JSON.stringify(stats));
    }
};