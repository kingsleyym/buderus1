// Newsletter JavaScript Funktionalität
class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.submitButton = this.form.querySelector('.newsletter-submit');
        this.buttonText = this.submitButton.querySelector('.button-text');
        this.loadingSpinner = this.submitButton.querySelector('.loading-spinner');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.validateForm();
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', this.validateForm.bind(this));
            input.addEventListener('blur', this.validateField.bind(this, input));
        });
        
        console.log('Newsletter Manager initialisiert');
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showError('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
            return;
        }
        
        this.setLoadingState(true);
        this.hideMessages();
        
        try {
            const formData = this.getFormData();
            
            // Prüfe ob Firebase verfügbar ist
            if (window.firebaseReady) {
                await this.submitToFirebase(formData);
            } else {
                // Fallback: Lokale Speicherung oder andere Methode
                await this.submitFallback(formData);
            }
            
            this.showSuccess();
            this.resetForm();
            
        } catch (error) {
            console.error('Newsletter Anmeldung Fehler:', error);
            this.showError(error.message || 'Ein unerwarteter Fehler ist aufgetreten.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        return {
            email: formData.get('email').trim().toLowerCase(),
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            company: formData.get('company').trim(),
            privacy: formData.get('privacy') === 'on',
            marketing: formData.get('marketing') === 'on',
            timestamp: new Date().toISOString(),
            source: 'website',
            ipAddress: null, // Wird server-seitig gesetzt
            userAgent: navigator.userAgent,
            language: navigator.language,
            confirmed: false, // Double-Opt-In
            subscriptionId: this.generateSubscriptionId()
        };
    }
    
    generateSubscriptionId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async submitToFirebase(data) {
        try {
            // Firebase Cloud Function aufrufen
            const subscribeFunction = window.firebase.functions().httpsCallable('subscribeNewsletter');
            const result = await subscribeFunction(data);
            
            if (!result.data.success) {
                throw new Error(result.data.error || 'Firebase Anmeldung fehlgeschlagen');
            }
            
            console.log('Newsletter Anmeldung erfolgreich:', result.data);
            
        } catch (error) {
            console.error('Firebase Fehler:', error);
            throw new Error('Anmeldung konnte nicht verarbeitet werden. Bitte versuchen Sie es später erneut.');
        }
    }
    
    async submitFallback(data) {
        // Fallback Methode (z.B. an einen Webhook senden oder lokal speichern)
        console.log('Fallback: Newsletter Daten:', data);
        
        // Simuliere API Call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Für Demo: Speichere in localStorage
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        // Prüfe auf Duplikate
        if (subscribers.some(sub => sub.email === data.email)) {
            throw new Error('Diese E-Mail-Adresse ist bereits registriert.');
        }
        
        subscribers.push(data);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        
        console.log('Newsletter Anmeldung gespeichert (Fallback)');
    }
    
    validateForm() {
        const email = this.form.email.value.trim();
        const privacy = this.form.privacy.checked;
        
        const isValid = this.isValidEmail(email) && privacy;
        
        this.submitButton.disabled = !isValid;
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        
        switch (input.type) {
            case 'email':
                isValid = this.isValidEmail(value);
                break;
            case 'checkbox':
                if (input.required) {
                    isValid = input.checked;
                }
                break;
            default:
                if (input.required) {
                    isValid = value.length > 0;
                }
        }
        
        input.classList.toggle('invalid', !isValid && value.length > 0);
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    setLoadingState(loading) {
        this.submitButton.disabled = loading;
        this.buttonText.style.display = loading ? 'none' : 'inline';
        this.loadingSpinner.style.display = loading ? 'inline' : 'none';
        
        // Prevent multiple submissions
        if (loading) {
            this.form.style.pointerEvents = 'none';
        } else {
            this.form.style.pointerEvents = '';
        }
    }
    
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        this.errorMessage.style.display = 'none';
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Scroll to error message
        this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    resetForm() {
        this.form.reset();
        this.validateForm();
        
        // Remove validation classes
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('invalid');
        });
    }
}

// Analytics und Tracking (optional)
class NewsletterAnalytics {
    static trackEvent(eventName, data = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Newsletter',
                ...data
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, data);
        }
        
        console.log('Newsletter Event:', eventName, data);
    }
    
    static trackFormView() {
        this.trackEvent('newsletter_form_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    static trackFormSubmission(email) {
        this.trackEvent('newsletter_subscription', {
            email_domain: email.split('@')[1],
            timestamp: new Date().toISOString()
        });
    }
    
    static trackFormError(error) {
        this.trackEvent('newsletter_error', {
            error_message: error,
            timestamp: new Date().toISOString()
        });
    }
}

// DSGVO Compliance Helper
class DSGVOHelper {
    static generateConsentRecord(formData) {
        return {
            timestamp: new Date().toISOString(),
            ip: null, // Wird server-seitig gesetzt
            userAgent: navigator.userAgent,
            consentVersion: '1.0',
            consentText: 'Ich stimme der Datenschutzerklärung zu',
            marketingConsent: formData.marketing,
            formUrl: window.location.href,
            subscriptionId: formData.subscriptionId
        };
    }
    
    static validateConsent(formData) {
        if (!formData.privacy) {
            throw new Error('Datenschutzerklärung muss akzeptiert werden');
        }
        return true;
    }
}

// Initialisierung wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter Manager starten
    window.newsletterManager = new NewsletterManager();
    
    // Analytics Event für Seitenaufruf
    NewsletterAnalytics.trackFormView();
    
    // Service Worker für Offline Support (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker Registrierung fehlgeschlagen:', err);
        });
    }
    
    console.log('Newsletter System initialisiert');
});

// Export für Node.js Testing (falls nötig)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NewsletterManager, NewsletterAnalytics, DSGVOHelper };
}
