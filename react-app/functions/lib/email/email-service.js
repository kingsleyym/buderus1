"use strict";
// ===================================
// EMAIL SERVICE
// SMTP Service für Newsletter System
// ===================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer = __importStar(require("nodemailer"));
const template_functions_1 = require("../templates/template-functions");
class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    /**
     * SMTP Transporter initialisieren
     * Flexibel zwischen Jonas SMTP und Hetzner Server
     */
    async initializeTransporter() {
        try {
            // SMTP Konfiguration aus Environment oder Firestore
            const smtpConfig = await this.getSMTPConfig();
            this.transporter = nodemailer.createTransport({
                host: smtpConfig.host,
                port: smtpConfig.port,
                secure: smtpConfig.secure,
                auth: {
                    user: smtpConfig.user,
                    pass: smtpConfig.password
                },
                pool: true,
                maxConnections: 5,
                maxMessages: 100
            });
            // Verbindung testen
            if (this.transporter) {
                await this.transporter.verify();
            }
            console.log('SMTP Transporter erfolgreich initialisiert');
        }
        catch (error) {
            console.error('SMTP Transporter Initialisierung fehlgeschlagen:', error);
            // Fallback auf lokalen SMTP oder Test-Modus
            this.createFallbackTransporter();
        }
    }
    /**
     * SMTP Konfiguration abrufen
     */
    async getSMTPConfig() {
        // TODO: Aus Environment Variables oder Firestore Config laden
        // Aktuell: Jonas SMTP, später: Hetzner Server
        return {
            host: process.env.SMTP_HOST || 'mail.yourdomain.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER || 'noreply@buderus-systeme.de',
            password: process.env.SMTP_PASSWORD || ''
        };
    }
    /**
     * Fallback Transporter für Tests
     */
    createFallbackTransporter() {
        console.log('Erstelle Fallback Transporter (Test-Modus)');
        this.transporter = nodemailer.createTransport({
            jsonTransport: true
        });
    }
    /**
     * E-Mail senden
     */
    async sendEmail(options) {
        try {
            if (!this.transporter) {
                await this.initializeTransporter();
            }
            if (!this.transporter) {
                throw new Error('E-Mail Transporter nicht verfügbar');
            }
            const mailOptions = {
                from: options.from || 'Buderus Systeme <noreply@buderus-systeme.de>',
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                replyTo: options.replyTo || 'info@buderus-systeme.de'
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log('E-Mail erfolgreich gesendet:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Fehler beim Senden der E-Mail:', error);
            return false;
        }
    }
    /**
     * Bestätigungs-E-Mail senden (Double Opt-In)
     */
    async sendConfirmationEmail(email, confirmationToken, personalization) {
        try {
            const template = await (0, template_functions_1.getTemplate)('newsletter-confirmation');
            // Template personalisieren
            const personalizedHtml = this.personalizeTemplate(template.html, Object.assign(Object.assign({}, personalization), { confirmationLink: `https://buderus-systeme.de/newsletter/confirm?token=${confirmationToken}`, email: email }));
            const personalizedText = this.personalizeTemplate(template.text || '', Object.assign(Object.assign({}, personalization), { confirmationLink: `https://buderus-systeme.de/newsletter/confirm?token=${confirmationToken}`, email: email }));
            return await this.sendEmail({
                to: email,
                subject: 'Newsletter-Anmeldung bestätigen - Buderus Systeme',
                html: personalizedHtml,
                text: personalizedText
            });
        }
        catch (error) {
            console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error);
            return false;
        }
    }
    /**
     * Willkommens-E-Mail senden
     */
    async sendWelcomeEmail(email, personalization) {
        try {
            const template = await (0, template_functions_1.getTemplate)('newsletter-welcome');
            const personalizedHtml = this.personalizeTemplate(template.html, Object.assign(Object.assign({}, personalization), { unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`, email: email }));
            const personalizedText = this.personalizeTemplate(template.text || '', Object.assign(Object.assign({}, personalization), { unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`, email: email }));
            return await this.sendEmail({
                to: email,
                subject: 'Willkommen im Newsletter - Buderus Systeme',
                html: personalizedHtml,
                text: personalizedText
            });
        }
        catch (error) {
            console.error('Fehler beim Senden der Willkommens-E-Mail:', error);
            return false;
        }
    }
    /**
     * Newsletter versenden
     */
    async sendNewsletter(email, subject, htmlContent, personalization, textContent) {
        try {
            // Template personalisieren
            const personalizedHtml = this.personalizeTemplate(htmlContent, Object.assign(Object.assign({}, personalization), { unsubscribeLink: `https://buderus-systeme.de/newsletter/unsubscribe?email=${encodeURIComponent(email)}`, email: email }));
            const personalizedText = textContent ?
                this.personalizeTemplate(textContent, personalization) :
                undefined;
            return await this.sendEmail({
                to: email,
                subject: subject,
                html: personalizedHtml,
                text: personalizedText
            });
        }
        catch (error) {
            console.error('Fehler beim Senden des Newsletters:', error);
            return false;
        }
    }
    /**
     * Template mit Variablen personalisieren
     */
    personalizeTemplate(template, data) {
        let personalized = template;
        // Standard-Variablen ersetzen
        Object.keys(data).forEach(key => {
            const value = data[key] || '';
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            personalized = personalized.replace(regex, value);
        });
        // Vollständigen Namen zusammensetzen
        const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
        personalized = personalized.replace(/{{[\s]*fullName[\s]*}}/g, fullName);
        // Anrede generieren
        const salutation = data.firstName ? `Hallo ${data.firstName}` : 'Hallo';
        personalized = personalized.replace(/{{[\s]*salutation[\s]*}}/g, salutation);
        // Datum formatieren
        const currentDate = new Date().toLocaleDateString('de-DE');
        personalized = personalized.replace(/{{[\s]*currentDate[\s]*}}/g, currentDate);
        // Firmen-spezifische Variablen
        personalized = personalized.replace(/{{[\s]*companyName[\s]*}}/g, 'Buderus Systeme GmbH');
        personalized = personalized.replace(/{{[\s]*websiteUrl[\s]*}}/g, 'https://buderus-systeme.de');
        return personalized;
    }
    /**
     * Transporter Status prüfen
     */
    async isHealthy() {
        try {
            if (!this.transporter) {
                await this.initializeTransporter();
            }
            if (!this.transporter) {
                return false;
            }
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            console.error('E-Mail Service Gesundheitscheck fehlgeschlagen:', error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email-service.js.map