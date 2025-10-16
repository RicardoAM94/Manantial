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
    else if (numbers.startsWith('593')) country = 'Ecuador 🇪🇨';
    else if (numbers.startsWith('591')) country = 'Bolivia 🇧🇴';
    else if (numbers.startsWith('598')) country = 'Uruguay 🇺🇾';
    else if (numbers.startsWith('595')) country = 'Paraguay 🇵🇾';
    
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

// Códigos de país más comunes para referencia rápida
const COMMON_CODES = {
    'Colombia': '+57',
    'Argentina': '+54', 
    'Chile': '+56',
    'Perú': '+51',
    'México': '+52',
    'España': '+34',
    'Brasil': '+55',
    'Ecuador': '+593',
    'USA/Canadá': '+1'
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.validateWhatsAppNumber = validateWhatsAppNumber;
    window.validateWhatsAppInput = validateWhatsAppInput;
    window.testWhatsAppNumber = testWhatsAppNumber;
    window.COMMON_CODES = COMMON_CODES;
}