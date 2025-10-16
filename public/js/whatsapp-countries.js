// ================================
// VALIDACIÓN SIMPLE DE WHATSAPP
// ================================

// Función simple para validar número de WhatsApp
function validateWhatsAppNumber(phoneNumber) {
    // Limpiar el número
    const cleaned = phoneNumber.trim();
    
    // Debe empezar con +
    if (!cleaned.startsWith('+')) {
        return { 
            valid: false, 
            error: 'El número debe empezar con + seguido del código de país',
            suggestion: 'Ejemplo: +573148014430'
        };
    }
    
    // Extraer solo números después del +
    const numbers = cleaned.substring(1).replace(/\D/g, '');
    
    // Validar longitud (códigos de país + número local)
    if (numbers.length < 10 || numbers.length > 15) {
        return { 
            valid: false, 
            error: 'El número debe tener entre 10 y 15 dígitos',
            suggestion: 'Verifica que incluyas el código de país y el número completo'
        };
    }
    
    // Detectar algunos países comunes
    let country = 'Desconocido';
    if (numbers.startsWith('57')) country = 'Colombia 🇨🇴';
    else if (numbers.startsWith('54')) country = 'Argentina 🇦🇷';
    else if (numbers.startsWith('56')) country = 'Chile 🇨🇱';
    else if (numbers.startsWith('51')) country = 'Perú 🇵🇪';
    else if (numbers.startsWith('52')) country = 'México 🇲🇽';
    else if (numbers.startsWith('34')) country = 'España 🇪🇸';
    else if (numbers.startsWith('1')) country = 'USA/Canadá 🇺🇸🇨🇦';
    else if (numbers.startsWith('55')) country = 'Brasil 🇧🇷';
    
    return { 
        valid: true, 
        country: country,
        cleanNumber: numbers,
        formatted: `+${numbers}`,
        whatsappUrl: `https://wa.me/${numbers}`
    };
}

// Función para validar en tiempo real
function validateWhatsAppInput(input) {
    const value = input.value;
    const indicator = document.getElementById('validation-indicator');
    const message = document.getElementById('validation-message');
    
    // Limpiar estados anteriores
    input.classList.remove('valid', 'invalid');
    indicator.classList.remove('valid', 'invalid');
    message.classList.remove('show', 'success', 'error');
    
    if (!value) {
        return; // No mostrar nada si está vacío
    }
    
    const validation = validateWhatsAppNumber(value);
    
    if (validation.valid) {
        // Válido
        input.classList.add('valid');
        indicator.classList.add('valid');
        message.textContent = `✅ Número válido para ${validation.country}`;
        message.classList.add('show', 'success');
    } else {
        // Inválido
        input.classList.add('invalid');
        indicator.classList.add('invalid');
        message.textContent = `❌ ${validation.error}. ${validation.suggestion || ''}`;
        message.classList.add('show', 'error');
    }
}

// Función para probar el número de WhatsApp
function testWhatsAppNumber() {
    const input = document.getElementById('whatsapp-number');
    const number = input.value.trim();
    
    if (!number) {
        alert('Por favor ingresa un número de WhatsApp');
        return;
    }
    
    const validation = validateWhatsAppNumber(number);
    
    if (!validation.valid) {
        alert(`Error: ${validation.error}\n\n${validation.suggestion || ''}`);
        return;
    }
    
    // Abrir WhatsApp con mensaje de prueba
    const testMessage = 'Hola! Este es un mensaje de prueba para verificar que el número de WhatsApp está funcionando correctamente. 🔮';
    const url = `${validation.whatsappUrl}?text=${encodeURIComponent(testMessage)}`;
    
    if (confirm(`¿Abrir WhatsApp para probar el número ${validation.formatted}?\n\nPaís detectado: ${validation.country}`)) {
        window.open(url, '_blank');
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.validateWhatsAppNumber = validateWhatsAppNumber;
    window.validateWhatsAppInput = validateWhatsAppInput;
    window.testWhatsAppNumber = testWhatsAppNumber;
}

// Códigos de país más comunes para referencia
const COMMON_COUNTRY_CODES = {
    '+1': 'Estados Unidos / Canadá ��🇨🇦',
    '+52': 'México ��',
    '+57': 'Colombia 🇨🇴',
    '+54': 'Argentina �🇷',
    '+56': 'Chile ��',
    '+51': 'Perú 🇵🇪',
    '+55': 'Brasil �🇷',
    '+34': 'España 🇪🇸',
    
    // Otros países populares
    'GB': { name: 'Reino Unido', code: '+44', flag: '🇬🇧' },
    'FR': { name: 'Francia', code: '+33', flag: '🇫🇷' },
    'DE': { name: 'Alemania', code: '+49', flag: '🇩🇪' },
    'IT': { name: 'Italia', code: '+39', flag: '🇮🇹' },
    'PT': { name: 'Portugal', code: '+351', flag: '🇵🇹' }
};

// Función para detectar país por código
function detectCountryByCode(phoneNumber) {
    if (!phoneNumber.startsWith('+')) return null;
    
    // Buscar coincidencia exacta primero (para códigos más largos)
    const sortedCodes = Object.entries(COUNTRY_CODES)
        .sort(([,a], [,b]) => b.code.length - a.code.length);
    
    for (const [countryCode, data] of sortedCodes) {
        if (phoneNumber.startsWith(data.code)) {
            return {
                country: countryCode,
                ...data,
                number: phoneNumber.substring(data.code.length)
            };
        }
    }
    return null;
}

// Función para formatear número de WhatsApp
function formatWhatsAppNumber(countryCode, phoneNumber) {
    const country = COUNTRY_CODES[countryCode];
    if (!country) return null;
    
    // Limpiar número (solo dígitos)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Formatear con código de país
    return {
        full: `${country.code}${cleanNumber}`,
        display: `${country.flag} ${country.code} ${cleanNumber}`,
        country: country.name,
        code: country.code,
        flag: country.flag
    };
}

// Función para validar número de WhatsApp
function validateWhatsAppNumber(phoneNumber) {
    // Debe empezar con +
    if (!phoneNumber.startsWith('+')) {
        return { valid: false, error: 'El número debe empezar con +' };
    }
    
    // Detectar país
    const detected = detectCountryByCode(phoneNumber);
    if (!detected) {
        return { valid: false, error: 'Código de país no válido' };
    }
    
    // Validar longitud del número local
    const localNumber = detected.number;
    if (localNumber.length < 7 || localNumber.length > 15) {
        return { valid: false, error: 'Longitud de número no válida' };
    }
    
    // Solo dígitos en número local
    if (!/^\d+$/.test(localNumber)) {
        return { valid: false, error: 'El número solo debe contener dígitos' };
    }
    
    return { 
        valid: true, 
        formatted: detected,
        country: detected.name,
        code: detected.code,
        flag: detected.flag
    };
}

// Función para crear URL de WhatsApp
function createWhatsAppURL(phoneNumber, message = '') {
    const validation = validateWhatsAppNumber(phoneNumber);
    if (!validation.valid) return null;
    
    const cleanNumber = phoneNumber.replace(/\D/g, ''); // Solo números, sin +
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.WhatsAppCountryCodes = {
        COUNTRY_CODES,
        detectCountryByCode,
        formatWhatsAppNumber,
        validateWhatsAppNumber,
        createWhatsAppURL
    };
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COUNTRY_CODES,
        detectCountryByCode,
        formatWhatsAppNumber,
        validateWhatsAppNumber,
        createWhatsAppURL
    };
}