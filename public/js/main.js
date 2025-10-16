// ================================
// MANANTIAL DE LOS SECRETOS - JS
// ================================

// Variables globales
let currentSlideIndex = 0;
let slides = document.querySelectorAll('.slide');
let dots = document.querySelectorAll('.dot');
let slideInterval;

// Configuración de WhatsApp
const WHATSAPP_CONFIG = {
    number: '573148014430', // Número de WhatsApp con código de país (57 = Colombia)
    messages: {
        default: '¡Hola! Me interesa una consulta esotérica. ¿Podrías darme más información sobre tus servicios?',
        'amarre-amor': '¡Hola! Me interesa información sobre amarres de amor. ¿Podrías ayudarme?',
        'amarres': '¡Hola! Necesito información sobre amarres. ¿Qué tipos de rituales realizas?',
        'endulzamiento': '¡Hola! Me interesa un endulzamiento. ¿Podrías explicarme cómo funciona?',
        'union-parejas': '¡Hola! Quiero información sobre rituales de unión de parejas.',
        'magia-blanca': '¡Hola! Me interesa la magia blanca para protección y limpieza espiritual.',
        'magia-roja': '¡Hola! Necesito información sobre magia roja y rituales de pasión.',
        'magia-negra': '¡Hola! Tengo una situación compleja que requiere magia negra. ¿Puedes ayudarme?',
        'rituales-suerte': '¡Hola! Quiero atraer suerte a mi vida. ¿Qué rituales recomiendas?',
        'abundancia-material': '¡Hola! Necesito ayuda para atraer dinero y prosperidad económica.',
        'exito-profesional': '¡Hola! Busco rituales para el éxito profesional y oportunidades laborales.',
        'suerte': '¡Hola! Me interesa información sobre rituales de suerte y prosperidad.',
        'amarre-dulce': '¡Hola! Me interesa un amarre dulce que respete el libre albedrío.',
        'amarre-dominio': '¡Hola! Tengo una situación difícil que requiere un amarre de dominio.',
        'amarre-sexual': '¡Hola! Me interesa información sobre amarres sexuales.',
        'consulta-express': '¡Hola! Quiero hacer una consulta express por WhatsApp.',
        'consulta-completa': '¡Hola! Me interesa reservar una consulta completa con lectura de cartas.',
        'consulta-presencial': '¡Hola! Me interesa agendar una cita para atención presencial. ¿Cuál es la disponibilidad?',
        'ritual-personalizado': '¡Hola! Necesito un ritual personalizado para mi situación específica.'
    }
};

// ========================
// INICIALIZACIÓN
// ========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 DOM cargado, inicializando app...');
    initializeApp();
    loadAdminAnnouncements();
    setupEventListeners();
    startSlideshow();
    createParticles();
    setupScrollAnimations();
    
    // Función de emergencia para saltar el loader (click en cualquier parte)
    document.addEventListener('click', function hideLoaderEmergency() {
        const loader = document.getElementById('loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
            console.log('🔮 Loader ocultado manualmente');
        }
        // Remover listener después del primer uso
        document.removeEventListener('click', hideLoaderEmergency);
    });
});

// Inicializar aplicación
function initializeApp() {
    // Ocultar loader después de 1 segundo (más rápido)
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = 'auto'; // Permitir scroll
            }, 500);
        }
    }, 1000); // Reducido de 2000 a 1000

    // Configurar navegación suave
    setupSmoothScrolling();
    
    // Configurar responsive menu
    setupMobileMenu();
    
    // Debug: confirmar que la app se inicializó
    console.log('🔮 Manantial de los Secretos - App inicializada correctamente');
    
    // Diagnóstico de elementos
    setTimeout(() => {
        diagnosticElements();
    }, 500);
}

// ========================
// INTEGRACIÓN CON PANEL ADMIN
// ========================
async function loadAdminAnnouncements() {
    try {
        console.log('📡 Cargando anuncios activos desde el servidor...');
        const response = await fetch('/api/announcements/active');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const activeAnnouncements = await response.json();
        console.log(`📢 ${activeAnnouncements.length} anuncios activos cargados:`, activeAnnouncements);
        
        if (activeAnnouncements.length > 0) {
            console.log('🔄 Actualizando slider con anuncios del servidor...');
            updateSliderWithAnnouncements(activeAnnouncements);
        } else {
            console.log('📢 No hay anuncios activos, manteniendo slides por defecto');
            // Mantener slides por defecto si no hay anuncios
        }
        
        // Incrementar contador de visitas
        await incrementPageViews();
        
    } catch (error) {
        console.error('❌ Error cargando anuncios:', error);
        console.log('📢 Usando slides por defecto debido al error');
    }
}

async function incrementPageViews() {
    try {
        await fetch('/api/stats/pageViews', { method: 'POST' });
    } catch (error) {
        console.log('No se pudo actualizar estadística de visitas');
    }
}

function updateSliderWithAnnouncements(announcements) {
    console.log(`📢 Actualizando slider con ${announcements.length} anuncios`);
    updateSliderContent(announcements);
}

function updateSliderContent(announcements) {
    const sliderContainer = document.querySelector('.slider-container');
    const dotsContainer = document.querySelector('.slide-dots');
    
    if (!sliderContainer || !dotsContainer) {
        console.error('❌ No se encontraron elementos del slider:', {
            sliderContainer: !!sliderContainer,
            dotsContainer: !!dotsContainer
        });
        return;
    }
    
    // Limpiar contenido actual
    sliderContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Crear slides desde anuncios
    announcements.forEach((announcement, index) => {
        // Determinar color temático según el tipo de anuncio
        let gradientTheme = 'gradient-purple'; // por defecto
        
        if (announcement.id.includes('amor')) {
            gradientTheme = 'gradient-amor';
        } else if (announcement.id.includes('danos') || announcement.id.includes('proteccion')) {
            gradientTheme = 'gradient-proteccion';
        } else if (announcement.id.includes('suerte') || announcement.id.includes('prosperidad')) {
            gradientTheme = 'gradient-suerte';
        } else if (announcement.id.includes('rituales') || announcement.id.includes('personalizados')) {
            gradientTheme = 'gradient-rituales';
        }
        
        // Crear slide con la estructura completa
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.setAttribute('data-bg', gradientTheme);
        
        // Determinar símbolos temáticos
        let symbols = ['📍', '📅', '🔮']; // por defecto
        
        if (announcement.id.includes('amor')) {
            symbols = ['💖', '🌹', '💑'];
        } else if (announcement.id.includes('danos') || announcement.id.includes('proteccion')) {
            symbols = ['🛡️', '👁️', '⚡'];
        } else if (announcement.id.includes('suerte') || announcement.id.includes('prosperidad')) {
            symbols = ['🍀', '💰', '✨'];
        } else if (announcement.id.includes('rituales') || announcement.id.includes('personalizados')) {
            symbols = ['🔮', '🌙', '✨'];
        }
        
        slide.innerHTML = `
            <div class="slide-content">
                <h2 class="slide-title">${announcement.title}</h2>
                <p class="slide-text">${announcement.description || `${announcement.city} - ${announcement.time || 'Horarios disponibles'}`}</p>
                <button class="cta-button" onclick="sendWhatsAppFromAnnouncement('${announcement.id}')">
                    <i class="fab fa-whatsapp"></i> Agendar Cita
                </button>
            </div>
            <div class="slide-decoration">
                <div class="floating-symbol">${symbols[0]}</div>
                <div class="floating-symbol">${symbols[1]}</div>
                <div class="floating-symbol">${symbols[2]}</div>
            </div>
        `;
        sliderContainer.appendChild(slide);
        
        // Crear dot
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => currentSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Actualizar variables globales
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    window.slides = slides;
    window.dots = dots;
    currentSlideIndex = 0;
    
    // Guardar anuncios para referencia
    window.activeAnnouncements = announcements;
    
    // Activar el primer slide explícitamente
    if (slides.length > 0) {
        // Remover todas las clases activas primero
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Activar el primer slide
        slides[0].classList.add('active');
        if (dots.length > 0) dots[0].classList.add('active');
        currentSlideIndex = 0;
    }
    
    // Detener slideshow anterior y reiniciar con nuevo contenido
    pauseSlideshow();
    setTimeout(() => {
        startSlideshow();
    }, 100);
    
    console.log('✅ Slider actualizado con anuncios del servidor y slideshow reiniciado');
}

async function sendWhatsAppFromAnnouncement(announcementId) {
    try {
        // Buscar el anuncio en los datos guardados
        const announcement = window.activeAnnouncements?.find(ann => ann.id === announcementId);
        
        if (!announcement) {
            sendWhatsApp('consulta-presencial');
            return;
        }
        
        // Obtener configuración del servidor
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        
        let message = '';
        
        if (announcement.whatsappMsg === 'custom' && announcement.customMsg) {
            message = announcement.customMsg;
        } else if (announcement.whatsappMsg === 'viaje-ciudad') {
            message = `¡Hola! Me interesa agendar una cita para la atención en ${announcement.city} el ${formatAnnouncementDate(announcement.date)}. ¿Hay disponibilidad?`;
        } else {
            message = '¡Hola! Me interesa agendar una cita para atención presencial. ¿Cuál es la disponibilidad?';
        }
        
        // Incrementar estadísticas
        await fetch('/api/stats/whatsappClicks', { method: 'POST' });
        
        // Abrir WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const number = config.whatsapp?.number || '573148014430';
        const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        
    } catch (error) {
        console.error('❌ Error enviando WhatsApp:', error);
        // Fallback al método original
        sendWhatsApp('consulta-presencial');
    }
}

function formatAnnouncementDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
}

// Función de diagnóstico
function diagnosticElements() {
    console.log('🔍 Diagnóstico de elementos:');
    console.log('- Slides encontrados:', slides.length);
    console.log('- Dots encontrados:', dots.length);
    console.log('- Loader presente:', !!document.getElementById('loader'));
    console.log('- Botón WhatsApp flotante:', !!document.querySelector('.whatsapp-float'));
    
    if (slides.length === 0) {
        console.error('❌ No se encontraron slides. Verifica el HTML.');
    }
    if (dots.length === 0) {
        console.error('❌ No se encontraron dots. Verifica el HTML.');
    }
}

// ========================
// EVENT LISTENERS
// ========================
function setupEventListeners() {
    // Verificar que los elementos existen antes de configurar eventos
    console.log('🔮 Configurando event listeners...');
    
    // Slider controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeSlide(-1));
        console.log('✅ Botón anterior configurado');
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeSlide(1));
        console.log('✅ Botón siguiente configurado');
    }

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index + 1));
    });

    // Pause slideshow on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', pauseSlideshow);
        sliderContainer.addEventListener('mouseleave', startSlideshow);
    }

    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    
    // Observar elementos animables
    document.querySelectorAll('.service-card, .magic-card, .prosperity-card, .binding-type').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll para links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================
// SLIDER FUNCTIONALITY
// ========================
function changeSlide(direction) {
    // Remover clase activa del slide actual
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Calcular nuevo slide
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Activar nuevo slide
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Reiniciar slideshow automático
    if (slideInterval) {
        clearInterval(slideInterval);
        startSlideshow();
    }
}

function currentSlide(n) {
    // Remover clase activa del slide actual
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Establecer nuevo slide
    currentSlideIndex = n - 1;
    
    // Activar nuevo slide
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Reiniciar slideshow automático
    if (slideInterval) {
        clearInterval(slideInterval);
        startSlideshow();
    }
}

function startSlideshow() {
    // Solo iniciar slideshow si hay slides disponibles
    if (slides && slides.length > 0) {
        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000); // Cambiar cada 5 segundos
        console.log('✅ Slideshow iniciado');
    } else {
        console.log('⚠️ No se encontraron slides, slideshow no iniciado');
    }
}

function pauseSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// ========================
// WHATSAPP FUNCTIONALITY
// ========================
async function contactWhatsApp(service = 'default') {
    // Agregar feedback visual
    const whatsappButton = document.querySelector('.whatsapp-float');
    const originalTooltip = document.querySelector('.whatsapp-tooltip')?.textContent;
    
    try {
        // Mostrar estado de procesamiento
        if (whatsappButton) {
            whatsappButton.classList.add('processing');
            const tooltip = whatsappButton.querySelector('.whatsapp-tooltip');
            if (tooltip) {
                tooltip.textContent = 'Conectando con WhatsApp';
            }
        }
        
        // Obtener configuración de WhatsApp del endpoint público
        const response = await fetch('/api/whatsapp-config');
        const config = await response.json();
        
        // Usar número del servidor o fallback al hardcodeado
        const number = config.whatsapp?.number || WHATSAPP_CONFIG.number;
        const message = WHATSAPP_CONFIG.messages[service] || WHATSAPP_CONFIG.messages.default;
        const encodedMessage = encodeURIComponent(message);
        
        // Limpiar número (remover espacios, guiones, paréntesis)
        const cleanNumber = number.replace(/[^\d+]/g, '');
        
        // Detectar si es móvil para usar el método correcto
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        let whatsappUrl;
        if (isMobile) {
            // En móviles, intentar primero con whatsapp:// y fallback a wa.me
            whatsappUrl = `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`;
            
            // Crear enlace temporal e intentar abrirlo
            const link = document.createElement('a');
            link.href = whatsappUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Agregar al DOM temporalmente
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Fallback después de un pequeño delay
            setTimeout(() => {
                const fallbackUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
                window.location.href = fallbackUrl;
            }, 1000);
        } else {
            // En desktop, usar wa.me directamente
            whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }
        
        // Incrementar estadísticas
        await fetch('/api/stats/whatsappClicks', { method: 'POST' });
        
        // Analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_contact', {
                'service_type': service,
                'event_category': 'engagement',
                'device_type': isMobile ? 'mobile' : 'desktop'
            });
        }
        
        console.log('✅ WhatsApp abierto:', whatsappUrl);
        
    } catch (error) {
        console.error('❌ Error contactando WhatsApp:', error);
        // Fallback simple
        const message = WHATSAPP_CONFIG.messages[service] || WHATSAPP_CONFIG.messages.default;
        const encodedMessage = encodeURIComponent(message);
        const cleanNumber = WHATSAPP_CONFIG.number.replace(/[^\d+]/g, '');
        const fallbackUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        
        // Usar location.href como último recurso
        window.location.href = fallbackUrl;
    } finally {
        // Restaurar estado del botón después de un delay
        setTimeout(() => {
            if (whatsappButton) {
                whatsappButton.classList.remove('processing');
                const tooltip = whatsappButton.querySelector('.whatsapp-tooltip');
                if (tooltip && originalTooltip) {
                    tooltip.textContent = originalTooltip;
                }
            }
        }, 2000);
    }
}

// ========================
// NAVEGACIÓN MÓVIL
// ========================
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ========================
// SCROLL ANIMATIONS
// ========================
function setupScrollAnimations() {
    // Cambiar header en scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(26, 26, 26, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.background = 'rgba(26, 26, 26, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    });
}

// Animaciones al hacer scroll
function animateOnScroll(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Agregar retraso escalonado para tarjetas
            const cards = entry.target.parentElement.children;
            Array.from(cards).forEach((card, index) => {
                if (card === entry.target) {
                    card.style.animationDelay = `${index * 0.1}s`;
                }
            });
        }
    });
}

// ========================
// EFECTOS VISUALES
// ========================
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    // Crear partículas
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
    
    // Crear nuevas partículas periódicamente
    setInterval(() => {
        if (particlesContainer.children.length < 30) {
            createParticle(particlesContainer);
        }
    }, 2000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Propiedades aleatorias
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

// ========================
// SMOOTH SCROLLING
// ========================
function setupSmoothScrolling() {
    // Polyfill para smooth scrolling en navegadores antiguos
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScrollPolyfill = document.createElement('script');
        smoothScrollPolyfill.src = 'https://polyfill.io/v3/polyfill.min.js?features=smoothscroll';
        document.head.appendChild(smoothScrollPolyfill);
    }
}

// ========================
// UTILIDADES
// ========================

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve();
    }
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Estilos del toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Colores según el tipo
    const colors = {
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336'
    };
    
    toast.style.background = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========================
// FORMULARIOS (si se necesitan)
// ========================
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#F44336';
        } else {
            input.style.borderColor = '#4CAF50';
        }
    });
    
    return isValid;
}

// ========================
// PERFORMANCE OPTIMIZATION
// ========================

// Lazy loading para imágenes
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Debounce function para optimizar eventos
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================
// ERROR HANDLING
// ========================
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // Aquí podrías enviar el error a un servicio de logging
});

// ========================
// ANALYTICS Y TRACKING
// ========================
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Console log para desarrollo
    console.log('Event tracked:', eventName, eventData);
}

// Tracking de interacciones
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Track WhatsApp clicks
    if (target.closest('.whatsapp-float') || target.closest('[onclick*="contactWhatsApp"]')) {
        trackEvent('whatsapp_click', {
            element: target.className || 'whatsapp-button'
        });
    }
    
    // Track section navigation
    if (target.closest('.nav-link')) {
        trackEvent('navigation_click', {
            section: target.getAttribute('href')
        });
    }
});

// ========================
// SERVICE WORKER (PWA) - DESHABILITADO TEMPORALMENTE
// ========================
// TODO: Crear sw.js para funcionalidad PWA
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado exitosamente:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker falló al registrarse:', error);
            });
    });
}
*/

// ========================
// MÉTODOS PÚBLICOS
// ========================
window.ManantialApp = {
    contactWhatsApp,
    changeSlide,
    currentSlide,
    showToast,
    trackEvent
};

// Exportar funciones principales para uso global
window.contactWhatsApp = contactWhatsApp;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;